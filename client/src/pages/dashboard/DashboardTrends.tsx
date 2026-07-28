import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Card from "../../components/ui/Card";
import { CardContent, CardHeader } from "../../components/ui/Card";

interface Props {
  trends: {
    tasksCompletedLast7Days: number[];
    tasksCreatedLast7Days: number[];
  };
}

const DashboardTrends = ({ trends }: Props) => {

  const completedData = trends.tasksCompletedLast7Days.map((value, index) => ({
    day: `Day ${index + 1}`,
    value,
  }));

  const createdData = trends.tasksCreatedLast7Days.map((value, index) => ({
    day: `Day ${index + 1}`,
    value,
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Tasks Completed (7 Days)
          </h3>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={completedData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            Tasks Created (7 Days)
          </h3>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={createdData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardTrends;