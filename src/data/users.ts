import type { User } from "~/types/Users";
import {
  handleDelete,
  handleGet,
  handlePatch,
  handlePost,
  USERS_ENDPOINT,
} from "./api.js";
import { setJWT, setUserID } from "./auth";

export const getUserById = async (id: string) => {
  return await handleGet(USERS_ENDPOINT + `/${id}`);
};

export const getUsers = async () => {
  return await handleGet(USERS_ENDPOINT);
};

export const createUser = async (
  username: string,
  password: string,
  displayName: string,
) => {
  const newUser = {
    username,
    password,
    displayName,
  };
  await handlePost(USERS_ENDPOINT + "/register", newUser);
  return newUser;
};

export const updateUser = async (
  id: string,
  updatedFields: Record<string, unknown>,
) => {
  const theUser = await handleGet(USERS_ENDPOINT + `/${id}`);
  if (!theUser) {
    throw new Error(`Can't update user. User with id ${id}not found`);
  }
  const updatedUser = {
    ...theUser,
    ...updatedFields,
  };
  await handlePatch(USERS_ENDPOINT + `/${id}`, updatedUser);
  return updatedUser;
};

export const deleteUser = async (id: string) => {
  await handleDelete(USERS_ENDPOINT + `/${id}`);
};

export const validateLogin = async (username: string, password: string) => {
  const { user, jwt } = await handlePost(USERS_ENDPOINT + `/login`, {
    username,
    password,
  });
  if (!jwt) {
    throw new Error("Invalid username or password");
  }
  setJWT(jwt);
  setUserID(user.id);
  return user as Omit<User, "password">;
};
