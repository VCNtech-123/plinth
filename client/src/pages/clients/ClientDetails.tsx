// client/src/pages/clients/ClientDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "../../components/ui/Skeleton";
import Card, { CardContent } from "../../components/ui/Card";
import { getClientById } from "../../api/client.api";
import type { ClientDetailsData } from "../../types/client.types";

// Sub-components
import ClientDetailsHeader from "./components/ClientDetailsHeader";
import ClientDetailsStats from "./components/ClientDetailsStats";
import ClientDetailsContactInfo from "./components/ClientDetailsContactInfo";
import ClientDetailsProjectsList from "./components/ClientDetailsProjectList";
import ClientModals from "./components/ClientModals";

// Custom hook
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

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const result = await getClientById(id!);
        setData(result);
      } catch (err: any) {
        setError(err?.message || "Failed to load client");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClient();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <Card>
        <CardContent>
          <p className="text-(--color-danger)">
            {error || "Client not found"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { client, projects, stats } = data;
  const avgBudget = stats.totalProjects > 0 ? 12500 : 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
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

      {/* Modals */}
      <ClientModals
        showAddProject={showAddProject}
        showEditClient={showEditClient}
        showDeleteClient={showDeleteClient}
        client={client}
        onAddProject={(projectData) =>
          handleAddProject(projectData, setData)
        }
        onEditClient={(clientId, updateData) =>
          handleEditClient(updateData, setData)
        }
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