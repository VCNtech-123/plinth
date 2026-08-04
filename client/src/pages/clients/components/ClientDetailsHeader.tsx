// client/src/pages/clients/components/ClientHeader.tsx
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import type { Client } from "../../../types/client.types";

interface ClientHeaderProps {
  client: Client;
  onBack: () => void;
  onAddProject: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ClientDetailsHeader = ({
  client,
  onBack,
  onAddProject,
  onEdit,
  onDelete,
}: ClientHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slideUp">
      {/* Left: Back + Title */}
      <div className="flex items-start gap-3 sm:items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-app truncate">
            {client.name}
          </h1>
          {client.status && (
            <Badge variant={client.status === "active" ? "success" : "default"}>
              {client.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Right: Action Buttons (mobile: stacked, desktop: row) */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddProject}
          className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Project</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onEdit}
          className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
        >
          <Edit2 size={16} />
          <span className="hidden sm:inline">Edit</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onDelete}
          className="flex items-center justify-center gap-2 flex-1 sm:flex-none"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientDetailsHeader;