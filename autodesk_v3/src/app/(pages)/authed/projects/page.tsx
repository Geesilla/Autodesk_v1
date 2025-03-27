// app/projects/page.tsx
'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("All"); // Filtering dropdown state

  useEffect(() => {
    // TODO: Fetch projects for the logged-in user from your API
    setProjects([]); // Replace with fetched projects
  }, []);

  const handleCreateProject = async () => {
    // TODO: Call your backend API to create a new project,
    // then update the projects state with the newly created project.
    console.log("Creating project:", newProjectName, newProjectDescription);
    // After creating the project, close the modal and reset the form
    setIsModalOpen(false);
    setNewProjectName("");
    setNewProjectDescription("");
  };

  return (
    <main className="p-5">
      {/* Header with filtering dropdown and Add New Project button */}
      <header className="w-full h-16 bg-gray-100 flex items-center px-6 gap-5 shadow-md mb-8">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="All">All Projects</option>
          <option value="Recent">Recently Created</option>
          <option value="Alphabetical">Alphabetical</option>
        </select>
        <Button onClick={() => setIsModalOpen(true)}>Add New Project</Button>
      </header>

      {/* Modal popout for project creation */}
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

      <section>
        <h2 className="text-2xl mb-4">My Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="border p-4 rounded">
                <h3 className="text-xl">{project.name}</h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
