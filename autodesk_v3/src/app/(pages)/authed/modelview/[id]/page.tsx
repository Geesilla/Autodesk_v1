'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ThreeModelViewer from "@/components/ui/ThreeModelViewer";
import { getModelsForUser, saveModelTags } from "@/features/files/actions"; // Import saveModelTags
import { Card } from "@/components/ui/card";

// Utility function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

type Model = {
  id: string;
  name: string;
  fileUrl: string;
  tags?: string[];
  description?: string;
  metadata?: Record<string, unknown>;
  project?: { id: string; name: string; description?: string | null; userId: string; createdAt: Date; updatedAt: Date } | null; // Update project property to reflect its structure
  versions?: string[];
};

export default function ModelViewPage() {
  const params = useParams();
  const modelId = params?.id as string;

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  // Fetch all models on mount
  useEffect(() => {
    async function fetchModels() {
      try {
        const fetchedModels = await getModelsForUser();
        console.log("Fetched models:", fetchedModels);
        setModels(
          fetchedModels.map((model) => ({
            ...model,
            metadata: typeof model.metadata === 'object' && model.metadata !== null
              ? (model.metadata as Record<string, unknown>)
              : undefined, // Ensure metadata is either a Record or undefined
            versions: model.versions?.map((version) => version.id) || [], // Extract version IDs as strings
            project: model.project || null, // Ensure project matches the updated type
          }))
        );
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    }

    fetchModels();
  }, []);

  // Once models are fetched, find the matching one by ID
  useEffect(() => {
    if (models.length && modelId) {
      const foundModel = models.find((m) => m.id === modelId);
      console.log("Found model:", foundModel);
      setSelectedModel(foundModel || null);
      setTags(foundModel?.tags || []); // Initialize tags
    }
  }, [models, modelId]);

  const handleAddTag = async () => {
    if (newTag.trim() && selectedModel) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");

      try {
        // Save the tags to the database
        await saveModelTags(selectedModel.id, updatedTags);
        console.log("Tags saved successfully!");
      } catch (error) {
        console.error("Error saving tags:", error);
      }
    }
  };

  if (!selectedModel) {
    return <div className="p-4">Model not found or still loading...</div>;
  }

  return (
    <div className="flex flex-col items-center h-screen w-full p-4 gap-4">
      {/* Canvas Section */}
      <div className="flex-grow w-full border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-100">
        <ThreeModelViewer
          fileName={selectedModel.name}
          fileUrl={selectedModel.fileUrl}
        />
      </div>

      {/* Tags and Model Details Section */}
      <div className="flex w-full gap-4">
        {/* Tags Section */}
        <Card className="w-1/2 flex-grow p-6">
          <h2 className="text-lg font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-white border border-indigo-600 bg-indigo-600 px-2 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="border border-gray-300 rounded-lg px-2 py-1 flex-grow"
            />
            <button
              onClick={handleAddTag}
              className="bg-indigo-600 text-white px-4 py-1 rounded-lg"
            >
              Add
            </button>
          </div>
        </Card>

        {/* Model Details Section */}
        <Card className="w-1/2 flex-grow p-6">
          <h2 className="text-lg font-semibold mb-4">Model Details</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {selectedModel.name}</p>
            <p><strong>Project Name:</strong> {selectedModel.project?.name || "N/A"}</p>
            <p><strong>Description:</strong> {selectedModel.description || "No description provided"}</p>
            <p>
              <strong>File URL:</strong>{" "}
              <a
                href={selectedModel.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                {selectedModel.fileUrl}
              </a>
            </p>
            <p>
              <strong>Metadata:</strong>{" "}
              {selectedModel.metadata?.size
                ? `Size: ${formatFileSize(Number(selectedModel.metadata.size))}`
                : JSON.stringify(selectedModel.metadata, null, 2)}
            </p>
            <p><strong>Number of Tags:</strong> {selectedModel.tags?.length || 0}</p>
            <p><strong>Number of Versions:</strong> {selectedModel.versions?.length || 0}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
