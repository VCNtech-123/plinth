import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import { CardContent } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import StatCard from "../../components/ui/StatCard";
import { getProjectById } from "../../api/project.api";
import type { IProjectDetails } from "../../types/project.types";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<IProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const result = await getProjectById(id!);
        setData(result.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const { project, stats, tasks } = data;

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-semibold">
            {project.name}
          </h1>

          <div className="flex items-center gap-3 mt-2 text-sm opacity-70">
            <button
              onClick={() => navigate(`/clients/${project.client.id}`)}
              className="hover:underline"
            >
              {project.client.name}
            </button>

            <span>•</span>

            <Badge variant="default">
              {project.status}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
        >
          Back
        </Button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
        />

        <StatCard
          title="Completed"
          value={stats.completedTasks}
          accent="success"
        />

        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          accent="danger"
        />

        <StatCard
          title="Completion"
          value={stats.completionRate}
        />

      </div>

      {/* Tasks Preview */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">
            Recent Tasks
          </h2>

          {tasks.length === 0 ? (
            <p className="text-sm opacity-60">
              No tasks yet.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center border-b border-app pb-2"
                >
                  <span>{task.title}</span>
                  <span className="text-xs opacity-60">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/tasks?project=${project.id}`)}
          >
            View All Tasks
          </Button>

        </CardContent>
      </Card>

    </div>
  );
};

export default ProjectDetails;