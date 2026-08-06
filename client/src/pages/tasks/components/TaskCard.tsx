import Badge from "../../../components/ui/Badge";
import Dropdown from "../../../components/ui/Dropdown";
import Card from "../../../components/ui/Card";
import type { Task } from "../../../types/task.types";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  projectName: string;
  assignee?: Task["assignee"];
  overdue?: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: "todo" | "in-progress" | "done") => void;
  isDragging?: boolean;
}

const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  projectName,
  assignee,
  overdue,
  onOpen,
  onEdit,
  onDelete,
  onMove,
  isDragging,
}: TaskCardProps) => {
  return (
    <div
      className={`
        p-3 rounded-lg border cursor-grab active:cursor-grabbing
        transition-all
        ${
          isDragging
            ? "bg-primary/10 border-primary shadow-lg"
            : "bg-app/50 border-app hover:border-primary/30"
        }
      `}
    >
      <Card
        onClick={onOpen}
        className={`
          p-4 space-y-3 cursor-pointer transition-all
          ${overdue ? "border-l-4 border-(--color-danger)" : ""}
        `}
        hover
      >
        {/* Header Row */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{title}</h3>

            {description && (
              <p className="text-xs opacity-60 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <Dropdown
            items={[
              {
                label: "Move to Todo",
                onClick: () => onMove("todo"),
              },
              {
                label: "Move to In Progress",
                onClick: () => onMove("in-progress"),
              },
              {
                label: "Move to Done",
                onClick: () => onMove("done"),
              },
              {
                label: "Edit",
                onClick: onEdit,
              },
              {
                label: "Delete",
                onClick: onDelete,
                danger: true,
              },
            ]}
          />
        </div>

        {/* Assignee Row - NEW */}
        {assignee && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {assignee.name[0].toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-text/70 truncate">
              {assignee.name}
            </span>
          </div>
        )}

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="default">{projectName}</Badge>

          {priority && (
            <Badge
              variant={
                priority === "high"
                  ? "danger"
                  : priority === "medium"
                    ? "warning"
                    : "default"
              }
            >
              {priority}
            </Badge>
          )}

          {dueDate && (
            <span
              className={`${
                overdue ? "text-(--color-danger) font-semibold" : "opacity-60"
              }`}
            >
              Due {new Date(dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;