
import { Client } from '../client/client.model';
import { Project } from '../project/project.model';
import { Task } from '../task/task.model';
import mongoose from 'mongoose';

const getSummaryStats = async (
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

const get7DayTrends = async ( userId: mongoose.Types.ObjectId ) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dateKeys: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        dateKeys.push(d.toISOString().split("T")[0]);
    }

    const [completedRaw, createdRaw] = await Promise.all([
        Task.aggregate([
        {
            $match: {
            owner: userId,
            isDeleted: false,
            status: "done",
            updatedAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            count: { $sum: 1 },
            },
        },
        ]),
        Task.aggregate([
        {
            $match: {
            owner: userId,
            isDeleted: false,
            createdAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
            },
        },
        ]),
    ]);

    const completedMap = new Map(completedRaw.map((r) => [r._id, r.count]));
    const createdMap = new Map(createdRaw.map((r) => [r._id, r.count]));

    return {
        tasksCompletedLast7Days: dateKeys.map((date) => completedMap.get(date) || 0),
        tasksCreatedLast7Days: dateKeys.map((date) => createdMap.get(date) || 0),
    };
}

const getAtRiskProjects = async (userId: mongoose.Types.ObjectId) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return Task.aggregate<{ id: string; name: string; overdueTasks: number }>([
    {
      $match: {
        owner: userId,
        isDeleted: false,
        status: { $ne: "done" },
        dueDate: { $lt: startOfToday },
        project: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$project",
        overdueTasks: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "projects", // Collection name in MongoDB
        localField: "_id",
        foreignField: "_id",
        as: "projectInfo",
      },
    },
    { $unwind: "$projectInfo" },
    {
      $match: {
        "projectInfo.isDeleted": false,
        "projectInfo.status": "active",
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: "$_id" },
        name: "$projectInfo.name",
        overdueTasks: 1,
      },
    },
    { $sort: { overdueTasks: -1 } },
    { $limit: 5 },
  ]);
};

const getRecentActivity = async (userId: mongoose.Types.ObjectId) => {
  interface PopulatedProject {
    _id: mongoose.Types.ObjectId;
    name: string;
  }

  const [completedTasks, createdTasks] = await Promise.all([
    Task.find({ owner: userId, isDeleted: false, status: "done" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate<{ project?: PopulatedProject }>("project", "name")
      .lean(),

    Task.find({ owner: userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate<{ project?: PopulatedProject }>("project", "name")
      .lean(),
  ]);

  return {
    completed: completedTasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      project: task.project
        ? { id: task.project._id.toString(), name: task.project.name }
        : { id: "", name: "No Project" },
      completedAt: task.updatedAt.toISOString(),
    })),
    created: createdTasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      project: task.project
        ? { id: task.project._id.toString(), name: task.project.name }
        : { id: "", name: "No Project" },
      createdAt: task.createdAt.toISOString(),
    })),
  };
};

export const getDashboardService = async (userId: mongoose.Types.ObjectId) => {
  const [summary, trends, atRiskProjects, recentActivity] = await Promise.all([
    getSummaryStats(userId),
    get7DayTrends(userId),
    getAtRiskProjects(userId),
    getRecentActivity(userId),
  ]);

  return {
    summary,
    trends,
    atRiskProjects,
    recentActivity,
  };
};


