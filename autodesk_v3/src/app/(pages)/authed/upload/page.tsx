'use client'

import { CldUploadWidget , CldUploadButton } from "next-cloudinary"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveUploadedModel } from "@/features/files/actions"

export default function Upload() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState("")

    async function handleUpload(result: any) {
        if (!isLoaded || !user) {
            setMessage("You must be logged in to upload a model.")
            return
        }

        setUploading(true)
        setMessage("Uploading...")

        const fileUrl = result.info.secure_url
        const fileName = result.info.original_filename
        const thumbnailUrl = result.info.thumbnail_url || fileUrl
        const metadata = {
            format: result.info.format,
            width: result.info.width,
            height: result.info.height,
            size: result.info.bytes,
        }

        console.log( fileUrl , fileName , thumbnailUrl , metadata )
        await saveUploadedModel({ fileName , fileUrl , thumbnailUrl , metadata });
        setMessage("Uploaded")
    }

    if (!isLoaded) return <p>Loading...</p>
    if (!user) {
        router.push("/sign-in") // Redirect to Clerk sign-in page
        return null
    }

    return (
        <main className="p-16 text-center">
            <h1 className="text-5xl font-medium py-8">Upload 3D Model</h1>
            <section className="flex flex-col items-center justify-between">
                <CldUploadButton

                    uploadPreset="JRGS_Tech_app"
                    onSuccess={(result) => handleUpload(result)}
                >
                  
                        {/* <button disabled={uploading} onClick={() => open()}>
                            {uploading ? "Uploading..." : "Upload a Model"}
                        </button> */}
                </CldUploadButton>
            </section>
            {message && <p className="mt-4">{message}</p>}
        </main>
    )
}
