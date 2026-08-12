import mongoose from "mongoose";
import { Workspace } from "./workspace.model";
import { WorkspaceMember, IWorkspaceMember, WorkspaceRole } from "./workspaceMember.model";
import { WorkspaceResponse, PopulatedWorkspace, PopulatedMember, PopulatedInvite } from "../../types/workspace.types";
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
    status: "active"
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
      user: userId,
      status: "active"
    })
      .populate({
        path: "workspace",
        match: { isDeleted: false },
        select: "name createdBy"
      })
      .lean<PopulatedWorkspace>(),

    WorkspaceMember.countDocuments({
      workspace: workspaceId,
      status: "active"
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
    workspace: workspaceId,
    status: "active"
  }).populate("user", "_id name email")
    .select("role joinedAt user")
    .lean<PopulatedMember[]>()

  return members
}

export const inviteUserService = async (
  workspaceId: mongoose.Types.ObjectId,
  email: string,
  role: WorkspaceRole,
  requesterMembership: IWorkspaceMember
): Promise<PopulatedMember> => {

  if (requesterMembership.role === "admin" && (role === "admin" || role === "owner")) {
    throw new ApiError(403, "Admins can only invite members and viewers");
  }
      
  const userToAdd = await findUserByEmailService(email);

  const existingMember = await WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userToAdd._id,
    status: "active"
  });

  if (existingMember) {
    throw new ApiError(400, "User is already a member of this workspace");
  }

  const addedUser = await WorkspaceMember.create({
    workspace: workspaceId,
    user: userToAdd._id,
    role: role,
    status: "pending"
  })  

  const fullyPopulatedMember = await addedUser.populate<PopulatedMember>("user", "_id name email");

  return fullyPopulatedMember.toObject() as PopulatedMember;
}

export const getInvitesService = async (
  userId: mongoose.Types.ObjectId
): Promise<PopulatedInvite[]> => {
    return await WorkspaceMember.find({
        user: userId,
        status: "pending"
    }).populate<PopulatedInvite>("workspace", "_id name createdBy");
};

export const acceptInviteService = async (
  workspaceId: string, 
  userId: mongoose.Types.ObjectId
): Promise<PopulatedMember> => {
  const membership = await WorkspaceMember.findOneAndUpdate(
    { 
      workspace: workspaceId, 
      user: userId, 
      status: "pending" 
    },
    { 
      status: "active", 
      joinedAt: new Date() 
    },
    { new: true }
  )
  .populate<PopulatedMember>("user", "_id name email")

  if (!membership) {
    throw new ApiError(404, "Invite not found or already accepted");
  }

  return membership;
};