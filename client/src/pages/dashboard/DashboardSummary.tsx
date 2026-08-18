import { FolderKanban, CheckSquare, AlertTriangle, CalendarClock } from "lucide-react";
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
  const weeklyRate =
    typeof summary.weeklyCompletionRate === "number"
      ? `${summary.weeklyCompletionRate}%`
      : summary.weeklyCompletionRate;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      <StatCard
        title="Active projects"
        value={summary.activeProjects}
        icon={FolderKanban}
        accent="success"
      />

      <StatCard
        title="Overdue tasks"
        value={summary.overdueTasks}
        icon={AlertTriangle}
        accent={summary.overdueTasks > 0 ? "danger" : "success"}
      />

      <StatCard
        title="Weekly completion"
        value={weeklyRate as any}
        icon={CheckSquare}
      />

      <StatCard
        title="Due today"
        value={summary.tasksDueToday}
        icon={CalendarClock}
        accent={summary.tasksDueToday > 0 ? "warning" : "success"}
      />
    </div>
  );
};

export default DashboardSummary;