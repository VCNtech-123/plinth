
import { Client } from '../client/client.model';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';
import mongoose from 'mongoose';

export const getDashboardService = async (
    userId: mongoose.Types.ObjectId
) => {

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [ 
        totalProjects, 
        activeProjects, 
        overdueTasks,
        totalTasks,
        tasksDueToday,
        completedThisWeek,
        createdThisWeek 
     ] = await Promise.all([
        Project.countDocuments({ owner: userId, isDeleted: false }),
        Project.countDocuments(
            {
                owner: userId,
                status: 'active',
                isDeleted: false
            }),
        Task.countDocuments(
            {
                owner: userId,
                isDeleted: false,
                dueDate: { $lt: startOfToday },
                status: { $ne: "done" } 
            }),
        Task.countDocuments({ owner: userId, isDeleted: false }),
        Task.countDocuments({
            owner: userId,
            status: { $ne: "done" }, 
            dueDate: {
            $gte: startOfToday,
            $lte: endOfToday,
            },
            isDeleted: false
        }),
        Task.countDocuments({
            owner: userId,
            status: "done",
            updatedAt: { $gte: sevenDaysAgo },
            isDeleted: false
        }),
        Task.countDocuments({
            owner: userId,
            createdAt: { $gte: sevenDaysAgo },
            isDeleted: false
        })
    ]);
    const weeklyCompletionRate =
        createdThisWeek > 0
        ? Math.min(Math.round((completedThisWeek / createdThisWeek) * 100), 100)
        : 0;

    return {
        summary: {
            totalProjects,
            activeProjects,
            overdueTasks,
            totalTasks,
            tasksDueToday,
            weeklyCompletionRate
        }  
    };
}
