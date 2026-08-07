import { User, Check } from "lucide-react";
import Button from "../../../components/ui/Button";
import type { Task } from "../../../types/task.types";

interface AssigneeSectionProps {
  task: Task | null;
  onAssign: (assigneeId: string | null) => Promise<void>;
  currentUserId: string;
  loading?: boolean;
}

const AssigneeSection = ({
  task,
  onAssign,
  currentUserId,
  loading = false,
}: AssigneeSectionProps) => {
  if (!task) return null;

  // ✅ Normalize assignee state
  const hasAssignee = Boolean(task.assignee?.id);
  const isAssignedToMe = task.assignee?.id === currentUserId;

  return (
    <div className="py-4 space-y-3 border-b border-app">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text">Assigned To</p>
      </div>

      {/* Current Assignee */}
      {hasAssignee ? (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-app/50 border border-app">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {task.assignee!.name[0].toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">
              {task.assignee!.name}
            </p>
            <p className="text-xs text-text/60 truncate">
              {task.assignee!.email}
            </p>
          </div>

          {isAssignedToMe && (
            <Check size={16} className="text-success shrink-0" />
          )}
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-app/50 border border-app border-dashed">
          <p className="text-sm text-text/60 flex items-center gap-2">
            <User size={16} />
            Unassigned
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isAssignedToMe && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAssign(currentUserId)}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Assigning..." : "Assign to Me"}
          </Button>
        )}

        {hasAssignee && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAssign(null)}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Removing..." : "Remove Assignment"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssigneeSection;