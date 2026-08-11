import mongoose from "mongoose";
import { Workspace } from "./workspace.model";
import { WorkspaceMember } from "./workspaceMember.model";
import { WorkspaceResponse, PopulatedWorkspace, PopulatedMember } from "../../types/workspace.types";

export const createDefaultWorkspaceForUser = async (
  userId: mongoose.Types.ObjectId,
  userName: string
) => {
  const workspace = await Workspace.create({
    name: `${userName}'s Workspace`,
    createdBy: userId,
  });

  await WorkspaceMember.create({
    workspace: workspace._id,
    user: userId,
    role: "owner",
  });

  return workspace;
};

export const getCurrentWorkspaceService = async (
  userId: mongoose.Types.ObjectId,
  workspaceId: mongoose.Types.ObjectId
): Promise<WorkspaceResponse | null> => {

  const[membership, membersCount] = await Promise.all([
    WorkspaceMember.findOne({ 
      workspace: workspaceId,
      user: userId
    })
      .populate({
        path: "workspace",
        match: { isDeleted: false },
        select: "name createdBy"
      })
      .lean<PopulatedWorkspace>(),

    WorkspaceMember.countDocuments({
      workspace: workspaceId
    })
  ])

  if (!membership || !membership.workspace) {
    return null;
  }
  

  return {
    workspace: membership.workspace,
    role: membership.role,
    membersCount
  }
}

export const getWorkspaceMembersService = async (
  workspaceId: mongoose.Types.ObjectId
): Promise<PopulatedMember[]> => {

  const members = await WorkspaceMember.find({
    workspace: workspaceId
  }).populate("user", "_id name email")
    .select("role joinedAt user")
    .lean<PopulatedMember[]>()

  return members
}