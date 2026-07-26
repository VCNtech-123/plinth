export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  createdAt: string;
}

export interface ClientStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  overdueTasks: number;
}

export interface ClientDetailsData {
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status: string;
    createdAt: string;
  };
  projects: {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
  stats: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    overdueTasks: number;
  };
}
