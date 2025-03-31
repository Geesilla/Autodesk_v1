"use server";

import prisma from "../../../prisma/client";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Fetch all comments for a specific ModelVersion (descending by created date).
 * We also join the user who made the comment so you can see their clerkId (or name).
 */
export async function getCommentsForModelVersion(modelVersionId: string) {
  return await prisma.comment.findMany({
    where: { modelVersionId },
    include: {
      user: {
        // If you have a "name" field in the DB, select it here. 
        // Otherwise, just show clerkId or any other user field you store in your DB.
        select: { clerkId: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Add a new comment for a specific ModelVersion. The user is determined via Clerk.
 */
export async function addCommentForModelVersion(modelVersionId: string, text: string) {
  console.log("addCommentForModelVersion called with:", { modelVersionId, text }); // Debug log
  const user = await currentUser();
  if (!user?.id) {
    console.error("User not authenticated");
    throw new Error("User not authenticated");
  }

  try {
    // Find the corresponding user record in your DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      console.error("User record not found in DB for clerkId:", user.id);
      throw new Error("User record not found in DB.");
    }

    // Create the comment, referencing the modelVersion and the DB user
    const comment = await prisma.comment.create({
      data: {
        text,
        modelVersionId,
        userId: dbUser.id,
      },
    });

    console.log("Comment successfully saved:", comment);
    return comment;
  } catch (error) {
    console.error("Error saving comment:", error);
    throw new Error("Failed to save comment.");
  }
}
