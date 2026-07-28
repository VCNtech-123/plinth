import Card from "../../components/ui/Card";
import { CardContent, CardHeader } from "../../components/ui/Card";

interface Props {
  activity: {
    completed: any[];
    created: any[];
  };
}

const DashboardActivity = ({ activity }: Props) => {
  return (
    <Card variant="elevated">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          Recent Activity
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        {[...activity.created.slice(0, 3)].map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center border-b border-app pb-2"
          >
            <span>{task.title}</span>
            <span className="text-xs opacity-60">
              {task.project.name}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardActivity;