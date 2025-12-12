import type { Project } from "~/types/Projects";
import type { User } from "~/types/Users";
import { getJWT } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL;
export const PROJECTS_ENDPOINT = `${API_URL}/api/projects`;
export const USERS_ENDPOINT = `${API_URL}/api/users`;

const buildUrlWithQuery = (
  url: string,
  queryParams: Record<string, string>,
) => {
  const params = new URLSearchParams(queryParams);
  return `${url}${params.toString()}`;
};

export const handleGet = async (
  url: string,
  queryParams: Record<string, string> | null = null,
) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const headers: Record<string, string> = {};
  const jwt = getJWT();
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  const response = await fetch(url, {
    headers,
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`GET request to ${url} failed: ${response.statusText}`);
  }
};

export const handlePost = async (
  url: string,
  body: Partial<User> | { name: string | undefined } | undefined = undefined,
  queryParams: Record<string, string> | null = null,
) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const jwt = getJWT();
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`POST request to ${url} failed: ${response.statusText}`);
  }
};

export const handleDelete = async (
  url: string,
  queryParams: Record<string, string> | null = null,
) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const headersDel: Record<string, string> = {};
  const jwtDel = getJWT();
  if (jwtDel) {
    headersDel["Authorization"] = `Bearer ${jwtDel}`;
  }
  const response = await fetch(url, {
    method: "DELETE",
    headers: headersDel,
  });
  if (response.ok) {
    return response.statusText;
  } else {
    throw new Error(`DELETE request to ${url} failed: ${response.statusText}`);
  }
};

export const handlePatch = async (
  url: string,
  body: Partial<User> | Partial<Project>,
  queryParams: Record<string, string> | null = null,
) => {
  if (queryParams) {
    url = buildUrlWithQuery(url, queryParams);
  }
  const headersPatch: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const jwtPatch = getJWT();
  if (jwtPatch) {
    headersPatch["Authorization"] = `Bearer ${jwtPatch}`;
  }
  const response = await fetch(url, {
    method: "PATCH",
    headers: headersPatch,
    body: JSON.stringify(body),
  });
  if (response.ok) {
    return response.statusText;
  } else {
    throw new Error(`Patch request to ${url} failed: ${response.statusText}`);
  }
};
