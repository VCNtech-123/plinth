import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface ClientsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  canCreate?: boolean;
}

const ClientsHeader = ({
  search,
  onSearchChange,
  onAddClick,
  canCreate = true,
}: ClientsHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-app">Clients</h1>
        <p className="text-sm text-app/70 mt-1">Manage your workspace clients.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />

        <Button
          className="w-full sm:w-auto"
          onClick={onAddClick}
          disabled={!canCreate}
          variant={canCreate ? "primary" : "secondary"}
        >
          Add Client
        </Button>
      </div>
    </div>
  );
};

export default ClientsHeader;