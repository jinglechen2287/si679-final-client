export const STORAGE_KEY = "hybrid_authoring_jwt";
export const USER_ID_KEY = "hybrid_authoring_user_id";

let JWT: string | null = localStorage.getItem(STORAGE_KEY);
let USER_ID: string | null = localStorage.getItem(USER_ID_KEY);

export const getJWT = () => {
  return JWT;
};

export const setJWT = (jwt: string) => {
  JWT = jwt;
  localStorage.setItem(STORAGE_KEY, jwt);
};

export const getUserID = () => {
  return USER_ID;
};

export const setUserID = (userId: string) => {
  USER_ID = userId;
  localStorage.setItem(USER_ID_KEY, userId);
};

export const logOut = () => {
  JWT = null;
  USER_ID = null;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_ID_KEY);
};
