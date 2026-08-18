import { Building2, FolderKanban, CheckSquare, AlertTriangle, Percent, DollarSign } from "lucide-react";
import StatCard from "../../../components/ui/StatCard";
import type { ClientStats } from "../../../types/client.types";

interface ClientStatsProps {
  stats: ClientStats;
  avgBudget: number;
}

const ClientDetailsStatistics = ({ stats, avgBudget }: ClientStatsProps) => {
  const completionRate = stats.totalTasks
    ? Math.round(((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100)
    : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 animate-slideUp">
      <StatCard
        title="Projects"
        value={stats.totalProjects}
        icon={Building2}
        accent="primary"
      />

      <StatCard
        title="Active"
        value={stats.activeProjects}
        icon={FolderKanban}
        accent="success"
      />

      <StatCard
        title="Tasks"
        value={stats.totalTasks}
        icon={CheckSquare}
        accent="primary"
      />

      <StatCard
        title="Overdue"
        value={stats.overdueTasks}
        icon={AlertTriangle}
        accent="danger"
      />

      <StatCard
        title="Completion"
        value={`${completionRate}%`}
        icon={Percent}
        accent={completionRate >= 80 ? "success" : "warning"}
      />

      <StatCard
        title="Avg budget"
        value={formatCurrency(avgBudget)}
        icon={DollarSign}
        accent="primary"
      />
    </div>
  );
};

export default ClientDetailsStatistics;