'use server'
import { currentUser } from "@clerk/nextjs/server";
import prisma from "../../../../../prisma/client"

export const getCurrentUser = async  () => {
    try {
        let user = await currentUser();
        let userId = user?.id

        // if user exits ( connected clerk with db user )
        let userObj = await prisma.user.findFirst({
            where: {
                userId
            }
        });
        if( !userObj) {
            //return create new User. 
            
        } else {
            return userObj;
        }
    }
    catch ( error ) {
        throw error;
    }
}


// export const getFilesForUser = async ( ) => {
//     try {
//         // use clerk to get user id from current logged in user.
//         const user_id = currentUser();
//         const files = await prisma.file.findMany({
//             where: {
//                 userId : user_id
//             }
//         });
//     }
//     catch ( error ) {
//         throw error;
//     }
// }