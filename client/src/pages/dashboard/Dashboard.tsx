import { useEffect, useState } from "react";
import Skeleton from "../../components/ui/Skeleton";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import type { DashboardResponse } from "../../types/dashboard.types";
import { getDashboard } from "../../api/dashboard.api";

import DashboardSummary from "./DashboardSummary";
import DashboardTrends from "./DashboardTrends";
import DashboardRisk from "./DashboardRisk";
import DashboardActivity from "./DashboardActivity";
import { useWorkspaceStore } from "../../store/workspace.store";
import EmptyState from "../../components/ui/EmptyState";

const Dashboard = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const workspaceVersion = useWorkspaceStore((s) => s.version);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDashboard();
        if (!cancelled) setData(res.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, [workspaceVersion]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="space-y-1">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description="Please try refreshing the page."
      />
    );
  }

  // Optional: if you have a meaningful “empty workspace” signal, use it here
  const isWorkspaceEmpty =
    data.summary?.totalProjects === 0 && data.summary?.totalTasks === 0;

  return (
    <div className="space-y-6 animate-fadeIn w-full">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-app">Dashboard</h1>
        <p className="text-sm text-app/60 mt-1">
          Overview of your workspace activity.
        </p>
      </div>

      {isWorkspaceEmpty ? (
        <EmptyState
          title="Nothing here yet"
          description="Create a client, project, or task to see metrics and activity."
        />
      ) : (
        <>
          {/* Summary */}
          <Card>
            <CardHeader className="mb-0">
              <div className="text-sm font-semibold text-app">Summary</div>
            </CardHeader>
            <CardContent>
              <DashboardSummary summary={data.summary} />
            </CardContent>
          </Card>

          {/* Trends */}
          <Card>
            <CardHeader className="mb-0">
              <div className="text-sm font-semibold text-app">Trends</div>
            </CardHeader>
            <CardContent>
              <DashboardTrends trends={data.trends} />
            </CardContent>
          </Card>

          {/* Risk + Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="mb-0">
                <div className="text-sm font-semibold text-app">At risk</div>
              </CardHeader>
              <CardContent>
                <DashboardRisk projects={data.atRiskProjects} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="mb-0">
                <div className="text-sm font-semibold text-app">Recent activity</div>
              </CardHeader>
              <CardContent>
                <DashboardActivity activity={data.recentActivity} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;