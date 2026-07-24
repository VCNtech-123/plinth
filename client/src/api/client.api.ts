import { api } from "./axios";

export const getClients = async (params?: any) => {
  const response = await api.get("/clients", { params });
  return response.data;
};

export const getClientById = async (id: string) => {
  const response = await api.get(`clients/${id}`);
  return response.data.data;
}

export const createClient = async (data: any) => {
  const response = await api.post("/clients", data);
  return response.data;
};

export const updateClient = async (id: string, data: any) => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
};

export const deleteClient = async (id: string) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};