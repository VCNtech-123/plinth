import mongoose from "mongoose";
import { Workspace } from "./workspace.model";
import { WorkspaceMember } from "./workspaceMember.model";

export const createDefaultWorkspaceForUser = async (
  userId: mongoose.Types.ObjectId,
  userName: string,
  session?: mongoose.ClientSession
) => {
  const workspace = await Workspace.create(
    [{
      name: `${userName}'s Workspace`,
      createdBy: userId,
    }],
    { session }
  );

  await WorkspaceMember.create(
    [{
      workspace: workspace[0]._id,
      user: userId,
      role: "owner",
    }],
    { session }
  );

  return workspace[0];
};