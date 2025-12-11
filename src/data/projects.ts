import {
  handleDelete,
  handleGet,
  handlePatch,
  handlePost,
  PROJECTS_ENDPOINT,
} from "./api";
import type { Project } from "~/types/Projects";

export const getProjects = async () => {
  return await handleGet(PROJECTS_ENDPOINT);
};

export const getProject = async (id: string) => {
    return await handleGet(PROJECTS_ENDPOINT + `/${id}`) as Project;
};

export const createProject = async (projectName: string | undefined = undefined) => {
  const newProject = await handlePost(PROJECTS_ENDPOINT, { name: projectName });
  return newProject as Project;
};

export const updateProject = async (id: string, updatedFields: Partial<Project>) => {
  const theProject = await handleGet(PROJECTS_ENDPOINT + `/${id}`);

  if (!theProject) {
    throw new Error(`Can't update project. Project with id ${id} not found.`);
  }

  const updatedProject = {
    ...theProject,
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };
  await handlePatch(PROJECTS_ENDPOINT + `/${id}`, updatedProject);
  return updatedProject;
};

export const deleteProject = async (id: string) => {
  await handleDelete(PROJECTS_ENDPOINT + `/${id}`);
};