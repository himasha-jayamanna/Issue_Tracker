import api from "./axios";

export interface User {
  _id: string;
  email: string;
}

export const fetchUsers = () => api.get<User[]>("/api/users");
