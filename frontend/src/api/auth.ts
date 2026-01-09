import api from "./axios";

export const registerUser = (email: string, password: string) => {
  return api.post("/api/auth/register", { email, password });
};

export const loginUser = (email: string, password: string) => {
  return api.post("/api/auth/login", { email, password });
};
