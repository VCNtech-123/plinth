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