'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThreeThumbnailViewer from "@/components/ui/ThreeThumbnailViewer"; // Import the thumbnail viewer
import { createProjectAction, getProjectsForUserAction, deleteProjectAction } from "@/features/files/projects.server";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedProject, setSelectedProject] = useState<any | null>(null); // State for selected project
  const [isAddModelModalOpen, setIsAddModelModalOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const router = useRouter(); // For navigation

  // Function to fetch projects via the server action
  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjectsForUserAction();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setMessage("Error fetching projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      if (!newProjectName || !newProjectDescription) {
        setMessage("Project name and description are required.");
        return;
      }
      console.log("Creating project:", newProjectName, newProjectDescription);
      await createProjectAction(newProjectName, newProjectDescription);
      setMessage("Project created successfully!");
      // Refresh projects list
      await fetchProjects();
      // Close modal and reset form
      setIsModalOpen(false);
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage("Error creating project.");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      await deleteProjectAction(projectId); // Call the server action
      setProjects((prev) => prev.filter((project) => project.id !== projectId)); // Update UI
      alert("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project); // Set the selected project to display its models
  };

  const handleModelClick = (modelId: string) => {
    router.push(`/authed/modelview/${modelId}`); // Navigate to the Model View Page
  };

  return (
    <main className="p-5">
      {/* Header with Add New Project button */}
      <header className="w-full h-16 bg-gray-100 flex items-center px-6 gap-5 shadow-md mb-8">
        <Button onClick={() => setIsModalOpen(true)}>Create New Project</Button>
      </header>

      {/* Modal for project creation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300/45 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl mb-4">Create New Project</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Project Name"
                className="border rounded p-2"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <textarea
                placeholder="Project Description"
                className="border rounded p-2"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <Button onClick={handleCreateProject}>Create Project</Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-4">{message}</p>}

      {/* Display the list of projects */}
      <section>
        <h2 className="text-2xl mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border p-4 rounded flex justify-between items-center hover:bg-gray-100"
              >
                <div onClick={() => handleProjectClick(project)} className="cursor-pointer">
                  <h3 className="text-xl">{project.name}</h3>
                  <p>{project.description}</p>
                </div>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal to display selected project details */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-300/45 z-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-4xl w-full">
            <h2 className="text-2xl mb-4">{selectedProject.name}</h2>
            <p>{selectedProject.description}</p>
            <h3 className="text-xl mt-4">Models in this Project:</h3>
            {selectedProject.models && selectedProject.models.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {selectedProject.models.map((model: any) => (
                  <div
                    key={model.id}
                    className="border p-4 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleModelClick(model.id)}
                  >
                    <h4 className="text-lg">{model.name}</h4>
                    <div className="w-full h-32">
                      <ThreeThumbnailViewer fileUrl={model.fileUrl} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-gray-500">No models added to this project yet.</p>
            )}
            <div className="flex gap-4 mt-4">
              <Button className="bg-indigo-600" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
