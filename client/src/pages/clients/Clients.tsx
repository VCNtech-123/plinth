import { useState, useEffect } from "react";
import type { Column } from "../../components/ui/table/DataTable";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getClients } from "../../api/client.api";
import { createClient, deleteClient } from "../../api/client.api";
import AddClientModal from "./AddClientModal";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DeleteClientModal from "./DeleteClientModal";
import ClientsHeader from "./ClientsHeader";
import ClientsTable from "./ClientsTable";

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Clients = () => {

    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editClient, setEditClient] = useState<Client | null>(null);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(search);
      }, 500);

      return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const getClientsData = async () => {
            try {
                setLoading(true);
                const response = await getClients({ page, limit, search: debouncedSearch})
                console.log(response);
                setClients(response.data);
                setTotalPages(response.pages)
            } catch (err: any) {
                console.log(err?.message || "failed to fetch data")
            } finally {
                setLoading(false)
            }
        }
        
        getClientsData();
    }, [page, limit, debouncedSearch]);

    const handleCreateClient = async (data: {
      name: string;
      email: string
    }) => {

     try {
        await createClient(data);
        toast.success("Client created successfully");
        
        if (page !== 1) {
          setPage(1);
        } else {
          const response = await getClients({ page, limit, search: debouncedSearch });
          setClients(response.data);
          setTotalPages(response.totalPages);
        }

      } catch (err: any) {
        console.error(err?.message || "Failed to create client");
      }
    }

    const handleDeleteClient = async () => {
      if (!deleteId) return;

      try {
        await deleteClient(deleteId);
        toast.success("Client deleted successfully");

        setDeleteId(null);
        if (clients.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          const response = await getClients({
            page,
            limit,
            search: debouncedSearch,
          });

          setClients(response.data);
          setTotalPages(response.pages);
        }

      } catch (err: any) {
        toast.error(err?.message || "Failed to delete client");
      }
    };

    const columns: Column<Client>[] = [
        {
        header: "Name",
        accessor: "name",
        },
        {
        header: "Email",
        accessor: "email",
        },
        {
        header: "Created",
        accessor: "createdAt",
        render: (row) =>
            new Date(row.createdAt).toLocaleDateString(),
        },
        {
        header: "Status",
        accessor: "name",
        render: () => <Badge variant="success">Active</Badge>,
        },
        {
        header: "",
        accessor: "id",
        render: (row) => (
             <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/clients/${row.id}`)}
              >
                View
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditClient(row)}
              >
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteId(row.id)}
              >
                Delete
              </Button>
            </div>
        ),
        className: "text-right",
        },
    ];

    return (
      <div className="space-y-6">

        <ClientsHeader
          search={search}
          onSearchChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          onAddClick={() => setIsAddOpen(true)}
        />

        <ClientsTable
          clients={clients}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          columns={columns}
        />

        <AddClientModal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onCreate={handleCreateClient}
        />

        <DeleteClientModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDeleteClient}
        />

      </div>
    );
};

export default Clients;