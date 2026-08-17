
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../../api/client.api";
import Badge from "../../components/ui/Badge";
import Dropdown from "../../components/ui/Dropdown";
import ProjectsHeader from "./components/ProjectsHeader";
import ProjectsTable from "./components/ProjectsTable";
import AddProjectModal from "./modals/AddProjectModal";
import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectModal from "./modals/DeleteProjectModal";
import { useProjectsActions } from "./hooks/useProjectsActions";
import type { Column } from "../../components/ui/table/DataTable";
import type { Project } from "../../types/project.types";
import { useWorkspaceStore } from "../../store/workspace.store";
import EmptyState from "../../components/ui/EmptyState";

const Projects = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [clientFilter, setClientFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState("");

  const {
    projects,
    loading,
    totalPages,
    fetchProjects,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useProjectsActions();
  const workspaceVersion = useWorkspaceStore((s) => s.version)

  const role = useWorkspaceStore((s) => s.current.role);
  const canCreate = role === "owner" || role === "admin" || role === "member";

  const hasFilters =
    debouncedSearch.trim().length > 0 ||
    search.trim().length > 0 ||
    !!clientFilter ||
    !!statusFilter;

  const isEmpty = !loading && projects.length === 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch projects when filters change
  useEffect(() => {
    fetchProjects({
      page,
      limit,
      search: debouncedSearch,
      client: clientFilter,
      status: statusFilter,
    });
  }, [page, limit, debouncedSearch, clientFilter, statusFilter, fetchProjects, workspaceVersion]);

  // Fetch clients for filters
  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const response = await getClients({ page: 1, limit: 100 });
        setClients(response.data);
      } catch (err) {
        console.error("Failed to load clients");
      }
    };

    fetchClientsData();
  }, []);

  // Table columns
  const columns: Column<Project>[] = [
    {
      header: "Project",
      accessor: "name",
    },
    {
      header: "Client",
      accessor: "client",
      render: (row) => (
        <span className="text-sm opacity-80">{row.client.name}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <Badge
          variant={
            row.status === "active"
              ? "success"
              : row.status === "paused"
                ? "warning"
                : "default"
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "",
      accessor: "id",
      render: (row) => (
        <Dropdown
          items={[
            {
              label: "View",
              onClick: () => navigate(`/projects/${row.id}`),
            },
            {
              label: "Edit",
              onClick: () => setEditProject(row),
            },
            {
              label: "Delete",
              onClick: () => {
                setDeleteProjectId(row.id);
                setDeleteProjectName(row.name);
              },
              danger: true,
            },
          ]}
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <ProjectsHeader
        search={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        clientFilter={clientFilter}
        onClientChange={(value) => {
          setPage(1);
          setClientFilter(value || undefined);
        }}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setPage(1);
          setStatusFilter(value || undefined);
        }}
        onAddClick={() => setIsAddOpen(true)}
        clients={clients}
         canCreate={canCreate}
      />

      {isEmpty ? (
        <EmptyState
          title={hasFilters ? "No results" : "No projects yet"}
          description={
            hasFilters
              ? "Try clearing filters or changing your search."
              : "Create your first project to start tracking work."
          }
          action={
            canCreate
              ? {
                  label: "Add project",
                  onClick: () => setIsAddOpen(true),
                  variant: "primary",
                }
              : undefined
          }
        />
      ) : (
        <ProjectsTable
          projects={projects}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          columns={columns}
        />
      )}

      <AddProjectModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={async (data) => {
          await handleCreateProject(data, {
            page,
            limit,
            search: debouncedSearch,
            client: clientFilter,
            status: statusFilter,
          });
          setIsAddOpen(false);
        }}
        clients={clients}
      />

      <EditProjectModal
        open={!!editProject}
        onClose={() => setEditProject(null)}
        project={editProject}
        onUpdate={async (id, data) => {
          await handleUpdateProject(id, data, {
            page,
            limit,
            search: debouncedSearch,
            client: clientFilter,
            status: statusFilter,
          });
          setEditProject(null);
        }}
      />

      <DeleteProjectModal
        open={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        onConfirm={async () => {
          await handleDeleteProject(deleteProjectId!, {
            page,
            limit,
            search: debouncedSearch,
            client: clientFilter,
            status: statusFilter,
          });
          setDeleteProjectId(null);
        }}
        projectName={deleteProjectName}
      />
    </div>
  );
};

export default Projects;