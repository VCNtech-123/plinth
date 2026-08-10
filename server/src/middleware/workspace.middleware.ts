import { Request, Response, NextFunction } from "express";
import { WorkspaceMember } from "../modules/workspace/workspaceMember.model";
import { ApiError } from "../utils/ApiError";
import { IWorkspace } from "../modules/workspace/workspace.model";

export const attachWorkspace = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const membership = await WorkspaceMember.findOne({
    user: req.user._id,
  }).populate("workspace");

  if (!membership || !membership.workspace) {
    return next(
      new ApiError(403, "User is not part of any workspace")
    );
  }

  const workspace = membership.workspace as IWorkspace;

  if (workspace.isDeleted) {
    return next(
      new ApiError(403, "Workspace not found or deleted")
    );
  }

  req.workspace = workspace;
  req.membership = membership;

  next();
};