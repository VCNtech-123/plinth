import { Client, IClient } from "./client.model";
import { ApiError } from "../../utils/ApiError";
import { getPagination } from "../../utils/pagination";
import mongoose from "mongoose";
import { Project } from '../project/project.model'

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
  query: Record<string, unknown>
) => {

    const { page, limit, skip } = getPagination(query);
    const status = query.status;

    const filter: Record<string, unknown> = {
      owner: userId,
      isDeleted: false,
    };

    if (status) {
      filter.status = status;
    }
    const clients = await Client.find({
      owner: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Client.countDocuments(filter);
  
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
) => {

  const [ client, projects ] = await Promise.all(
    [
      Client.findOne({
      _id: id,
      owner: userId,
      isDeleted: false,
    }),

      Project.find({
        client: id,
        owner: userId,
        isDeleted: false
      })
    ])

  return {
    client,
    projects
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