
import { Request, Response } from 'express';
import { createProjectService, getProjectByIdService, getProjectsService, updateProjectService, deleteProjectService, restoreProjectService } from './project.service';
import { ApiError } from '../../utils/ApiError';
import mongoose from 'mongoose'
import { GetProjectsQuery } from './project.validation';

export const createProject = async (req: Request, res: Response) => {
    const project = await createProjectService(
        req.body,
        req.user!._id
    );

    res.status(201).json({
        status: "success",
        data: {
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        deadline: project.deadline,
        budget: project.budget,
        client: project.client,
        createdAt: project.createdAt,
        },
     });
}

export const getProjectById = async (
    req: Request, 
    res: Response,
) => {
    const id = req.params.id as string;

    const result = await getProjectByIdService(
        id,
        req.user!._id
    );

    if (!result) {
        throw new ApiError(400, 'Project not found')
    }

    const { project, tasks, stats } = result

    res.status(200).json({
    status: "success",
    data: {
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        deadline: project.deadline,
        budget: project.budget,
        client: {
          name: project.client.name,
          id: project.client._id
        },
        createdAt: project.createdAt
      },
      stats: {
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        overdueTasks: stats.overdueTasks,
        completionRate: stats.completionRate
      },
      tasks: tasks.map((task) => ({
        id: task._id,
        title: task.title,
        status: task.status,
        dueDate: task.createdAt,
      }))  
    }
  });
}

export const getProjects = async (
  req: Request,
  res: Response
) => {

  const { query } = res.locals.validated as {
      query: GetProjectsQuery;
  };

  const result = await getProjectsService(
    req.user!._id,
    query
  );

  res.status(200).json({
    status: "success",
    results: result.projects.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.projects.map(project => ({
      id: project._id,
      name: project.name,
      status: project.status,
      client: {
        name: project.client.name,
        id: project.client._id
      },
      deadline: project.deadline,
      budget: project.budget,
      createdAt: project.createdAt,
    })),
  });
};

export const updateProject = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;

  const updatedProject = await updateProjectService(
    id,
    req.user!._id,
    req.body
  );

   if (!updatedProject) {
    throw new ApiError(404, "Project not found");
  }

  res.status(200).json({
    status: "success",
    data: {
      id: updatedProject._id,
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      deadline: updatedProject.deadline,
      budget: updatedProject.budget,
      client: updatedProject.client,
      updatedAt: updatedProject.updatedAt
    }
  });
}

export const deleteProject = async (
  req: Request,
  res: Response
) => 
{
  const id = req.params.id as string;

  const deletedProject = await deleteProjectService(
    id,
    req.user!._id
  );

  if (!deletedProject) {
    throw new ApiError(400, 'Project not found');
  }

  res.status(201).json({
    status: "successful",
    message: "Project deleted succesfully"
  });
}

export const restoreProject = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    const restoredProject = await restoreProjectService(
      id,
      req.user!._id
    )

    if (!restoredProject) {
      throw new ApiError(404, "Project not found")
    }

    res.status(200).json({
      status: "succes",
      message: "Project restored succesfully"
    });
}