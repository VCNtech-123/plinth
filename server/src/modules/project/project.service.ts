
import { Project, IProject } from './project.model';
import { Client } from '../client/client.model';
import { Task } from '../task/task.model';
import { ApiError } from '../../utils/ApiError';
import { ProjectDetailsResult, PopulatedProject, ProjectsFilter } from '../../types/project.types';
import { getClientByIdService } from '../client/client.service';
import mongoose from 'mongoose';
import { GetProjectsQuery, UpdateProjectData } from './project.validation'


export const createProjectService = async (
  data: Partial<IProject>,
  workspaceId: mongoose.Types.ObjectId
): Promise<IProject | null> => {

  if (!data.client) {
    return null
  }

  const clientId = data.client.toString()
  const client = await getClientByIdService(clientId, workspaceId)

  if (!client) {
    return null
  }

  const project = await Project.create({
    ...data,
    workspace: workspaceId
  });

  return project;
};


export const getProjectByIdService = async (
  id: string,
  workspaceId: mongoose.Types.ObjectId
): Promise<ProjectDetailsResult | null> => {
  
  const project = await Project.findOne({
    _id: id,
    workspace: workspaceId,
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
        workspace: workspaceId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .select("_id title status dueDate priority")
        .lean(),

      Task.countDocuments({
        project: id,
        workspace: workspaceId,
        isDeleted: false,
      }),

      Task.countDocuments({
        project: id,
        workspace: workspaceId,
        isDeleted: false,
        status: "done",
      }),

      Task.countDocuments({
        project: id,
        workspace: workspaceId,
        isDeleted: false,
        dueDate: { $lt: new Date() },
        status: "in-progress"
      }),
    ]);

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;

    return {
      project,
      stats: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
        progressPercent,
        inProgressCount
      },
      tasks
    }
}

export const getProjectsService = async (
  workspaceId: mongoose.Types.ObjectId,
  query: GetProjectsQuery
) => {

  const { page, limit, status, clientId, search } = query
  const skip = Math.max(0, (page - 1) * limit);

  const filter: ProjectsFilter = {
    workspace: workspaceId,
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

  if (!projects) {
    return null
  }

  return {
    projects,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const updateProjectService = async (
  id: string,
  workspaceId: mongoose.Types.ObjectId,
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
    const client = await getClientByIdService(updateData.client, workspaceId)

    if (!client) {
      return null
    }
  }

  const updatedProject = await Project.findOneAndUpdate(
    {
      _id: id,
      workspace: workspaceId,
      isDeleted: false
    },
    updateData,
    { new: true }
  );

  if (!updatedProject) {
    return null
  }

  return updatedProject;
}

export const deleteProjectService = async (
  id: string,
  workspaceId: mongoose.Types.ObjectId
) => {

  const deletedProject = await Project.findOneAndUpdate(
    {
    _id: id,
      workspace: workspaceId,
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
  }

  await Task.updateMany(
    {
      project: id,
      workspace: workspaceId,
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
  workspaceId: mongoose.Types.ObjectId
) => {

  const restoredProject = await Project.findOneAndUpdate(
    {
      workspace: workspaceId,
      _id: id,
      isDeleted: true
    },
    {
      isDeleted: false
    },
    { new: true }
  );

  if (!restoredProject) {
    return null
  }

  return restoredProject;
}