// client/src/pages/projects/ProjectDetails.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import StatCard from "../../components/ui/StatCard";
import EditProjectModal from "./modals/EditProjectModal";
import AddProjectTaskModal from "./modals/AddProjectTaskModal ";
import DeleteProjectModal from "./modals/DeleteProjectModal";
import { useProjectDetails } from "./hooks/useProjectDetails";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Custom hook
  const {
    data,
    loading,
    error,
    fetchProject,
    handleUpdateProject,
    handleDeleteProject,
    handleAddTask,
  } = useProjectDetails(id!);

  // Modal states
  const [showEditProject, setShowEditProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);

  // Fetch on mount
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/projects")}
              className="p-2 rounded-lg hover:bg-app transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-text">
              {project.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 ml-12">
            <button
              onClick={() => navigate(`/clients/${project.client.id}`)}
              className="text-sm text-text/70 hover:text-primary transition-colors"
            >
              {project.client.name}
            </button>

            <span className="text-text/30">•</span>

            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEditProject(true)}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteProject(true)}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Progress & Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          <Card>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text">Progress</h3>
                  <p className="text-sm text-text/60">
                    {stats.completedTasks}/{stats.totalTasks} completed
                  </p>
                </div>

                <div className="w-full bg-app rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>

                <p className="text-sm text-primary font-semibold">
                  {stats.progressPercent}% complete
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.deadline && (
                <div className="flex items-center justify-between pb-4 border-b border-app">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary" />
                    <span className="text-sm text-text/70">Deadline</span>
                  </div>
                  <span className="text-sm font-medium text-text">
                    {new Date(project.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {project.budget && (
                <div className="flex items-center justify-between pb-4 border-b border-app">
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} className="text-primary" />
                    <span className="text-sm text-text/70">Budget</span>
                  </div>
                  <span className="text-sm font-medium text-text">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              )}

              {project.description && (
                <div className="pt-2">
                  <p className="text-xs text-text/60 mb-2">Description</p>
                  <p className="text-sm text-text/80 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            icon={CheckCircle}
            accent="success"
          />

          <StatCard
            title="Overdue"
            value={stats.overdueTasks}
            icon={AlertCircle}
            accent="danger"
          />

          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            accent="primary"
          />
        </div>
      </div>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {tasks.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-text/60 mb-4">No tasks yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Create First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center justify-between p-4 rounded-lg bg-app/50 hover:bg-app transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {task.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <Badge variant={getTaskStatusVariant(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tasks?project=${project.id}`)}
                  className="w-full"
                >
                  View All Tasks →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <EditProjectModal
        open={showEditProject}
        onClose={() => setShowEditProject(false)}
        project={project}
        onUpdate={async (updateData) => {
          await handleUpdateProject(updateData);
          setShowEditProject(false);
        }}
      />

      <AddProjectTaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        projectId={project.id}
        projectName={project.name}
        onCreate={async (taskData) => {
          await handleAddTask(taskData);
          setShowAddTask(false);
        }}
      />

      <DeleteProjectModal
        open={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        onConfirm={async () => {
          await handleDeleteProject();
          setShowDeleteProject(false);
          navigate("/projects");
        }}
        projectName={project.name}
      />
    </div>
  );
};

export default ProjectDetails;