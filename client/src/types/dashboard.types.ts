
export interface AtRiskProject {
  id: string;
  name: string;
  overdueTasks: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  project: {
    id: string;
    name: string;
  };
}

export interface CompletedActivityItem extends ActivityItem {
  completedAt: string;
}

export interface CreatedActivityItem extends ActivityItem {
  createdAt: string;
}

export interface DashboardResponse {
  summary: {
    activeProjects: number;
    totalProjects: number;
    totalTasks: number;
    overdueTasks: number;
    tasksDueToday: number;
    weeklyCompletionRate: number; // %
  };

  trends: {
    tasksCompletedLast7Days: number[];
    tasksCreatedLast7Days: number[];
  };

  atRiskProjects: AtRiskProject[];

  recentActivity: {
    completed: CompletedActivityItem[];
    created: CreatedActivityItem[];
  };
}