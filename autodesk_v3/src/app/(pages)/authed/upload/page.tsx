// app/upload/page.tsx
'use client'

import { CldUploadButton } from "next-cloudinary"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveUploadedModel } from "@/features/files/actions"

// Dummy projects list; later fetch this from your API.
const dummyProjects = [
  { id: "proj1", name: "Project One" },
  { id: "proj2", name: "Project Two" },
];

export default function Upload() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [tags, setTags] = useState("") // Comma-separated tags
  const [selectedProject, setSelectedProject] = useState("")

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
      // Add any additional metadata fields here.
    }

    // Process tags: split by commas and remove empty strings.
    const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

    await saveUploadedModel({
      fileName,
      fileUrl,
      thumbnailUrl,
      metadata,
      thumbnail: thumbnailUrl,
      name: fileName,
      description: "Uploaded 3D model",
      tags: tagArray,
      projectId: selectedProject || undefined,
    });
    setMessage("Uploaded")
    setUploading(false)
  }

  if (!isLoaded) return <p>Loading...</p>
  if (!user) {
    router.push("/sign-in") // Redirect to sign-in page
    return null
  }

  return (
    <main className="p-16 text-center">
      <h1 className="text-5xl font-medium py-8">Upload 3D Model</h1>
      <section className="flex flex-col items-center space-y-4">
        {/* Input for tags */}
        <div>
          <label className="block mb-1">Tags (comma separated):</label>
          <input
            type="text"
            className="border rounded p-2"
            placeholder="e.g., vehicle, architecture"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        {/* Project selection */}
        <div>
          <label className="block mb-1">Select Project (optional):</label>
          <select
            className="border rounded p-2"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">None</option>
            {dummyProjects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>
        <CldUploadButton
          className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg"
          uploadPreset="JRGS_Tech_app"
          onSuccess={(result) => handleUpload(result)}
        >
          Upload a Model
        </CldUploadButton>
      </section>
      {message && <p className="mt-4">{message}</p>}
    </main>
  )
}
