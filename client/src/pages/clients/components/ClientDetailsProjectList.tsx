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

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "paused":
      return "warning";
    case "completed":
      return "default";
    default:
      return "default";
  }
};

const ClientProjectsList = ({
  client,
  projects,
  stats,
  onAddProject,
  onViewAll,
}: ClientProjectsListProps) => {
  const recent = projects.slice(0, 5);

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-app">Projects</h2>
            <p className="text-sm text-app/60 mt-1">
              Recent projects for this client.
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={onAddProject} className="shrink-0">
            <Plus size={16} />
            <span className="hidden sm:inline">New project</span>
          </Button>
        </div>

        {stats.totalProjects > 0 && (
          <div className="mt-3 text-xs text-app/60">
            Showing {Math.min(5, projects.length)} of {stats.totalProjects}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {recent.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-app/60 mb-4">No projects yet.</p>
            <Button variant="primary" size="sm" onClick={onAddProject}>
              Create project
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-app/60 border-b border-app">
              <div className="col-span-6">Project</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Created</div>
            </div>

            {/* Rows */}
            <div className="space-y-2 sm:space-y-0">
              {recent.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-app bg-card sm:bg-transparent sm:border-none"
                >
                  {/* Mobile card layout */}
                  <div className="p-4 sm:hidden space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-app truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-app/60 mt-1">
                          Created{" "}
                          {new Date(project.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Desktop row layout */}
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 border-b border-app last:border-b-0 hover:bg-app transition-colors">
                    <div className="col-span-6 min-w-0">
                      <div className="text-sm font-medium text-app truncate">
                        {project.name}
                      </div>
                    </div>

                    <div className="col-span-3">
                      <Badge variant={getStatusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="col-span-3 text-sm text-app/70">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {stats.totalProjects > 5 && (
          <div className="pt-3 border-t border-app">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewAll(client.id)}
              className="w-full"
            >
              View all projects ({stats.totalProjects})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientProjectsList;