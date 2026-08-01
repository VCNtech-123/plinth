
import { Task, ITask } from "./task.model";
import { Project } from "../project/project.model";
import { ApiError } from "../../utils/ApiError";
import { getPagination } from "../../utils/pagination";
import mongoose from 'mongoose'
import { GetTaskResponse, PopulatedTask } from "../../types/task.types";
import { UpdateTaskData } from './task.validation'

export const createTaskService = async (
    data: UpdateTaskData,
    userId: mongoose.Types.ObjectId
) => {

    const project = await Project.findOne({
        _id: data.project,
        owner: userId,
        isDeleted: false
    });

    if (!project) {
        return null
    }

    const task = await Task.create({
        ...data,
        owner: userId
    })

    return task;
}

export const getTaskService = async (
    userId: mongoose.Types.ObjectId,
    query: Record<string, unknown>
): Promise<GetTaskResponse> => {

    const { page, limit, skip } = getPagination(query);

    const filter: Record<string, unknown> = {
        owner: userId,
        isDeleted: false
    }

    if (query.project) {
        filter.project = query.project;
    }

    if (query.status) {
        filter.status = query.status;
    }

    if (query.priority) {
        filter.priority = query.priority;
    } 

    const tasks = await Task.find(filter)
    .populate("project", "name")
    .lean<PopulatedTask[]>()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Task.countDocuments(filter);

    return {
        tasks,
        total,
        page,
        pages: Math.ceil(total / limit)
    }
}

export const getTaskByIdService = async (
    id: string,
    userId: mongoose.Types.ObjectId
): Promise<PopulatedTask | null> => {
    
    const task = await Task.findOne({
        _id: id,
        owner: userId,
        isDeleted: false
    })
    .populate("project", "name")
    .lean<PopulatedTask>();

    return task;
}

export const updateTaskByIdService = async (
    id: string,
    userId: mongoose.Types.ObjectId,
    data: Partial<ITask>
): Promise<PopulatedTask | null> => {

    const updateData: Partial<
        Pick<ITask, "title" | "description" | "status" | "priority" | "dueDate">
    > = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

  const updatedTask = await Task.findOneAndUpdate(
    {
    _id: id,
    owner: userId,
    isDeleted: false
  },
    updateData,
    { new: true }
    )
    .populate("project", "name")
    .lean<PopulatedTask>();

    return updatedTask;
}

export const deleteTaskService = async (
    id: string,
    userId: mongoose.Types.ObjectId
) => {

    const deletedTask = await Task.findOneAndUpdate(
        {
            _id: id,
            owner: userId,
            isDeleted: false
        },
        {
            isDeleted: true
        },
        { new: true }
    );

    return deletedTask;
}

export const restoreTaskService = async (
    id: string,
    userId: mongoose.Types.ObjectId
) => {
    
    const restoredTask = await Task.findOneAndUpdate(
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

    return restoredTask;
}