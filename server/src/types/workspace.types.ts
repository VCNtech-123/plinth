
import { IWorkspaceMember, WorkspaceRole } from "../modules/workspace/workspaceMember.model";
import { Types } from "mongoose";

export type PopulatedWorkspace = Omit<IWorkspaceMember, "workspace"> & {
  workspace: LeanWorkspace
};

export interface LeanWorkspace {
  _id: Types.ObjectId;
  name: string;
  createdBy: string;
}

export interface WorkspaceResponse { 
    workspace: LeanWorkspace;
    role: WorkspaceRole;
    membersCount: number;
}