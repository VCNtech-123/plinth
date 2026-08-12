import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { WorkspaceMember } from "../modules/workspace/workspaceMember.model";
import { ApiError } from "../utils/ApiError";
import { IWorkspace } from "../modules/workspace/workspace.model";
import { IWorkspaceMember } from "../modules/workspace/workspaceMember.model";

export const attachWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const userId = req.user!._id;
  const currentWorkspaceId = req.user.currentWorkspace;

  const attach = (membership: IWorkspaceMember | null) => {
    if (!membership || !membership.workspace) return null;

    const workspace = membership.workspace as IWorkspace;
    if (workspace.isDeleted) return null;

    req.workspace = workspace;
    req.membership = membership;
    return true;
  };

  if (currentWorkspaceId && mongoose.isValidObjectId(currentWorkspaceId)) {
    const currentMembership = await WorkspaceMember.findOne({
      user: userId,
      workspace: currentWorkspaceId,
      status: "active", 
    }).populate("workspace");

    if (attach(currentMembership)) return next();
  }

  const fallbackMembership = await WorkspaceMember.findOne({
    user: userId,
    status: "active",
  })
    .sort({ createdAt: 1 }) 
    .populate("workspace");

  if (attach(fallbackMembership)) return next();

  return next(new ApiError(403, "User is not part of any active workspace"));
};