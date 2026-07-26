import { IProject } from "../modules/project/project.model";
import { ITask } from "../modules/task/task.model";

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
  project: IProject;
  stats: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  tasks: ITask[];
}
