import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Dropdown from "../../../components/ui/Dropdown";
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
    <div className="animate-slideUp space-y-4 min-w-0">
      {/* Top row: back + actions (mobile) */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </Button>

        {/* Mobile actions: single dropdown */}
        <div className="sm:hidden">
          <Dropdown
            items={[
              { label: "Add project", onClick: onAddProject },
              { label: "Edit client", onClick: onEdit },
              { label: "Delete client", onClick: onDelete, danger: true },
            ]}
          />
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddProject}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Project
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {/* Title row */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-app truncate">
            {client.name}
          </h1>
          {client.status && (
            <Badge variant={client.status === "active" ? "success" : "default"}>
              {client.status}
            </Badge>
          )}
        </div>

        {/* Optional subtext placeholder (keeps hierarchy nice) */}
        {client.email && (
          <p className="text-sm text-app/60 truncate mt-1">{client.email}</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetailsHeader;