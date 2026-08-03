import { Client, IClient } from "./client.model";
import { ApiError } from "../../utils/ApiError";
import mongoose from "mongoose";
import { Project } from '../project/project.model'
import { Task } from "../task/task.model";
import { GetClientsQuery, GetClientsFilter, GetClientByIdResponse } from '../../types/clients.types'

export const createClientService = async (
  data: Partial<IClient>,
  userId: mongoose.Types.ObjectId
) => {
  const existingClient = await Client.findOne({
    email: data.email,
    owner: userId,
    isDeleted: false,
  });

  if (existingClient) {
    throw new ApiError(400, "Client already exists");
  }

  const client = await Client.create({
    ...data,
    owner: userId,
  });

  return client;
};

export const getClientsService = async (
  userId: mongoose.Types.ObjectId,
  query: GetClientsQuery
) => {

    const { page, limit, status } = query;
    const skip = Math.max(0, (page - 1) * limit);

    const filter: GetClientsFilter = {
      owner: userId,
      isDeleted: false,
    };

    const search = query.search as string | undefined

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.status = status;
    }

    const [clients, total] = await Promise.all([
      Client.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Client.countDocuments(filter)
    ]);
  
    return {
      clients,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
};

export const getClientByIdService = async (
  id: string,
  userId: mongoose.Types.ObjectId
): Promise<GetClientByIdResponse> => {
  const client = await Client.findOne({
    _id: id,
    owner: userId,
    isDeleted: false,
  }).lean();

  if (!client) {
    throw new ApiError(404, "No client found")
  }

  const now = new Date();

  const [recentProjects, allProjectIds] = await Promise.all([
    Project.find({
      client: id,
      owner: userId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name status createdAt updatedAt")
      .lean(),

    Project.find({
      client: id,
      owner: userId,
      isDeleted: false,
    }).distinct("_id"),
  ]);

  const [
    totalProjects,
    activeProjects,
    totalTasks,
    overdueTasks,
  ] = await Promise.all([
    Project.countDocuments({
      client: id,
      owner: userId,
      isDeleted: false,
    }),

    Project.countDocuments({
      client: id,
      owner: userId,
      isDeleted: false,
      status: "active",
    }),

    Task.countDocuments({
      owner: userId,
      project: { $in: allProjectIds },
      isDeleted: false,
    }),

    Task.countDocuments({
      owner: userId,
      project: { $in: allProjectIds },
      isDeleted: false,
      dueDate: { $lt: now },
      status: { $ne: "done" },
    }),
  ]);

  return {
    client,
    projects: recentProjects,
    stats: {
      totalProjects,
      activeProjects,
      totalTasks,
      overdueTasks,
    },
  };
};

export const updateClientService = async (
  id: string,
  userId: mongoose.Types.ObjectId,
  data: Partial<IClient>
) => {
    const updateData: Partial<
      Pick<IClient, "name" | "email" | "phone" | "company" | "notes" | "status">
    > = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;

    const updatedClient = await Client.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        isDeleted: false,
      },
      updateData,
      { new: true }
    );

    return updatedClient;
};

export const deleteClientService = async (
 id: string,
 userId: mongoose.Types.ObjectId,
) => {
  const deletedClient = await Client.findOneAndUpdate(
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

  return deletedClient;
}

export const restoreProjectService = async (
  id: string | string[], 
  userId: mongoose.Types.ObjectId
) => {

  const restoredClient = await Client.findOneAndUpdate(
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

  if (!restoredClient) {
    throw new ApiError(404, "Client not found")
  }

  return restoredClient;
}