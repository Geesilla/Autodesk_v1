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
      userId: dbUser.id,
    },
    include: {
      models: true, // Include associated models in the response
    },
  });

  return projects;
}

// Add a model to a project
export async function addModelToProjectAction(projectId: string, modelId: string) {
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

  // Ensure the model exists and belongs to the user
  const model = await prisma.model.findUnique({
    where: {
      id: modelId,
    },
  });

  if (!model || model.userId !== dbUser.id) {
    throw new Error("Model not found or does not belong to the user.");
  }

  // Update the model to associate it with the project
  const updatedModel = await prisma.model.update({
    where: {
      id: modelId,
    },
    data: {
      projectId,
    },
  });

  return updatedModel;
}

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
