import clsx from "clsx";
import type { WorkspaceRole } from "../../../../types/workspace.types";

const pillBase =
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border";

const roleStyles: Record<WorkspaceRole, string> = {
  owner: "bg-primary/10 text-primary border-primary/20",
  admin: "bg-primary/10 text-primary border-primary/20",
  member: "bg-card text-app border-app",
  viewer: "bg-card text-app/70 border-app",
};

const RolePill = ({ role }: { role: WorkspaceRole }) => {
  return <span className={clsx(pillBase, roleStyles[role])}>{role}</span>;
};

export default RolePill;