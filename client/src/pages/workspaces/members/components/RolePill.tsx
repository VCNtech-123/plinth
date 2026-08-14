import clsx from "clsx";
import type { WorkspaceRole } from "../../../../types/workspace.types";

const styles: Record<WorkspaceRole, string> = {
  owner: "bg-primary/10 text-primary",
  admin: "bg-primary/10 text-primary",
  member: "bg-app text-app border border-app",
  viewer: "bg-app text-app border border-app",
};

const RolePill = ({ role }: { role: WorkspaceRole }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
        styles[role]
      )}
    >
      {role}
    </span>
  );
};

export default RolePill;