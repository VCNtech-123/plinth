import { Request, Response } from "express";
import { createClientService } from "./client.service";
import { getClientsService } from "./client.service";
import mongoose from "mongoose";
import { ApiError } from "../../utils/ApiError";
import { getClientByIdService, updateClientService, deleteClientService } from "./client.service";
import { GetClientsQuery } from "./client.validation";


export const createClient = async (req: Request, res: Response) => {
  const client = await createClientService(
    req.body,
    req.user!._id
  );

  res.status(201).json({
    status: "success",
    data: {
      id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      notes: client.notes,
      status: client.status,
      createdAt: client.createdAt,
    },
  });
};

export const getClients = async (req: Request, res: Response) => {

  const { query } = res.locals.validated as {
    query: GetClientsQuery;
  };

  const result = await getClientsService(
    req.user!._id,
    query
  );

  res.status(200).json({
    status: "success",
    results: result.clients.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: result.clients.map((client) => ({
      id: client._id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status,
      createdAt: client.createdAt,
    })),
  });
};


export const getClientById = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await getClientByIdService(
    id,
    req.user!._id
  );

  const { client, projects, stats } = result;

  res.status(200).json({
    status: "success",
    data: {
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        status: client.status,
        createdAt: client.createdAt,
      },
      projects: projects.map((project) => ({
        id: project._id,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      })),
      stats,
    },
  });
};

export const updateClient = async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const updatedClient = await updateClientService(
    id,
    req.user!._id,
    req.body
  );

  if (!updatedClient) {
    throw new ApiError(404, "Client not found");
  }

  res.status(200).json({
    status: "success",
    data: {
      id: updatedClient._id,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
      company: updatedClient.company,
      notes: updatedClient.notes,
      status: updatedClient.status,
      updatedAt: updatedClient.updatedAt,
    },
  });
};


export const deleteClient = async (req: Request, res: Response) => {
  const id = req.params.id as string;

   await deleteClientService(
    id, 
    req.user!._id
  );

  res.status(200).json({
    status: "success",
    message: "Client deleted succesfully"
  });
}