
import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "../../../api/project.api";
import { createTask } from "../../../api/task.api";
import type { IProjectDetails } from "../../../types/project.types";

export const useProjectDetails = (projectId: string) => {
  const [data, setData] = useState<IProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch project
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProjectById(projectId);
      setData(result.data);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to load project";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Update project
  const handleUpdateProject = useCallback(
    async (updateData: any) => {
      try {
        await updateProject(projectId, updateData);
        toast.success("Project updated successfully");
        await fetchProject();
      } catch (err: any) {
        toast.error(err?.message || "Failed to update project");
        throw err;
      }
    },
    [projectId, fetchProject]
  );

  // Delete project
  const handleDeleteProject = useCallback(async () => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete project");
      throw err;
    }
  }, [projectId]);

  // Add task
  const handleAddTask = useCallback(
    async (taskData: any) => {
      try {
        await createTask({
          ...taskData,
          project: projectId,
        });
        toast.success("Task created successfully");
        await fetchProject();
      } catch (err: any) {
        toast.error(err?.message || "Failed to create task");
        throw err;
      }
    },
    [projectId, fetchProject]
  );

  return {
    data,
    loading,
    error,
    fetchProject,
    handleUpdateProject,
    handleDeleteProject,
    handleAddTask,
  };
};