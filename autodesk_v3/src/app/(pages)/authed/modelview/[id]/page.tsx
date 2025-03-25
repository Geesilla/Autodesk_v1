'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ThreeModelViewer from "@/components/ui/ThreeModelViewer";
import { getModelsForUser } from "@/features/files/actions";

type Model = {
  id: string;
  name: string;
  fileUrl: string;
};

export default function ModelViewPage() {
  const params = useParams();
  const modelId = params?.id as string;

  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

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
    }
  }, [models, modelId]);

  if (!selectedModel) {
    return <div className="p-4">Model not found or still loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen w-full absolute">
      <ThreeModelViewer
        fileName={selectedModel.name}
        fileUrl={selectedModel.fileUrl}
      />
    </div>
  );
}
