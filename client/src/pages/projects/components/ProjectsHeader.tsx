import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface ProjectsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  clientFilter?: string;
  onClientChange: (value: string) => void;
  statusFilter?: string;
  onStatusChange: (value: string) => void;
  onAddClick: () => void;
  clients: { id: string; name: string }[];
  canCreate?: boolean;
}

const ProjectsHeader = ({
  search,
  onSearchChange,
  clientFilter,
  onClientChange,
  statusFilter,
  onStatusChange,
  onAddClick,
  clients,
  canCreate = true,
}: ProjectsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-app">
            Projects
          </h1>
          <p className="text-sm text-app/70 mt-1">
            Manage and track your projects.
          </p>
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={onAddClick}
          disabled={!canCreate}
          variant={canCreate ? "primary" : "secondary"}
        >
          Add Project
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />

        {/* Client Filter */}
        <select
          value={clientFilter || ""}
          onChange={(e) => onClientChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app bg-card text-sm text-app"
        >
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter || ""}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app bg-card text-sm text-app"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectsHeader;