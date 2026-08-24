import { User, Check } from "lucide-react";
import Button from "../../../components/ui/Button";
import type { Task } from "../../../types/task.types";

type MemberOption = {
  id: string;
  name: string;
  email: string;
};

interface AssigneeSectionProps {
  task: Task | null;
  onAssign: (assigneeId: string | null) => Promise<void>;
  currentUserId: string;
  members: MemberOption[];
  canAssign: boolean;
  loading?: boolean;
}

const AssigneeSection = ({
  task,
  onAssign,
  currentUserId,
  members,
  canAssign,
  loading = false,
}: AssigneeSectionProps) => {
  if (!task) return null;

  const hasAssignee = Boolean(task.assignee?.id);
  const isAssignedToMe = task.assignee?.id === currentUserId;

  const selectedValue = task.assignee?.id ?? "";

  return (
    <div className="py-4 space-y-3 border-b border-app">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-app">Assignee</p>
      </div>

      {hasAssignee ? (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-app/50 border border-app">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {task.assignee!.name[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-app truncate">
              {task.assignee!.name}
            </p>
            <p className="text-xs text-app/60 truncate">
              {task.assignee!.email}
            </p>
          </div>

          {isAssignedToMe && <Check size={16} className="text-success shrink-0" />}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-app/50 border border-app border-dashed">
          <p className="text-sm text-app/60 flex items-center gap-2">
            <User size={16} />
            Unassigned
          </p>
        </div>
      )}

      {canAssign ? (
        <div className="space-y-2">
          <label className="text-xs font-medium text-app/60">Assign to</label>

          <select
            value={selectedValue}
            onChange={(e) => onAssign(e.target.value || null)}
            disabled={loading}
            className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm text-app focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAssign(currentUserId)}
              disabled={loading || isAssignedToMe}
              className="w-full"
            >
              Assign to me
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAssign(null)}
              disabled={loading || !hasAssignee}
              className="w-full"
            >
              Unassign
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-app/60">
          You don't have permission to change assignees.
        </div>
      )}
    </div>
  );
};

export default AssigneeSection;