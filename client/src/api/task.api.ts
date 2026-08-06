import { api } from "./axios";
import type { UpdateTaskBody } from "../types/task.types";

export const getTasks = async (params?: any) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data.data
}

export const createTask = async (data: any) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskBody) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const restoreTask = async (id: string) => {
  const response = await api.patch(`/tasks/${id}/restore`);
  return response.data;
};