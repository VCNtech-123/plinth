import { Users, FolderKanban, CheckSquare, AlertTriangle } from "lucide-react";
import StatCard from "../../components/ui/StatCard";

interface Props {
  summary: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    overdueTasks: number;
    tasksDueToday: number;
    weeklyCompletionRate: number;
  };
}

const DashboardSummary = ({ summary }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

     <StatCard
      title="Active Projects"
      value={summary.activeProjects}
      icon={FolderKanban}
      accent="success"
    />

    <StatCard
      title="Overdue Tasks"
      value={summary.overdueTasks}
      icon={AlertTriangle}
      accent={summary.overdueTasks > 0 ? "danger" : "success"}
    />

    <StatCard
      title="Weekly Completion"
      value={summary.weeklyCompletionRate}
      icon={CheckSquare}
    />

    <StatCard
      title="Tasks Due Today"
      value={summary.tasksDueToday}
      icon={Users}
    />

    </div>
  );
};

export default DashboardSummary;