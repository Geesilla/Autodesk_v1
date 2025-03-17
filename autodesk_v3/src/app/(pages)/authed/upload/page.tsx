'use client'

import {CldUploadWidget} from "next-cloudinary"

export default function Upload(){
    return(
        <main className="p-16 text center">
            <h1 className="text-5xl font-medium py-8">Image Upload</h1>
            <section className="flex flex-col items-center justify-between">
                <CldUploadWidget uploadPreset="JRGS_Tech_app">
                    {({ open }) => {
                        return <button onClick ={() => open ()}>Upload an Image</button>;
                    }}
                </CldUploadWidget>
            </section>
        </main>
    )
}