import { Types } from 'mongoose'
import { ITask } from '../modules/task/task.model';

export interface DashboardResponse {
  summary: {
    activeProjects: number;
    overdueTasks: number;
    tasksDueToday: number;
    weeklyCompletionRate: number;
  },
  atRiskProjects: [
    {
      id: Types.ObjectId,
      name: string,
      overdueTasks: ITask[]
    }
  ],
  recentActivity: {
    completedTasks: ITask[],
    createdTasks: ITask[]
  }
}
