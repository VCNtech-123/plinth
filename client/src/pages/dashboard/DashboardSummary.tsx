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
        title="Total Tasks"
        value={summary.totalTasks}
        icon={CheckSquare}
      />

      <StatCard
        title="Overdue Tasks"
        value={summary.overdueTasks}
        icon={AlertTriangle}
        accent="danger"
      />

      <StatCard
        title="Weekly Completion %"
        value={summary.weeklyCompletionRate}
        icon={Users}
      />

    </div>
  );
};

export default DashboardSummary;