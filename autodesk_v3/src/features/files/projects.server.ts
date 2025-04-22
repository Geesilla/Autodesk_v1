"use server";

import prisma from "../../../prisma/client";
import { currentUser } from "@clerk/nextjs/server";

// Create a new project for the logged-in user
export async function createProjectAction(name: string, description: string) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not found");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database. Please initialize the user.");
  }

  const newProject = await prisma.project.create({
    data: {
      name,
      description,
      userId: dbUser.id,
    },
  });

  return newProject;
}

// Assign models to a project
export async function addModelsToProjectAction(modelIds: string[], projectId: string) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not found");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database. Please initialize the user.");
  }

  // Ensure the project exists and belongs to the user
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.userId !== dbUser.id) {
    throw new Error("Project not found or does not belong to the user.");
  }

  // Update the models to associate them with the project
  const updatedModels = await prisma.model.updateMany({
    where: {
      id: { in: modelIds },
      userId: dbUser.id, // Ensure these models belong to the logged-in user
    },
    data: {
      projectId,
    },
  });

  return updatedModels;
}

// Get all projects for the logged-in user
export async function getProjectsForUserAction() {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not found");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database. Please initialize the user.");
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: dbUser.id, // Ensure projects belong to the logged-in user
    },
    include: {
      models: {
        where: {
          userId: dbUser.id, // Ensure models belong to the logged-in user
        },
        include: {
          project: true, // Include the project relation for models
        },
      },
    },
  });

  return projects;
}

// Add a model to a project
export const addModelToProjectAction = async (projectId: string, modelId: string) => {
  try {
    // Update the model to associate it with the project
    await prisma.model.update({
      where: { id: modelId },
      data: { projectId },
    });

    return { success: true, message: "Model added to project successfully" };
  } catch (error) {
    console.error("Error adding model to project:", error);
    throw new Error("Failed to add model to project.");
  }
};

// Add an asset (model) to a project
export async function addAssetToProjectAction(projectId: string, assetId: string) {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not found");
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    throw new Error("User record not found in database. Please initialize the user.");
  }

  // Ensure the project exists and belongs to the user
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.userId !== dbUser.id) {
    throw new Error("Project not found or does not belong to the user.");
  }

  // Ensure the model (asset) exists and belongs to the user
  const asset = await prisma.model.findUnique({
    where: {
      id: assetId,
    },
  });

  if (!asset || asset.userId !== dbUser.id) {
    throw new Error("Asset not found or does not belong to the user.");
  }

  // Update the model to associate it with the project
  const updatedAsset = await prisma.model.update({
    where: {
      id: assetId,
    },
    data: {
      projectId,
    },
  });

  return updatedAsset;
}

// Delete a project by its ID
export const deleteProjectAction = async (projectId: string) => {
  try {
    // Delete the project by its ID
    await prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true, message: "Project deleted successfully" };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project.");
  }
};
