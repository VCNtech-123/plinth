import Card from "../../components/ui/Card";
import { CardContent, CardHeader } from "../../components/ui/Card";
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

  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          At Risk Projects
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-sm opacity-60">
            No projects at risk 🎉
          </p>
        ) : (
          projects.map((project) => (
            <div
              onClick={() => navigate(`projects/${project.id}`)}
              key={project.id}
              className="flex justify-between items-center border-b border-app pb-2 cursor-pointer"
            >
              <span>{project.name}</span>
              <Badge variant="danger">
                {project.overdueTasks} overdue
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardRisk;