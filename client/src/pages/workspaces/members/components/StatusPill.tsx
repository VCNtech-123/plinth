import clsx from "clsx";

export type MemberStatus = "active" | "pending" | "declined" | "removed";

const pillBase =
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border";

const statusStyles: Record<MemberStatus, string> = {
  active:
    "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] border-[color:var(--color-success)]/20",
  pending:
    "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)] border-[color:var(--color-warning)]/20",
  declined:
    "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/20",
  removed:
    "bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)] border-[color:var(--color-danger)]/20",
};

const StatusPill = ({ status }: { status: MemberStatus }) => {
  return <span className={clsx(pillBase, statusStyles[status])}>{status}</span>;
};

export default StatusPill;