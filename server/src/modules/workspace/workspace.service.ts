import mongoose from "mongoose";
import { Workspace } from "./workspace.model";
import { WorkspaceMember, IWorkspaceMember, WorkspaceRole } from "./workspaceMember.model";
import { WorkspaceResponse, PopulatedWorkspace, PopulatedMember } from "../../types/workspace.types";
import { findUserByEmailService } from "../auth/auth.service";
import { ApiError } from "../../utils/ApiError";

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

  export const addWorkspaceMemberService = async (
    workspaceId: mongoose.Types.ObjectId,
    email: string,
    role: WorkspaceRole,
    requesterMembership: IWorkspaceMember
  ) => {

      if (requesterMembership.role === "admin" && (role === "admin" || role === "owner")) {
        throw new ApiError(403, "Admins can only invite members and viewers");
      }
      
      const userToAdd = await findUserByEmailService(email);

      if (role === 'admin' || role === "owner") {
        throw new ApiError(403, "Admins can only create members and viewers")
      }

      const existingMember = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userToAdd._id
      });

      if (existingMember) {
        throw new ApiError(400, "User is already a member of this workspace");
      }

      const addedUser = await WorkspaceMember.create({
        workspace: workspaceId,
        user: userToAdd._id,
        role: role
      })

      return addedUser
  }