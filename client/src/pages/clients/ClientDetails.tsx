import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { CardContent } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Skeleton from "../../components/ui/Skeleton";
import { getClientById } from "../../api/client.api";
import type { ClientDetailsData } from "../../types/client.types";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ClientDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

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

  return (
    <div className="space-y-8">

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/clients")}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      {/* Client Info */}
      <Card>
        <CardContent className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold">
            {client.name}
          </h1>

          <p className="text-sm opacity-70">
            {client.email}
          </p>

          {client.company && (
            <p className="text-sm opacity-70">
              {client.company}
            </p>
          )}

          <p className="text-xs opacity-50">
            Created {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          accent="success"
        />

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
        />

        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          accent="danger"
        />

      </div>

      {/* Recent Projects */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">
            Recent Projects
          </h2>

          {projects.length === 0 ? (
            <p className="text-sm opacity-60">
              No projects yet.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex justify-between items-center border-b border-app pb-2"
                >
                  <span className="font-medium">
                    {project.name}
                  </span>

                  <span className="text-xs opacity-60">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {stats.totalProjects > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/projects?client=${client.id}`)}
            >
              View All Projects
            </Button>
          )}

        </CardContent>
      </Card>

    </div>
  );
};

export default ClientDetails;