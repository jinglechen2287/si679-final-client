import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { logOut } from "~/data/auth";
import { createProject, deleteProject, getProjects, updateProject } from "~/data/projects";
import type { Project } from "~/types/Projects";
import { Dialog, DialogContent } from "~/routes/Dashboard/Dialog";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data as Project[]);
    } catch (error) {
      console.error("Failed to load projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logOut();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleCreate = async () => {
    try {
      const newProject = await createProject();
      navigate(`/${newProject._id}`);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const startEditing = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setEditingProject(project);
    setEditName(project.name || "Untitled");
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await updateProject(editingProject._id, { name: editName });
      setProjects(
        projects.map((p) =>
          p._id === editingProject._id ? { ...p, name: editName } : p
        )
      );
      setEditingProject(null);
    } catch (error) {
      console.error("Failed to update project name", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-neutral-950 p-8 text-neutral-400">
        Loading projects...
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-neutral-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <div className="flex gap-4">
            <button
              onClick={handleSignOut}
              className="inline-flex cursor-pointer items-center rounded bg-transparent p-0 text-lg font-medium text-blue-400 underline underline-offset-2 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              type="button"
            >
              Sign Out
            </button>
            <button
              onClick={handleEditProfile}
              className="inline-flex cursor-pointer items-center rounded bg-transparent p-0 text-lg font-medium text-blue-400 underline underline-offset-2 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              type="button"
            >
              Edit Profile
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex cursor-pointer items-center rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-lg font-medium text-neutral-100 transition-colors hover:bg-neutral-700 focus:ring-2 focus:ring-blue-400/50 focus:outline-none"
            >
              New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/${project._id}`}
              className="group relative block rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-lg transition-all hover:border-neutral-600 hover:bg-neutral-800"
            >
              <div className="flex items-center justify-between">
                <h2
                  className="mb-2 pr-15 text-xl font-semibold text-neutral-100 truncate"
                  title={project.name}
                >
                  {project.name || "Untitled"}
                </h2>
                <button
                  onClick={(e) => startEditing(e, project)}
                  className="absolute top-4 right-12 cursor-pointer p-2 text-neutral-500 opacity-0 transition-all group-hover:opacity-100 hover:text-blue-500"
                  title="Edit name"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={(e) => handleDelete(e, project._id)}
                className="absolute top-4 right-4 cursor-pointer p-2 text-neutral-500 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
                title="Delete project"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Link>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500">
              No projects found. Create one to get started!
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={!!editingProject}
        onOpenChange={(e) => !e.open && setEditingProject(null)}
      >
        <DialogContent
          title="Edit Project Name"
          description="Enter a new name for your project."
        >
          <form onSubmit={saveEdit} className="flex flex-col gap-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="cursor-pointer px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 rounded-lg bg-neutral-600 hover:bg-neutral-500 text-white transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
