import Badge from "../../components/ui/Badge";
import Dropdown from "../../components/ui/Dropdown";
import Card from "../../components/ui/Card";

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  projectName: string;
  overdue?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (status: "todo" | "in-progress" | "done") => void;
}

const TaskCard = ({
  title,
  description,
  priority,
  dueDate,
  projectName,
  overdue,
  status,
  onEdit,
  onDelete,
  onMove,
}: TaskCardProps) => {
  return (
    <Card
      className={`
        p-4 space-y-3 cursor-pointer transition-all
        ${overdue ? "border-l-4 border-(--color-danger)" : ""}
      `}
      hover
    >
      {/* Header Row */}
      <div className="flex justify-between items-start">

        <div className="space-y-1">
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

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

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs">

        <Badge variant="default">
          {projectName}
        </Badge>

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
              overdue ? "text-(--color-danger)" : "opacity-60"
            }`}
          >
            Due {new Date(dueDate).toLocaleDateString()}
          </span>
        )}

      </div>

    </Card>
  );
};

export default TaskCard;