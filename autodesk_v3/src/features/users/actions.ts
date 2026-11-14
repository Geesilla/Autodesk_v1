'use server'
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../prisma/client";

export const initialiseNewUser = async () => {
    try {
        const user = await currentUser();
        const userId = user?.id;

        console.log("Current user ID:", userId);

        if (!userId) {
            throw new Error("User ID is undefined");
        }

        // if user exists (connected clerk with db user)
        const userObj = await prisma.user.findFirst({
            where: {
                clerkId: userId
            }
        });

        console.log("User object from DB:", userObj);

        if (!userObj) {
            // return create new User.
            const newUser = await prisma.user.create({
                data: {
                    clerkId: userId
                }
            });
            console.log("New user created:", newUser);
            return newUser;
        } else {
            return userObj;
        }
    } catch (error) {
        console.error("Error in initialiseNewUser:", error);
        throw error;
    }
};

export const fetchUser = async () => {
    try {
        const user = await currentUser();
        const userId = user?.id

        console.log( userId )

        // if user exits ( connected clerk with db user )
        return await prisma.user.findFirst({
            where: {
                clerkId: userId
            }
        });
    
    }
    catch ( error ) {
        throw error;
    }
}

