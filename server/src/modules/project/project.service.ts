
import { Project, IProject } from './project.model';
import { Client } from '../client/client.model';
import { Task } from '../task/task.model';
import { ApiError } from '../../utils/ApiError';
import { ProjectDetailsResult, PopulatedProject, ProjectsFilter } from '../../types/project.types';
import mongoose from 'mongoose';
import { GetProjectsQuery, UpdateProjectData } from './project.validation'


export const createProjectService = async (
  data: Partial<IProject>,
  userId: mongoose.Types.ObjectId
): Promise<IProject> => {

  const client = await Client.findOne({
    _id: data.client,
    owner: userId,
    isDeleted: false
  });

  if (!client) {
    throw new ApiError(400, "Invalid client");
  }

  const project = await Project.create({
    ...data,
    owner: userId
  });

  return project;
};


export const getProjectByIdService = async (
  id: string,
  userId: mongoose.Types.ObjectId
): Promise<ProjectDetailsResult | null> => {
  
  const project = await Project.findOne({
    _id: id,
    owner: userId,
    isDeleted: false
  })
  .populate("client", "name")
  .lean<PopulatedProject>();

  if (!project) {
    return null
  }

  const
    [ 
    tasks,
    totalTasks,
    completedTasks,
    overdueTasks,
     ] = await Promise.all([
      Task.find({
        project: id,
        owner: userId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .select("_id title status dueDate")
        .lean(),

      Task.countDocuments({
        project: id,
        owner: userId,
        isDeleted: false,
      }),

      Task.countDocuments({
        project: id,
        owner: userId,
        isDeleted: false,
        status: "done",
      }),

      Task.countDocuments({
        project: id,
        owner: userId,
        isDeleted: false,
        dueDate: { $lt: new Date() },
      }),
    ]);

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
      project,
      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate
      },
      tasks
    }
}

export const getProjectsService = async (
  userId: mongoose.Types.ObjectId,
  query: GetProjectsQuery
) => {

  const { page, limit, status, clientId, search } = query
  const skip = Math.max(0, (page - 1) * limit);

  const filter: ProjectsFilter = {
    owner: userId,
    isDeleted: false,
  };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (clientId) {
    filter.client = clientId;
  }

  const [ projects, total ] = await Promise.all([
    Project.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("client", "name")
    .lean<PopulatedProject[]>(),
    Project.countDocuments(filter)
  ])

  return {
    projects,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const updateProjectService = async (
  id: string | string[],
  userId: mongoose.Types.ObjectId,
  data: UpdateProjectData
) => {

    const updateData: Partial<UpdateProjectData> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.budget !== undefined) updateData.budget = data.budget;
    if (data.client !== undefined) updateData.client = data.client;


    if (updateData.client) {
    const client = await Client.findOne({
      _id: updateData.client,
      owner: userId,
      isDeleted: false,
    });

    if (!client) {
      throw new ApiError(400, "Invalid client");
    }
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
      isDeleted: false
    },
    updateData,
    { new: true }
  );

  if (!updatedProject) {
    throw new ApiError(404, "Project not found");
  }

  return updatedProject;
}

export const deleteProjectService = async (
  id: string,
  userId: mongoose.Types.ObjectId
) => {

  const deletedProject = Project.findOneAndUpdate(
    {
    _id: id,
      owner: userId,
      isDeleted: false
    },
    {
      isDeleted: true
    },
    {
      new: true
    }
  );

  if (!deletedProject) {
    return null
  };

  await Task.updateMany(
    {
      project: id,
      owner: userId,
      isDeleted: false
    },
    {
      isDeleted: true
    }
  );

  return deletedProject;
}

export const restoreProjectService = async (
  id: string, 
  userId: mongoose.Types.ObjectId
) => {

  const restoredProject = await Project.findOneAndUpdate(
    {
      owner: userId,
      _id: id,
      isDeleted: true
    },
    {
      isDeleted: false
    },
    { new: true }
  );

  return restoredProject;
}