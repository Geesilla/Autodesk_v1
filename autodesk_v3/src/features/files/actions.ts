'use server'
import prisma from "../../../prisma/client"
import { fetchUser } from "../users/actions"

type uploadModelParams = {
    fileUrl: String;
    fileName: String;
    thumbnailUrl: String;
    metadata: any;
}

export const saveUploadedModel = async ( { fileUrl , fileName , thumbnailUrl , metadata } : uploadModelParams ) => {
    try {
        console.log( fileUrl , fileName , thumbnailUrl , metadata );
        let user = await fetchUser();
        console.log ( user?.id );

        // get current User id.
        // create the model.
        // let newModel = await prisma.model.create({
        //     data: {
                
        //     }
        // })
        // create a model version.
        // return the model.
    }
    catch ( error ) {
        throw error;
    }
}


export const getModelsForUser = async ( ) => {
    try {
        // get user logged. 
        let user = await fetchUser();
        console.log ( user?.id );
        // query and return all models where user.id exists.
    }
    catch ( error ) {

    }
}