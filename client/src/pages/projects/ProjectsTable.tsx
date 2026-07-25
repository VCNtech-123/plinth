import DataTable from "../../components/ui/table/DataTable";
import TableSkeleton from "../../components/ui/table/TableSkeleton";
import Pagination from "../../components/ui/table/Pagination";
import type { Column } from "../../components/ui/table/DataTable";
import type { Project } from "../../types/project.types";


interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  columns: Column<Project>[];
}

const ProjectsTable = ({
  projects,
  loading,
  page,
  totalPages,
  onPageChange,
  columns,
}: ProjectsTableProps) => {
  if (loading) {
    return <TableSkeleton columns={5} />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <DataTable
          data={projects}
          columns={columns}
          keyField="id"
          emptyMessage="No projects found."
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

export default ProjectsTable;