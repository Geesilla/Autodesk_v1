'use client'

import { CldUploadWidget } from "next-cloudinary"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

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

        try {
            // Step 1: Find or create the user's model
            const modelResponse = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clerkId: user.id, // Using Clerk ID instead of NextAuth
                    name: fileName,
                    description: "Uploaded via Cloudinary",
                }),
            })

            const modelData = await modelResponse.json()
            if (!modelResponse.ok) throw new Error(modelData.error || "Failed to create model")

            // Step 2: Create a new ModelVersion entry
            const versionResponse = await fetch("/api/modelVersions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    modelId: modelData.id,
                    fileUrl,
                    thumbnail: thumbnailUrl,
                    metadata,
                }),
            })

            const versionData = await versionResponse.json()
            if (!versionResponse.ok) throw new Error(versionData.error || "Failed to create model version")

            setMessage(`Upload successful! View model: ${modelData.id}`)
        } catch (error: any) {
            setMessage(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
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
                <CldUploadWidget
                    uploadPreset="JRGS_Tech_app"
                    onSuccess={(result) => handleUpload(result)}
                >
                    {({ open }) => (
                        <button disabled={uploading} onClick={() => open()}>
                            {uploading ? "Uploading..." : "Upload a Model"}
                        </button>
                    )}
                </CldUploadWidget>
            </section>
            {message && <p className="mt-4">{message}</p>}
        </main>
    )
}
