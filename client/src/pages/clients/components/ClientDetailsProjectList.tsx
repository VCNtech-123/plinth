// client/src/pages/clients/components/ClientProjectsList.tsx
import { Plus } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import type { ClientDetailsData } from "../../../types/client.types";

interface ClientProjectsListProps {
  client: ClientDetailsData["client"];
  projects: ClientDetailsData["projects"];
  stats: ClientDetailsData["stats"];
  onAddProject: () => void;
  onViewAll: (clientId: string) => void;
}

const ClientProjectsList = ({
  client,
  projects,
  stats,
  onAddProject,
  onViewAll,
}: ClientProjectsListProps) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "default";
      case "paused":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">Recent Projects</h2>
          {stats.totalProjects > 0 && (
            <p className="text-xs opacity-60">
              Showing {Math.min(5, projects.length)} of {stats.totalProjects}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          // Empty State
          <div className="py-8 text-center">
            <p className="text-sm opacity-60 mb-4">No projects yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddProject}
              className="inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header (Desktop Only) */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold opacity-60">
              <div className="col-span-4">Project</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Budget</div>
              <div className="col-span-3">Due Date</div>
            </div>

            {/* Project Cards/Rows */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-app border border-app hover:border-primary/30 transition-all duration-200"
              >
                {/* Project Name */}
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-xs opacity-60 mb-1 sm:hidden font-medium">
                    Project
                  </p>
                  <p className="font-medium text-sm truncate">
                    {project.name}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-1 sm:col-span-2 flex items-end sm:items-start">
                  <p className="text-xs opacity-60 mb-1 sm:hidden font-medium">
                    Status
                  </p>
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                {/* Budget (Hidden on mobile, shown on tablet+) */}
                <div className="col-span-1 sm:col-span-3 hidden sm:flex sm:flex-col">
                  <p className="text-xs opacity-60 mb-1">Budget</p>
                  <p className="text-sm font-medium">
                    {formatCurrency(Math.random() * 20000)}
                  </p>
                </div>

                {/* Due Date (Hidden on mobile, shown on tablet+) */}
                <div className="col-span-1 sm:col-span-3 hidden sm:flex sm:flex-col">
                  <p className="text-xs opacity-60 mb-1">Due Date</p>
                  <p className="text-sm font-medium">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {stats.totalProjects > 5 && (
          <div className="pt-4 border-t border-app">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewAll(client.id)}
              className="w-full"
            >
              View All {stats.totalProjects} Projects →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientProjectsList;