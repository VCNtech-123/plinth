import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  trends: {
    tasksCompletedLast7Days: number[];
    tasksCreatedLast7Days: number[];
  };
}

const getDayLabel = (index: number) => {

  return `D${index + 1}`;
};

const DashboardTrends = ({ trends }: Props) => {
  const completedData = trends.tasksCompletedLast7Days.map((value, index) => ({
    day: getDayLabel(index),
    value,
  }));

  const createdData = trends.tasksCreatedLast7Days.map((value, index) => ({
    day: getDayLabel(index),
    value,
  }));

  const primary = "var(--color-primary)";
  const success = "var(--color-success)";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="rounded-xl border border-app bg-card p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-app">Tasks completed</div>
          <div className="text-xs text-app/60">Last 7 days</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completedData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
              <XAxis dataKey="day" tick={{ fill: "var(--color-text)", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--color-text)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  color: "var(--color-text)",
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dataKey="value" stroke={primary} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-app bg-card p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-app">Tasks created</div>
          <div className="text-xs text-app/60">Last 7 days</div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={createdData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.08} />
              <XAxis dataKey="day" tick={{ fill: "var(--color-text)", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "var(--color-text)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                  color: "var(--color-text)",
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dataKey="value" stroke={success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardTrends;