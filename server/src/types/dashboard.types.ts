import { Types } from 'mongoose'
import { ITask } from '../modules/task/task.model';

export interface DashboardResponse {
  summary: {
    activeProjects: number;
    totalProjects: number;
    totalTasks: number;
    overdueTasks: number;
    tasksDueToday: number;
    weeklyCompletionRate: number; // %
  },

  trends: {
    tasksCompletedLast7Days: number[];
    tasksCreatedLast7Days: number[];
  },

  atRiskProjects: [
    {
      id: string;
      name: string;
      overdueTasks: number;
    }
  ],

  recentActivity: {
    completed: [
      {
        id: string;
        title: string;
        project: { id: string; name: string };
        completedAt: string;
      }
    ],
    created: [
      {
        id: string;
        title: string;
        project: { id: string; name: string };
        createdAt: string;
      }
    ]
  }
}
