// client/src/pages/clients/components/ClientStats.tsx
import { Building2 } from "lucide-react";
import StatCard from "../../../components/ui/StatCard";
import type { ClientStats } from "../../../types/client.types";

interface ClientStatsProps {
  stats: ClientStats;
  avgBudget: number;
}

const ClientStatistics = ({ stats, avgBudget }: ClientStatsProps) => {
  const completionRate = stats.totalTasks
    ? Math.round(
        ((stats.totalTasks - stats.overdueTasks) / stats.totalTasks) * 100
      )
    : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-slideUp">
      <StatCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={Building2}
        accent="primary"
      />

      <StatCard
        title="Active Projects"
        value={stats.activeProjects}
        accent="success"
      />

      <StatCard
        title="Total Tasks"
        value={stats.totalTasks}
        accent="primary"
      />

      <StatCard
        title="Overdue Tasks"
        value={stats.overdueTasks}
        accent="danger"
      />

      <StatCard
        title="Completion Rate"
        value={`${completionRate}%`}
        accent="success"
      />

      <StatCard
        title="Avg Budget/Project"
        value={formatCurrency(avgBudget)}
        accent="primary"
      />
    </div>
  );
};

export default ClientStatistics;