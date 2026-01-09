export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High";

export interface AssignedUser {
  _id: string;
  email: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignedTo?: AssignedUser | null;
  createdAt: string;
}
