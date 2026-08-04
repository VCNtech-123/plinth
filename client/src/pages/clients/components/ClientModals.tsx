// client/src/pages/clients/components/ClientModals.tsx
import AddProjectModal from "../../projects/AddProjectModal";
import EditClientModal from "../EditClientModal";
import DeleteClientModal from "../DeleteClientModal";
import type { ClientDetailsData } from "../../../types/client.types";

interface ClientModalsProps {
  showAddProject: boolean;
  showEditClient: boolean;
  showDeleteClient: boolean;
  client: ClientDetailsData["client"];
  onAddProject: (data: any) => Promise<void>;
  onEditClient: (data: any) => Promise<void>;
  onDeleteClient: () => Promise<void>;
  onCloseAddProject: () => void;
  onCloseEditClient: () => void;
  onCloseDeleteClient: () => void;
  isAddingProject?: boolean;
  isEditingClient?: boolean;
  isDeletingClient?: boolean;
}

const ClientModals = ({
  showAddProject,
  showEditClient,
  showDeleteClient,
  client,
  onAddProject,
  onEditClient,
  onDeleteClient,
  onCloseAddProject,
  onCloseEditClient,
  onCloseDeleteClient,
}: ClientModalsProps) => {
  return (
    <>
      <AddProjectModal
        open={showAddProject}
        onClose={onCloseAddProject}
        onCreate={onAddProject}
        clients={[{ id: client.id, name: client.name }]}
      />

      <EditClientModal
        open={showEditClient}
        onClose={onCloseEditClient}
        client={client}
        onUpdate={onEditClient}
      />

      <DeleteClientModal
        open={showDeleteClient}
        onClose={onCloseDeleteClient}
        onConfirm={onDeleteClient}
      />
    </>
  );
};

export default ClientModals;