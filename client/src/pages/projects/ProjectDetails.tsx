// client/src/pages/projects/ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const result = await getProjectById(id!);
        setData(result.data);
      } catch (err: any) {
        setError(err?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent>
          <p className="text-(--color-danger)">
            {error || "Project not found"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const { project, stats, tasks } = data;

  // Calculate progress percentage
  const progressPercent =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  // Format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Get status color
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

  // Get task status color
  const getTaskStatusVariant = (status: string) => {
    switch (status) {
      case "done":
        return "success";
      case "in-progress":
        return "warning";
      case "todo":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <button
                onClick={() => navigate(`/clients/${project.client.id}`)}
                className="text-sm text-primary hover:underline transition-colors"
              >
                {project.client.name}
              </button>

              <span className="text-text/30">•</span>

              <Badge variant={getStatusVariant(project.status)}>
                {project.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Deadline */}
        {project.deadline && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-3">
              <Calendar size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text/60">Deadline</p>
                <p className="text-sm font-semibold text-text">
                  {new Date(project.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget */}
        {project.budget && (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-start gap-3">
              <DollarSign size={18} className="text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text/60">Budget</p>
                <p className="text-sm font-semibold text-text">
                  {formatCurrency(project.budget)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Total Tasks */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-start gap-3">
            <Clock size={18} className="text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text/60">Total Tasks</p>
              <p className="text-sm font-semibold text-text">
                {stats.totalTasks}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-start gap-3">
            <CheckCircle size={18} className="text-success mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text/60">Completion</p>
              <p className="text-sm font-semibold text-text">
                {progressPercent}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text">Overall Progress</h3>
            <p className="text-sm text-text/60">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>

          <div className="w-full bg-app rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle}
          accent="success"
        />

        <StatCard
          title="In Progress"
          value={stats.totalTasks - stats.completedTasks - stats.overdueTasks}
          icon={Clock}
          accent="warning"
        />

        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={AlertCircle}
          accent="danger"
        />
      </div>

      {/* Description */}
      {project.description && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Description</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-text/80">
              {project.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Recent Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {tasks.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-text/60 mb-4">No tasks yet</p>
              <Button
                variant="primary"
                size="sm"
                className="inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Create First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Task List Header (Desktop) */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-text/60">
                <div className="col-span-5">Task</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-3">Due Date</div>
              </div>

              {/* Task Rows */}
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg bg-app border border-app hover:border-primary/30 transition-colors"
                >
                  {/* Task Title */}
                  <div className="col-span-2 sm:col-span-5">
                    <p className="text-xs text-text/60 mb-1 sm:hidden font-medium">
                      Task
                    </p>
                    <p className="text-sm font-medium text-text truncate">
                      {task.title}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-xs text-text/60 mb-1 sm:hidden font-medium">
                      Status
                    </p>
                    <Badge variant={getTaskStatusVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </div>

                  {/* Priority */}
                  <div className="col-span-1 sm:col-span-2 hidden sm:flex">
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "danger"
                          : task.priority === "medium"
                            ? "warning"
                            : "default"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2 sm:col-span-3 hidden sm:flex">
                    <p className="text-sm text-text">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tasks.length > 0 && (
            <div className="pt-4 border-t border-app">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/tasks?project=${project.id}`)}
                className="w-full"
              >
                View All Tasks →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;