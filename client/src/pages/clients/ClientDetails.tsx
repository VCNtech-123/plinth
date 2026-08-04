import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import { getClientById } from "../../api/client.api";
import type { ClientDetailsData } from "../../types/client.types";

// Import modals
import AddProjectModal from "../projects/AddProjectModal";
import EditClientModal from "./EditClientModal";
import DeleteClientModal from "./DeleteClientModal";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<ClientDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showDeleteClient, setShowDeleteClient] = useState(false);

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
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Helper: calculate stats
  const completionRate = stats.totalTasks
    ? Math.round(((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100)
    : 0;

  const avgBudget = stats.totalProjects > 0 ? 12500 : 0; // Placeholder — you'd compute this from projects

  return (
    <div className="space-y-8">
      {/* ===== HEADER WITH ACTIONS ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slideUp">
        {/* Back Button + Title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/clients")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-app">
              {client.name}
            </h1>
            <p className="text-sm opacity-60 mt-1">
              {client.status && (
                <Badge variant={client.status === "active" ? "success" : "default"}>
                  {client.status}
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Project
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowEditClient(true)}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteClient(true)}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideUp">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Building2}
          accent="primary"
        />

        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          accent="success"
        />

        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          accent="primary"
        />

        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          accent="danger"
        />

        <StatCard
          title="Completion Rate"
          value={completionRate}
          accent="success"
        />

        <StatCard
          title="Avg Budget/Project"
          value={formatCurrency(avgBudget)}
          accent="primary"
        />
      </div>

      {/* ===== CONTACT INFORMATION ===== */}
      <Card className="animate-slideUp">
        <CardHeader>
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          {client.email && (
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs opacity-60">Email</p>
                <a
                  href={`mailto:${client.email}`}
                  className="text-sm font-medium break-all hover:text-primary transition-colors"
                >
                  {client.email}
                </a>
              </div>
            </div>
          )}

          {/* Phone */}
          {client.phone && (
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-primary mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs opacity-60">Phone</p>
                <a
                  href={`tel:${client.phone}`}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {client.phone}
                </a>
              </div>
            </div>
          )}

          {/* Company */}
          {client.company && (
            <div className="flex items-start gap-3">
              <Building2 size={18} className="text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs opacity-60">Company</p>
                <p className="text-sm font-medium">{client.company}</p>
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="pt-3 border-t border-app">
            <p className="text-xs opacity-50">
              Member since{" "}
              <span className="font-medium">
                {new Date(client.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ===== RECENT PROJECTS ===== */}
      <Card className="animate-slideUp">
        <CardHeader>
          <div className="flex items-center justify-between">
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
            <div className="py-8 text-center">
              <p className="text-sm opacity-60 mb-4">No projects yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddProject(true)}
                className="inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Table Header (Desktop) */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold opacity-60">
                <div className="col-span-4">Project Name</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Budget</div>
                <div className="col-span-3">Due Date</div>
              </div>

              {/* Project Rows */}
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`grid sm:grid-cols-12 gap-4 p-4 rounded-lg bg-app border border-app hover:border-primary/30 transition-colors ${
                    idx !== projects.length - 1 ? "" : ""
                  }`}
                >
                  {/* Project Name (Mobile + Desktop) */}
                  <div className="col-span-12 sm:col-span-4">
                    <p className="text-xs opacity-60 mb-1 sm:hidden">Project</p>
                    <p className="font-medium text-sm truncate">
                      {project.name}
                    </p>
                  </div>

                  {/* Status (Mobile + Desktop) */}
                  <div className="col-span-6 sm:col-span-2">
                    <p className="text-xs opacity-60 mb-1 sm:hidden">Status</p>
                    <Badge
                      variant={
                        project.status === "active"
                          ? "success"
                          : project.status === "completed"
                            ? "default"
                            : "warning"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {/* Budget (Mobile + Desktop) */}
                  <div className="col-span-6 sm:col-span-3">
                    <p className="text-xs opacity-60 mb-1 sm:hidden">Budget</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(Math.random() * 20000)}
                    </p>
                  </div>

                  {/* Due Date (Desktop Only) */}
                  <div className="col-span-12 sm:col-span-3 hidden sm:block">
                    <p className="text-sm">
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
                onClick={() => navigate(`/projects?client=${client.id}`)}
                className="w-full"
              >
                View All {stats.totalProjects} Projects →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== MODALS ===== */}
      <AddProjectModal
        open={showAddProject}
        onClose={() => setShowAddProject(false)}
        onCreate={async (projectData) => {
          // You'll need to implement this in your page/logic
          console.log("Creating project:", projectData);
        }}
        clients={[{ id: client.id, name: client.name }]}
      />

      <EditClientModal
        open={showEditClient}
        onClose={() => setShowEditClient(false)}
        client={client}
        onUpdate={async (id, data) => {
          // You'll need to implement this in your page/logic
          console.log("Updating client:", id, data);
        }}
      />

      <DeleteClientModal
        open={showDeleteClient}
        onClose={() => setShowDeleteClient(false)}
        onConfirm={async () => {
          // You'll need to implement this in your page/logic
          console.log("Deleting client:", client.id);
        }}
      />
    </div>
  );
};

export default ClientDetails;