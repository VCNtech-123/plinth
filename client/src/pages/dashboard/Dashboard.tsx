import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getDashboard } from "../../api/dashboard.api";
import { useState, useEffect } from "react";
import { CardContent, CardHeader } from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { Users, FolderKanban, CheckSquare, AlertTriangle } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import type { DashboardStats } from "../../types/dashboard.types";

const Dashboard = () => {
  
  const [ stats, setStats ] = useState<DashboardStats | null>(null);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboard();
        console.log(response.data)
        setStats(response.data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard page")
      } finally {
        setLoading(false)
      }
    };

    fetchDashboardData();
    console.log(stats)
  }, []);

  return (
  <div className="space-y-10">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-semibold text-app">
        Dashboard Overview
      </h1>
      <p className="text-sm opacity-70 mt-1">
        Summary of your workspace activity.
      </p>
    </div>

    {loading && (
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}

      </div>
    )}

    {/* Error */}
    {error && (
      <Card variant="outline">
        <p className="text-(--color-danger) text-sm">
          {error}
        </p>
      </Card>
    )}

    {/* Stats */}
    {!loading && !error && (
      <>
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <StatCard
            title="Clients"
            value={stats?.totalClients ?? 0}
            icon={Users}
            accent="primary"
          />

          <StatCard
            title="Projects"
            value={stats?.totalProjects ?? 0}
            icon={FolderKanban}
            accent="success"
          />

          <StatCard
            title="Tasks"
            value={stats?.totalTasks ?? 0}
            icon={CheckSquare}
            accent="primary"
          />

          <StatCard
            title="Overdue"
            value={stats?.overdueTasks ?? 0}
            icon={AlertTriangle}
            accent="danger"
          />

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Active Projects */}
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Active Projects
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-app pb-2">
                <span>Website Redesign</span>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="flex justify-between items-center border-b border-app pb-2">
                <span>Mobile App</span>
                <Badge variant="warning">Paused</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card variant="elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                Recent Tasks
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-app pb-2">
                <span>Design Landing Page</span>
                <Badge>Todo</Badge>
              </div>

              <div className="flex justify-between items-center border-b border-app pb-2">
                <span>API Integration</span>
                <Badge variant="success">Done</Badge>
              </div>
            </CardContent>
          </Card>

        </div>
      </>
    )}
  </div>
);
};

export default Dashboard;