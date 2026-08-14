import Button from "../../../../components/ui/Button";
import RolePill from "./RolePill";
import StatusPill from "./StatusPill";
import type { WorkspaceMemberRow } from "../../../../types/workspace.types";

export const MemberRow = ({
  member,
  canRemove,
  onRemove,
}: {
  member: WorkspaceMemberRow;
  canRemove: boolean;
  onRemove: (membershipId: string) => void;
}) => {
  const removable = canRemove && member.role !== "owner" && member.status === "active";

  const initials = (member.user.name?.[0] || member.user.email?.[0] || "?").toUpperCase();

  return (
    <div className="px-6 py-3.5 grid grid-cols-12 gap-4 items-center hover:bg-app transition-colors border-t border-app">
      <div className="col-span-5 min-w-0 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-semibold text-primary">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-app truncate">{member.user.name}</div>
          <div className="text-xs text-app/60 truncate">{member.user.email}</div>
        </div>
      </div>

      <div className="col-span-2">
        <RolePill role={member.role} />
      </div>

      <div className="col-span-3">
        <StatusPill status={member.status} />
      </div>

      <div className="col-span-2 flex justify-end">
        {removable ? (
          <Button variant="danger" size="sm" onClick={() => onRemove(member.id)}>
            Remove
          </Button>
        ) : (
          <span className="text-xs text-app/30">—</span>
        )}
      </div>
    </div>
  );
};