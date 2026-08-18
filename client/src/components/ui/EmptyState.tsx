import type { ReactNode } from "react";
import Button from "./Button";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger";
  };
};

const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="w-full rounded-xl border border-app bg-card p-8 text-center">
      {icon && <div className="mx-auto mb-3 w-fit text-app/60">{icon}</div>}
      <h3 className="text-base font-semibold text-app">{title}</h3>
      {description && <p className="mt-1 text-sm text-app/60">{description}</p>}

      {action && (
        <div className="mt-5 flex justify-center">
          <Button
            variant={action.variant ?? "primary"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;