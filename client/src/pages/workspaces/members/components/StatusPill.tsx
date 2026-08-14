import clsx from "clsx";

type Status = "active" | "pending" | "declined" | "removed";

const styles: Record<Status, string> = {
  active: "bg-app text-app border border-app",
  pending: "bg-app text-app border border-app",
  declined: "bg-app text-app border border-app",
  removed: "bg-app text-app border border-app",
};

const StatusPill = ({ status }: { status: Status }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        styles[status]
      )}
    >
      {status}
    </span>
  );
};

export default StatusPill;