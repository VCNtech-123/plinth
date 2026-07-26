
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { getProjects, deleteProject, createProject, updateProject } from "../../api/project.api";
import { toast } from "sonner";
import Badge from "../../components/ui/Badge";
import Dropdown from "../../components/ui/Dropdown";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsTable from "./ProjectsTable";
import type { Column } from "../../components/ui/table/DataTable";
import type { Project } from "../../types/project.types";
import AddProjectModal from "./AddProjectModal";
import { getClients } from "../../api/client.api";
import EditProjectModal from "./EditProjectModal";

const Projects = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [clientFilter, setClientFilter] = useState<string | undefined>();
    const [statusFilter, setStatusFilter] = useState<string | undefined>();
    const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500);

        return () => clearTimeout(timer);
    }, [ search ]);

    useEffect(() => {
        try {
            const fetchProjects = async () => {
                setLoading(true)
                
                const response = await getProjects({
                    page, 
                    limit,
                    search: debouncedSearch,
                    client: clientFilter, 
                    status: statusFilter
                });

                setProjects(response.data);
                setTotalPages(response.pages);
            }
                fetchProjects();
        } catch (err: any) {
            toast.error(err?.message || "Failed to load projects");
        } finally {
            setLoading(false)
        }

        
    }, [page, limit, debouncedSearch, clientFilter, statusFilter]);

    useEffect(() => {
      const fetchClients = async () => {
        try {
          const response = await getClients({
            page: 1,
            limit: 100, 
          });

          setClients(response.data);
        } catch (err) {
          console.error("Failed to load clients");
        }
      };

      fetchClients();
    }, []);

    const handleDeleteProject = async (id: string) => {
        try {
        await deleteProject(id);
        toast.success("Project deleted successfully");

        const response = await getProjects({
            page,
            limit,
            search: debouncedSearch,
            client: clientFilter,
            status: statusFilter,
        });

        setProjects(response.data);
        setTotalPages(response.pages);

        } catch (err: any) {
        toast.error(err?.message || "Failed to delete project");
        }
    };

    const handleCreateProject = async (data: {
      name: string;
      description?: string;
      deadline?: string;
      budget?: number;
      client: string;
    }) => {
     try {
        await createProject(data);
        toast.success("Project deleted successfully");

        const response = await getProjects({
            page,
            limit,
            search: debouncedSearch,
            client: clientFilter,
            status: statusFilter,
        });

        setProjects(response.data);
        setTotalPages(response.pages);

        } catch (err: any) {
          toast.error(err?.message || "Failed to delete project");
        }
    };

    const handleUpdateProject = async (id: string, data: any) => {
      try {
        await updateProject(id, data);
        toast.success("Project updated");

        const response = await getProjects({
          page,
          limit,
          search: debouncedSearch,
          client: clientFilter,
          status: statusFilter,
        });

        setProjects(response.data);
        setTotalPages(response.pages);

      } catch (err: any) {
        toast.error("Failed to update project");
      }
    };

     const columns: Column<Project>[] = [
    {
      header: "Project",
      accessor: "name",
    },
    {
      header: "Client",
      accessor: "client",
      render: (row) => (
        <span className="text-sm opacity-80">
          {row.client.name}
        </span>
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
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString(),
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
              onClick: () => handleDeleteProject(row.id),
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
        onAddClick={() => console.log(setIsAddOpen(true))}
        clients={clients}
      />

      <ProjectsTable
        projects={projects}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        columns={columns}
      />

      <AddProjectModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreate={handleCreateProject}
        clients={clients}
      />

      <EditProjectModal
        open={!!editProject}
        onClose={() => setEditProject(null)}
        project={editProject}
        onUpdate={handleUpdateProject}
      />

    </div>
  );
}

export default Projects;