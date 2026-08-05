
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../../api/project.api";
import type { Project } from "../../../types/project.types";

interface FetchFilters {
  page: number;
  limit: number;
  search: string;
  client?: string;
  status?: string;
}

export const useProjectsActions = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProjects = useCallback(async (filters: FetchFilters) => {
    try {
      setLoading(true);
      const response = await getProjects(filters);
      setProjects(response.data);
      setTotalPages(response.pages);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load projects");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateProject = useCallback(
    async (
      data: {
        name: string;
        description?: string;
        deadline?: string;
        budget?: number;
        client: string;
      },
      filters: FetchFilters
    ) => {
      try {
        await createProject(data);
        toast.success("Project created successfully");
        await fetchProjects(filters);
      } catch (err: any) {
        toast.error(err?.message || "Failed to create project");
        throw err;
      }
    },
    [fetchProjects]
  );

  const handleUpdateProject = useCallback(
    async (id: string, data: any, filters: FetchFilters) => {
      try {
        await updateProject(id, data);
        toast.success("Project updated successfully");
        await fetchProjects(filters);
      } catch (err: any) {
        toast.error(err?.message || "Failed to update project");
        throw err;
      }
    },
    [fetchProjects]
  );

  // Delete project
  const handleDeleteProject = useCallback(
    async (id: string, filters: FetchFilters) => {
      try {
        await deleteProject(id);
        toast.success("Project deleted successfully");
        await fetchProjects(filters);
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete project");
        throw err;
      }
    },
    [fetchProjects]
  );

  return {
    projects,
    loading,
    totalPages,
    fetchProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  };
};