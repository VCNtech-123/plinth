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
  const assigneeDisplay = assignee && assignee.name ? assignee : null;

  return (
    <div
      className={`
        p-2 rounded-lg border cursor-grab active:cursor-grabbing
        transition-all
        ${
          isDragging
            ? "bg-primary/10 border-primary shadow-lg scale-105"
            : "bg-app/50 border-app hover:border-primary/30 hover:shadow-md"
        }
      `}
    >
      <Card
        onClick={onOpen}
        className={`
          p-3 space-y-2.5 cursor-pointer transition-all
          ${overdue ? "border-l-4 border-(--color-danger)" : ""}
        `}
        hover
      >
        {/* Title & Actions Row */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-text leading-tight flex-1 min-w-0 wrap-break-word">
            {title}
          </h3>

          <div className="shrink-0">
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
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-text/60 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Assignee Badge */}
        {assigneeDisplay && (
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {assigneeDisplay.name[0].toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-text/70 truncate font-medium">
              {assigneeDisplay.name}
            </span>
          </div>
        )}

        {/* Bottom Metadata */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
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
              {priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢"} {priority}
            </Badge>
          )}

          {dueDate && (
            <span
              className={`text-xs font-medium ${
                overdue
                  ? "text-(--color-danger) font-semibold"
                  : "text-text/60"
              }`}
            >
              {overdue && "⚠️ "}Due {new Date(dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}

          <Badge variant="default">
            {projectName}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;