
import { IWorkspaceMember, WorkspaceRole } from "../modules/workspace/workspaceMember.model";
import { IWorkspace } from "../modules/workspace/workspace.model";
import { Types, Document } from "mongoose";

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

export interface PopulatedMember extends Omit<IWorkspaceMember, 'user'>, Document {
  user: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
}

export interface PopulatedInvite {
    _id: Types.ObjectId;
    workspace: {
        _id: Types.ObjectId,
        name: string,
        createdBy: Types.ObjectId
    },
    role: WorkspaceRole,
    status: string
}

export type WorkspaceMemberWithWorkspace = Omit<IWorkspaceMember, "workspace"> & {
  workspace: Pick<IWorkspace, "_id" | "name" | "createdBy">;
};
