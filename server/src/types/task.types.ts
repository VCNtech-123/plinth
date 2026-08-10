import { ITask } from "../modules/task/task.model";
import { Types } from 'mongoose'

export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface GetTaskResponse {
  tasks: PopulatedTask[],
  total: number,
  page: number,
  pages: number
}

export type PopulatedTask = Omit<ITask, "project"> & {
  project: {
    _id: Types.ObjectId;
    name: string;
  }
  assignee?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  }

}

export interface TaskFilter {
  workspace: Types.ObjectId
  priority?: "low" | "medium" | "high"
  status?: "todo" | "in-progress" | "done";
  project?: string;
  isDeleted: boolean;
  title?: {
      $regex: string;
      $options: string;
    };  
}
