"use server";

import prisma from "../../../prisma/client";
import { currentUser } from "@clerk/nextjs/server";

// Create a new project for the logged-in user
export async function createProjectAction(name: string, description: string) {
  // Get the current user from Clerk
  const user = await currentUser();
  if (!user?.id) {
    throw new Error("User not found");
  }

  // Check if a corresponding user record exists in your database.
  // Your User model uses 'clerkId' to store the Clerk user ID.
  let dbUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    // If no record exists, you can either create one here automatically
    // or throw an error instructing you to initialize the user.
    throw new Error("User record not found in database. Please initialize the user.");
  }

  // Now create the project using the database user's id
  const newProject = await prisma.project.create({
    data: {
      name,
      description,
      userId: dbUser.id, // Use the database user's ID here
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
  });

  return projects;
}
