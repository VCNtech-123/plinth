

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer";

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