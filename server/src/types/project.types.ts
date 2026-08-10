import { IProject } from "../modules/project/project.model";
import { ITask } from "../modules/task/task.model";
import { Types } from 'mongoose'

export type ProjectStatus =
  | "active"
  | "completed"
  | "paused";

export type UpdatableProjectFields =
  | "name"
  | "description"
  | "status"
  | "deadline"
  | "budget"
  | "client";

export interface ProjectDetailsResult {
  project: PopulatedProject;
  stats: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
    progressPercent: number;
    inProgressCount: number;
  };
  tasks: ITask[];
}

export type PopulatedProject = Omit<IProject, "client"> & {
  _id: Types.ObjectId;
  client: {
    _id: Types.ObjectId;
    name: string;
  };
};

export interface ProjectsFilter {
  workspace: Types.ObjectId
  page?: string | number;
  status?: "active" | "completed" | "paused";
  search?: string;
  client?: string;
  name?: {
      $regex: string;
      $options: string;
    };  
  isDeleted: boolean
}

