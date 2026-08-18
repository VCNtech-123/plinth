import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getClientById, updateClient, deleteClient } from "../../../api/client.api";
import { createProject } from "../../../api/project.api";
import type { ClientDetailsData } from "../../../types/client.types";

export const useClientActions = (clientId: string) => {
  const navigate = useNavigate();

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  const handleAddProject = useCallback(
    async (
      projectData: {
        name: string;
        description?: string;
        deadline?: string;
        budget?: number;
        client: string;
      },
      onSuccess: (data: ClientDetailsData) => void
    ) => {
      try {
        setIsAddingProject(true);
        await createProject(projectData);
        toast.success("Project created successfully!");
        const result = await getClientById(clientId);
        onSuccess(result);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? err?.message ?? "Failed to create project");
      } finally {
        setIsAddingProject(false);
      }
    },
    [clientId]
  );

  const handleEditClient = useCallback(
    async (
      updateData: { name: string; email: string },
      onSuccess: (data: ClientDetailsData) => void
    ) => {
      try {
        setIsEditingClient(true);
        await updateClient(clientId, updateData);
        toast.success("Client updated successfully!");
        const result = await getClientById(clientId);
        onSuccess(result);
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? err?.message ?? "Failed to update client");
      } finally {
        setIsEditingClient(false);
      }
    },
    [clientId]
  );

  const handleDeleteClient = useCallback(async () => {
    try {
      setIsDeletingClient(true);
      await deleteClient(clientId);
      toast.success("Client deleted successfully!");
      navigate("/clients");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? err?.message ?? "Failed to delete client");
    } finally {
      setIsDeletingClient(false);
    }
  }, [clientId, navigate]);

  return {
    handleAddProject,
    handleEditClient,
    handleDeleteClient,
    isAddingProject,
    isEditingClient,
    isDeletingClient,
  };
};