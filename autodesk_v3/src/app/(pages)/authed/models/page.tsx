// app/models/page.tsx
'use client';

import ModelCard from "@/components/ui/modelcard";
import { fetchFileFromCDN, getModelsForUser } from "@/features/files/actions";
import { getProjectsForUserAction, addAssetToProjectAction } from "@/features/files/projects.server";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [fileData, setFileData] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch models on component mount
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

  // Fetch projects when the modal is opened
  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjectsForUserAction();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSelectModel = (modelId: string, checked: boolean) => {
    setSelectedModels((prev) =>
      checked ? [...prev, modelId] : prev.filter((id) => id !== modelId)
    );
  };

  const openProjectModal = () => {
    fetchProjects();
    setIsProjectModalOpen(true);
  };

  const handleAddToProject = async () => {
    if (!selectedProjectId) {
      alert("Please select a project.");
      return;
    }

    try {
      for (const modelId of selectedModels) {
        await addAssetToProjectAction(selectedProjectId, modelId);
      }
      setIsProjectModalOpen(false);
      setSelectedModels([]);
      setSelectedProjectId(null);
      alert("Models successfully added to the project!");
    } catch (error) {
      console.error("Error adding models to project:", error);
      alert("Failed to add models to the project.");
    }
  };

  const handleDeleteAssets = () => {
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

  // Filter models based on filterText
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
            <Button onClick={openProjectModal}>Add to Project</Button>
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

      {/* Project selection modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300/45 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl mb-4">Select a Project</h2>
            <select
              className="border rounded p-2 w-full"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleAddToProject}>Add to Project</Button>
              <Button variant="secondary" onClick={() => setIsProjectModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
