import api from "./axios";
import type { Issue } from "../types/issue";

export interface CreateIssuePayload {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed"; // ✅ ADD
  assignedTo?: string;
}

export const fetchIssues = () => api.get<Issue[]>("/api/issues");

export const createIssue = (data: CreateIssuePayload) =>
  api.post<Issue>("/api/issues", data);

export const updateIssue = (id: string, data: Partial<Issue>) =>
  api.put<Issue>(`/api/issues/${id}`, data);

export const deleteIssue = (id: string) =>
  api.delete(`/api/issues/${id}`);
