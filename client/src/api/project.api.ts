import { api } from "./axios";

interface ProjectsParam {
  page?: number,
  limit?: number,
  search?: string,
  client?: string | undefined,
  status?: string| undefined
}
export const getProjects = async ({
  page, 
  limit,
  search,
  client,
  status
}: ProjectsParam) => {
  const response = await api.get("/projects", { params: { page, limit, search, client, status } });
  return response.data;
};

export const getProjectById = async (id: string) => {
  const response = await api.get(`/projects/${id}`)
  return response.data;
}

export const createProject = async (data: any) => {
  const response = await api.post("/projects", data);
  return response.data;
};

export const updateProject = async (id: string, data: any) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

export const restoreProject = async (id: string) => {
  const response = await api.patch(`/projects/${id}/restore`);
  return response.data;
};