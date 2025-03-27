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
        // Get the logged-in user
        let user = await fetchUser();
        console.log(user?.id);

        if (!user?.id) {
            throw new Error("User not found");
        }

        // Query and return all models where user.id exists
        let models = await prisma.model.findMany({
            where: {
                userId: user.id
            }
        });

        console.log("Models for user:", models);

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

// export const fetchFileFromCDN = async (fileUrl: string) => {
//     try {
//         const response = await fetch(fileUrl);

//         if (!response.ok) {
//             throw new Error(`Failed to fetch file: ${response.statusText}`);
//         }

//         const arrayBuffer = await response.arrayBuffer();

//         return {
//             fileUrl,
//             content: Buffer.from(arrayBuffer).toString("base64"), // Convert to base64 for safe transfer
//         };
//     } catch (error) {
//         console.error("Error fetching file from CDN:", error);
//         throw error;
//     }

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
