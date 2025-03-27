// app/models/page.tsx
'use client'

import ModelCard from "@/components/ui/modelcard";
import { fetchFileFromCDN, getModelsForUser } from "@/features/files/actions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [fileData, setFileData] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const userModels = await getModelsForUser();
        setModels(userModels);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleSelectModel = (modelId: string, checked: boolean) => {
    setSelectedModels(prev =>
      checked ? [...prev, modelId] : prev.filter((id) => id !== modelId)
    );
  };

  const handleAddToProject = () => {
    // Placeholder implementation; replace with actual API or modal navigation
    alert("Add to Project functionality coming soon.\nSelected Models: " + selectedModels.join(", "));
  };

  const handleDeleteAssets = () => {
    // Placeholder implementation; replace with actual API call and confirmation
    alert("Delete Asset functionality coming soon.\nSelected Models: " + selectedModels.join(", "));
  };

  const handleFetchFile = async (fileUrl: string) => {
    try {
      const result = await fetchFileFromCDN(fileUrl);
      if (result?.content) {
        setFileData(result.content);
      }
    } catch (error) {
      console.error("Failed to fetch file:", error);
    }
  };

  // Filter models based on filterText (searching in fileName, metadata.title, or metadata.description)
  const filteredModels = models.filter((model) => {
    const lowerFilter = filterText.toLowerCase();
    const nameMatch = model.name?.toLowerCase().includes(lowerFilter);
    const titleMatch = model.metadata?.title?.toLowerCase().includes(lowerFilter);
    const descriptionMatch = model.metadata?.description?.toLowerCase().includes(lowerFilter);
    return nameMatch || titleMatch || descriptionMatch;
  });

  return (
    <div>
      {/* Header with filtering input and selection toggle */}
      <header className="w-full h-16 bg-gray-100 flex items-center px-6 gap-5 shadow-md">
        <Button onClick={() => setSelectionMode(!selectionMode)}>
          {selectionMode ? "Cancel Selection" : "Select Assets"}
        </Button>
        {selectionMode && selectedModels.length > 0 && (
          <>
            <Button onClick={handleAddToProject}>Add to Project</Button>
            <Button onClick={handleDeleteAssets}>Delete Asset</Button>
          </>
        )}
        <input
          type="text"
          placeholder="Filter models..."
          className="ml-auto border rounded p-2"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </header>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-wrap gap-6 justify-center p-6">
          {filteredModels.length === 0 ? (
            <p>No models match the filter criteria.</p>
          ) : (
            filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                fileName={model.name}
                fileUrl={model.fileUrl}
                title={model.metadata.title}
                description={model.metadata.description}
                modelId={model.id}
                onFetchFile={() => handleFetchFile(model.fileUrl)}
                // Pass selection props to ModelCard:
                selectionMode={selectionMode}
                isSelected={selectedModels.includes(model.id)}
                onSelectChange={(checked: boolean) =>
                  handleSelectModel(model.id, checked)
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
