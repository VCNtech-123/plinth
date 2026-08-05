
import ClientDetailsAddProjectModal from "../modals/ClientDetailsAddProjectModal";
import EditClientModal from "../modals/EditClientModal";
import DeleteClientModal from "../modals/DeleteClientModal";
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
      <ClientDetailsAddProjectModal
        open={showAddProject}
        onClose={onCloseAddProject}
        clientName={client.name}
        clientId={client.id}
        onCreate={onAddProject}
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