import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

interface TasksHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  projectFilter?: string;
  onProjectChange: (value: string) => void;
  projects: {
    id: string;
    name: string;
  }[];
  onAddClick: () => void;
  canCreate?: boolean;
}

const TasksHeader = ({
  search,
  onSearchChange,
  projectFilter,
  onProjectChange,
  projects,
  onAddClick,
  canCreate = true,
}: TasksHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-app">Tasks</h1>
        <p className="text-sm text-app/70 mt-1">
          Manage and track your workflow.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full sm:w-64"
        />

        <select
          value={projectFilter || ""}
          onChange={(e) => onProjectChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-app bg-card text-sm text-app"
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <Button
          onClick={onAddClick}
          className="w-full sm:w-auto"
          disabled={!canCreate}
          variant={canCreate ? "primary" : "secondary"}
        >
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TasksHeader;