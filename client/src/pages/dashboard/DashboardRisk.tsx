import Badge from "../../components/ui/Badge";
import { useNavigate } from "react-router-dom";

interface Props {
  projects: {
    id: string;
    name: string;
    overdueTasks: number;
  }[];
}

const DashboardRisk = ({ projects }: Props) => {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return <div className="text-sm text-app/60">No projects at risk.</div>;
  }

  return (
    <div className="divide-y divide-(--color-border)">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => navigate(`/projects/${project.id}`)}
          className="w-full py-3 flex items-center justify-between gap-4 text-left hover:bg-app transition-colors rounded-md px-2 -mx-2"
        >
          <div className="min-w-0">
            <div className="text-sm font-medium text-app truncate">
              {project.name}
            </div>
            <div className="text-xs text-app/60">
              Requires attention
            </div>
          </div>

          <Badge variant="danger">
            {project.overdueTasks} overdue
          </Badge>
        </button>
      ))}
    </div>
  );
};

export default DashboardRisk;