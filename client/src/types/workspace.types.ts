

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";
export type WorkspaceMemberStatus = "pending" | "active" | "declined" | "removed";

export interface WorkspaceSummary {
  id: string;
  name: string;
  createdBy: string;
}

export interface WorkspaceMembershipSummary {
  workspace: WorkspaceSummary;
  role: WorkspaceRole;
  joinedAt?: string;
}

export interface WorkspaceMemberRow {
  id: string; 
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: WorkspaceRole;
  status: WorkspaceMemberStatus;
  joinedAt?: string;
}