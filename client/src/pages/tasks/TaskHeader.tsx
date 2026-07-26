import Input from "../../components/ui/Input";

interface TasksHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  projectFilter?: string;
  onProjectChange: (value: string) => void;
  projects: { id: string; name: string }[];
}

const TasksHeader = ({
  search,
  onSearchChange,
  projectFilter,
  onProjectChange,
  projects,
}: TasksHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">

      <div>
        <h1 className="text-xl sm:text-2xl font-semibold">
          Tasks
        </h1>
        <p className="text-sm opacity-70 mt-1">
          Manage and track your workflow.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />

        <select
          value={projectFilter || ""}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app bg-card text-sm"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
};

export default TasksHeader;