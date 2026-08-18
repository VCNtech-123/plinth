import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getClientById } from "../../api/client.api";
import type { ClientDetailsData } from "../../types/client.types";

import ClientDetailsHeader from "./components/ClientDetailsHeader";
import ClientDetailsStats from "./components/ClientDetailsStats";
import ClientDetailsContactInfo from "./components/ClientDetailsContactInfo";
import ClientDetailsProjectsList from "./components/ClientDetailsProjectList";
import ClientModals from "./components/ClientModals";

import { useClientActions } from "./hooks/useClientActions";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ClientDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showDeleteClient, setShowDeleteClient] = useState(false);

  const {
    handleAddProject,
    handleEditClient,
    handleDeleteClient,
    isAddingProject,
    isEditingClient,
    isDeletingClient,
  } = useClientActions(id!);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setError(null);
        setLoading(true);
        const result = await getClientById(id!);
        setData(result);
      } catch (err: any) {
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load client");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 min-w-0">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-app">Couldn’t load client</div>
            <p className="text-sm text-app/60 mt-1">
              {error || "Client not found."}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/clients")}>
              Back to clients
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { client, projects, stats } = data;
  const avgBudget = stats.totalProjects > 0 ? 12500 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      <ClientDetailsHeader
        client={client}
        onBack={() => navigate("/clients")}
        onAddProject={() => setShowAddProject(true)}
        onEdit={() => setShowEditClient(true)}
        onDelete={() => setShowDeleteClient(true)}
      />

      <ClientDetailsStats stats={stats} avgBudget={avgBudget} />

      <ClientDetailsContactInfo client={client} />

      <ClientDetailsProjectsList
        client={client}
        projects={projects}
        stats={stats}
        onAddProject={() => setShowAddProject(true)}
        onViewAll={(clientId) => navigate(`/projects?client=${clientId}`)}
      />

      <ClientModals
        showAddProject={showAddProject}
        showEditClient={showEditClient}
        showDeleteClient={showDeleteClient}
        client={client}
        onAddProject={(projectData) => handleAddProject(projectData, setData)}
        onEditClient={(updateData) => handleEditClient(updateData, setData)}
        onDeleteClient={() => handleDeleteClient()}
        onCloseAddProject={() => setShowAddProject(false)}
        onCloseEditClient={() => setShowEditClient(false)}
        onCloseDeleteClient={() => setShowDeleteClient(false)}
        isAddingProject={isAddingProject}
        isEditingClient={isEditingClient}
        isDeletingClient={isDeletingClient}
      />
    </div>
  );
};

export default ClientDetails;