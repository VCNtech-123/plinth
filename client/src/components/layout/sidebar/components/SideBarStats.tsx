import { Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboard } from "../../../../api/dashboard.api";

interface DasboardSidebarSummary {
  tasksDueToday: number,
  overdueTasks: number
}

const SidebarStats = () => {

  const [ data, setData ] = useState<DasboardSidebarSummary | null>(null)

  useEffect(() => {
    const getStatsData = async () => {
      try {
        const response = await getDashboard();
        setData(response.data.summary)
      } catch (error) {
        console.log(error)
      }
    }

    getStatsData()
  }, [])

  return (
    <div className="px-4 py-4 space-y-2">
      <StatItem
        icon={Clock}
        label="Due today"
        value={data?.tasksDueToday ?? 0}
        color="primary"
      />

      <StatItem
        icon={AlertCircle}
        label="Overdue"
        value={data?.overdueTasks ?? 0}
        color="danger"
      />
    </div>
  );
};

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "primary" | "success" | "danger" | "warning";
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => {
  const colorClasses = {
    primary: "text-primary",
    success: "text-(--color-success)",
    danger: "text-(--color-danger)",
    warning: "text-(--color-warning)",
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-app/50">
      <div className="flex items-center gap-2">
        <Icon size={14} className={colorClasses[color]} />
        <p className="text-xs text-text/60">{label}</p>
      </div>
      <p className="text-sm font-semibold text-text">{value}</p>
    </div>
  );
};

export default SidebarStats;