'use server'
import prisma from "../../../prisma/client"
import { fetchUser } from "../users/actions"


type uploadModelParams = {
    fileUrl: string;
    fileName: string;
    thumbnail: string;
    metadata: any;
    name: string;
    description: string;
    thumbnailUrl: string;
    tags?: string[];      // New field for tags
    projectId?: string;   // New field for project association
  };
  
  export const saveUploadedModel = async ({
    fileUrl,
    fileName,
    thumbnailUrl,
    metadata,
    tags,
    projectId,
  }: uploadModelParams) => {
    try {
      let user = await fetchUser();
      if (!user?.id) {
        throw new Error("User not found");
      }
  
      // Create the model, including the project association if provided
      let newModel = await prisma.model.create({
        data: {
          userId: user.id,
          fileUrl,
          name: fileName,
          description: metadata.description ?? "No description provided",
          metadata,
          projectId: projectId || null,
        },
      });
  
      let newModelVersion = await prisma.modelVersion.create({
        data: {
          modelId: newModel.id,
          version: 1,
          fileUrl,
          metadata,
          thumbnail: thumbnailUrl,
        },
      });
  
      // Process tags if provided
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          let tag = await prisma.tag.findUnique({ where: { name: tagName } });
          if (!tag) {
            tag = await prisma.tag.create({ data: { name: tagName } });
          }
          await prisma.modelTag.create({
            data: {
              modelId: newModel.id,
              tagId: tag.id,
            },
          });
        }
      }
  
      return newModel;
    } catch (error) {
      console.error("Error in saveUploadedModel:", error);
      throw error;
    }
  };

  export const getModelsForUser = async () => {
    try {
      let user = await fetchUser();
  
      if (!user?.id) {
        throw new Error("User not found");
      }
  
      let models = await prisma.model.findMany({
        where: {
          userId: user.id,
        },
        include: {
          versions: {
            orderBy: {
              version: "desc", // ensures the latest version comes first
            },
          },
        },
      });
  
      return models;
    } catch (error) {
      console.error("Error in getModelsForUser:", error);
      throw error;
    }
}

export const getUploadedModel = async (modelId: string) => {
    try {
        // Fetch the model details from the database
        let model = await prisma.model.findUnique({
            where: {
                id: modelId
            }
        });

        if (!model) {
            throw new Error("Model not found");
        }

        console.log("Model details from DB:", model);

        // Fetch the file from the CDN using the fileUrl
        let file = await fetchFileFromCDN(model.fileUrl);

        console.log("File details from CDN:", file);

        return {
            model,
            file
        };
    } catch (error) {
        console.error("Error in getUploadedModel:", error);
        throw error;
    }
}

export const fetchFileFromCDN = async (fileUrl: string) => {
    try {
      const response = await fetch(fileUrl);
  
      console.log("Status:", response.status); // should be 200
      console.log("OK:", response.ok);         // should be true
      console.log("Content-Type:", response.headers.get("content-type")); // should show something like application/octet-stream
  
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
  
      const arrayBuffer = await response.arrayBuffer();
  
      return {
        fileUrl,
        content: Buffer.from(arrayBuffer).toString("base64"),
      };
    } catch (error) {
      console.error("💥 Error fetching file from CDN:", error);
      throw error;
    }
  };

export const deleteModel = async (modelId: string) => {
    try {
        let user = await fetchUser();
        if (!user?.id) {
            throw new Error("User not found");
        }

        const model = await prisma.model.findUnique({
            where: { id: modelId },
        });

        if (!model || model.userId !== user.id) {
            throw new Error("Model not found or unauthorized");
        }

        await prisma.modelVersion.deleteMany({ where: { modelId } });
        await prisma.modelTag.deleteMany({ where: { modelId } });
        await prisma.model.delete({ where: { id: modelId } });

        return { success: true, message: "Model deleted successfully" };
    } catch (error) {
        console.error("Error in deleteModel:", error);
        throw error;
    }
};
