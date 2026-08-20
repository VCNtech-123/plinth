import { api } from "./axios";
import type { WorkspaceRole } from "../types/workspace.types";

interface UpdateWorkspaceBody {
  name: string;
}

interface InviteMemberBody {
  email: string;
  role: WorkspaceRole;
}

export const getUserWorkspaces = async () => {
  const response = await api.get("/workspaces");
  return response.data;
};

export const switchWorkspace = async (workspaceId: string) => {
  const response = await api.patch("/workspaces/me/switch", { id: workspaceId });
  return response.data;
};

export const getCurrentWorkspace = async () => {
  const response = await api.get("/workspaces/me");
  return response.data;
};

export const updateWorkspace = async (data: UpdateWorkspaceBody) => {
  const response = await api.patch("/workspaces/me", data);
  return response.data;
};

export const leaveWorkspace = async () => {
  const response = await api.post("/workspaces/me/leave");
  return response.data;
};

export const getWorkspaceMembers = async () => {
  const response = await api.get("/workspaces/me/members");
  return response.data;
};

export const inviteUser = async (data: InviteMemberBody) => {
  const response = await api.post("/workspaces/me/members", data);
  return response.data;
};

export const removeMember = async (membershipId: string) => {
  const response = await api.delete(`/workspaces/me/members/${membershipId}`);
  return response.data;
};

export const getInvites = async () => {
  const response = await api.get("/workspaces/me/invites");
  return response.data;
};

export const acceptInvite = async (membershipId: string) => {
  const response = await api.patch(`/workspaces/me/invites/${membershipId}/accept`);
  return response.data;
};

export const declineInvite = async (membershipId: string) => {
  const response = await api.patch(`/workspaces/me/invites/${membershipId}/decline`);
  return response.data;
};

export const changeMemberRole = async (
  membershipId: string,
  role: "admin" | "member" | "viewer"
) => {
  const response = await api.patch(`/workspaces/me/members/${membershipId}/role`, { role });
  return response.data;
};