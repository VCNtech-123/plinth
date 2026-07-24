import DataTable from "../../components/ui/table/DataTable";
import type { Column } from "../../components/ui/table/DataTable";
import TableSkeleton from "../../components/ui/table/TableSkeleton";
import Pagination from "../../components/ui/table/Pagination";

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  columns: Column<Client>[];
}

const ClientsTable = ({
  clients,
  loading,
  page,
  totalPages,
  onPageChange,
  columns,
}: ClientsTableProps) => {
  if (loading) {
    return <TableSkeleton columns={5} />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <DataTable
          data={clients}
          columns={columns}
          keyField="id"
          emptyMessage="No clients found. Add your first client."
        />
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ClientsTable;