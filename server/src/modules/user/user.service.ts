import mongoose from "mongoose";
import { User } from "./user.model";

export const setCurrentWorkspace = async (
  userId: mongoose.Types.ObjectId,
  workspaceId: string
) => {
  return await User.findByIdAndUpdate(
    userId,
    { currentWorkspace: workspaceId },
    { new: true }
  );
};

export const clearCurrentWorkspaceIfMatches = async (
  userId:  mongoose.Types.ObjectId,
  workspaceId:  mongoose.Types.ObjectId
) => User.updateOne({ _id: userId, currentWorkspace: workspaceId }, { $set: { currentWorkspace: null } });