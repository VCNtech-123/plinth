import { useEffect, useState } from "react";
import Skeleton from "../../components/ui/Skeleton";
import type { DashboardResponse } from "../../types/dashboard.types";
import { getDashboard } from "../../api/dashboard.api";

import DashboardSummary from "./DashboardSummary";
import DashboardTrends from "./DashboardTrends";
import DashboardRisk from "./DashboardRisk";
import DashboardActivity from "./DashboardActivity";

const Dashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">

      <DashboardSummary summary={data.summary} />

      <DashboardTrends trends={data.trends} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DashboardRisk projects={data.atRiskProjects} />
        <DashboardActivity activity={data.recentActivity} />
      </div>

    </div>
  );
};

export default Dashboard;