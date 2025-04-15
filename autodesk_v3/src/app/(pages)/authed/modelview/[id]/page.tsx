'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ThreeModelViewer from "@/components/ui/ThreeModelViewer";
import { getModelsForUser, saveModelTags } from "@/features/files/actions"; // Import saveModelTags
import { Card } from "@/components/ui/card";

type Model = {
  id: string;
  name: string;
  fileUrl: string;
  tags?: string[]; // Add tags property to the model
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
        setModels(fetchedModels);
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

      {/* Tags Section */}
      <Card className="w-full flex-grow p-6">
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
    </div>
  );
}
