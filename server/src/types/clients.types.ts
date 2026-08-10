
import mongoose from 'mongoose';

export interface GetClientsQuery {
    page: number;
    limit: number;
    search?: string;
    status?: "active" | "inactive";
}

export interface GetClientsFilter {
  workspace: mongoose.Types.ObjectId;
  isDeleted: boolean;
  name?: {
    $regex: string;
    $options: string;
  };
  status?: "active" | "inactive";
}

export interface LeanClient {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  workspace: mongoose.Types.ObjectId | string;
  isDeleted: boolean;
  status: "active" | "inactive";
  email?: string;
  phone?: string;
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface LeanRecentProject {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  overdueTasks: number;
}

export interface GetClientByIdResponse {
  client: LeanClient;
  projects: LeanRecentProject[];
  stats: ClientStats;
}
