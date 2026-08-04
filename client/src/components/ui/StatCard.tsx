import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import Card from "./Card";
import { CardContent } from "./Card";

interface StatCardProps {
  title: string;
  value: number | string;
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
    <Card hover className="group">
      <CardContent className="flex items-start justify-between">

        {/* Left Section */}
        <div className="space-y-2">
          <p className="text-sm opacity-70">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        {/* Optional Icon */}
        {Icon && (
          <div
            className={clsx(
              "p-3 rounded-lg bg-app border border-app transition-transform group-hover:scale-105",
              accentColors[accent]
            )}
          >
            <Icon size={20} />
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default StatCard;