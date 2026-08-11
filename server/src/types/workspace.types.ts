
import { IWorkspaceMember, WorkspaceRole } from "../modules/workspace/workspaceMember.model";
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
    workspace: {
        _id: Types.ObjectId,
        name: string,
        createdBy: Types.ObjectId
    },
    role: WorkspaceRole,
    status: string
}
