import type { LucideIcon } from "lucide-react";
import Card from "./Card";
import { CardContent } from "./Card";

interface StatCardProps {
  title: string;
  value: number;
  icon?: LucideIcon;
  accent?: "primary" | "success" | "danger" | "warning";
}

const accentColors = {
  primary: "text-primary",
  success: "text-(--color-success)",
  danger: "text-(--color-danger)",
  warning: "text-(--color-warning)",
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent = "primary",
}: StatCardProps) => {
  return (
    <Card hover className="cursor-pointer group">
      <CardContent className="flex items-start justify-between">

        <div className="space-y-2">
          <p className="text-sm opacity-70">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        {Icon && (
          <div className="p-3 rounded-lg bg-app border border-app">
            <Icon size={20} />
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default StatCard;