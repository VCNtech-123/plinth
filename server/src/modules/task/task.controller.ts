
import { Request, Response } from "express";
import { createTaskService, getTaskService, getTaskByIdService, updateTaskByIdService, deleteTaskService, restoreTaskService } from "./task.service";
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError";
import { GetTasksQuery } from "./task.validation";

export const createTask = async (
    req: Request,
    res: Response
) => {

    const task = await createTaskService(
        req.body, 
        req.user!._id
    );

    if (!task) {
        throw new ApiError(400, "No task found")
    }

    res.status(201).json({
    status: "success",
    data: {
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      project: task.project,
      createdAt: task.createdAt
    }
  });
}

export const getTasks = async (
    req: Request,
    res: Response
) => {

    const { query } = res.locals.validated as {
        query: GetTasksQuery
    }

    const { tasks, page, pages, total } =  await getTaskService(
        req.user!._id,
        query
    )

    res.status(200).json({
    status: "success",
    results: tasks.length,
    total: total,
    page: page,
    pages: pages,
    data: tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      project: {
        id: task.project._id,
        name: task.project.name
      },
      createdAt: task.createdAt
    }))
  });
}

export const getTaskById = async (
    req: Request,
    res: Response
) => {

    const task = await getTaskByIdService(
        req.params.id,
        req.user!._id
    );

    if (!task) {
        throw new ApiError(400, "Task not found");
    }

    res.status(200).json({
        status: "success",
        data: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        project: {
            id: task.project._id,
            name: task.project.name,
        },
        createdAt: task.createdAt
        }
    })
}

export const updateTaskById = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const updatedTask = await updateTaskByIdService(
        id,
        req.user!._id,
        req.body
    )

    if (!updatedTask) {
        throw new ApiError(404, "Task not found");
    }

    res.status(200).json({
        status: "success",
        data: {
        id: updatedTask._id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
         project: {
            id: updatedTask.project._id,
            name: updatedTask.project.name,
        },
        dueDate: updatedTask.dueDate,
        updatedAt: updatedTask.updatedAt
        }
    });
}

export const deleteTask = async (       
    req: Request,
    res: Response
) => {

    const id = req.params.id as string

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid task ID");
    }

    const deletedTask = await deleteTaskService(
        id, 
        req.user!._id
    );

    if (!deletedTask) {
        throw new ApiError(400, "Task not found");
    }

     res.status(200).json({
        status: "success",
        message: "Task deleted successfully"
    });
}

export const restoreTask = async (
    req: Request,
    res: Response
) => {

    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError (400, "Invalid Task ID");
    }

    const restoredTask = await restoreTaskService(
        id,
        req.user!._id
    );

    if (!restoredTask) {
        throw new ApiError (404, "Task not found or not deleted");
    }

    res.status(200).json({
        status: "success",
        message: "Task restored succesfully"
    });
}