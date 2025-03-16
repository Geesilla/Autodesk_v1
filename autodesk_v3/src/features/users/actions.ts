'use server'
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../prisma/client";

export const initialiseNewUser = async  () => {
    try {
        let user = await currentUser();
        let userId = user?.id

        console.log( userId )

        // if user exits ( connected clerk with db user )
        let userObj = await prisma.user.findFirst({
            where: {
                userId
            }
        });
        if( !userObj) {
            //return create new User. 
            return prisma.user.create({
               data: {
                    userId: userId
               } 
            })
        } else {
            return userObj;
        }
    }
    catch ( error ) {
        throw error;
    }
}

export const fetchUser = async  () => {
    try {
        let user = await currentUser();
        let userId = user?.id

        console.log( userId )

        // if user exits ( connected clerk with db user )
        return await prisma.user.findFirst({
            where: {
                userId
            }
        });
    
    }
    catch ( error ) {
        throw error;
    }
}

