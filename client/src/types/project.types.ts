export type ProjectStatus = "active" | "paused" | "completed";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  client: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface IProjectDetails {
  project: Project;
  stats: ProjectStats;
  tasks: ProjectTaskPreview[];
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface ProjectTaskPreview {
  id: string;
  title: string;
  status: string;
  dueDate?: string;
}