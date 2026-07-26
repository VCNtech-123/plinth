import TaskCard from "./TaskCard";
import type { Task } from "../../types/task.types";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: Task["status"]) => void;
}

const TaskColumn = ({
  title,
  tasks,
  onEdit,
  onDelete,
  onMove,
}: TaskColumnProps) => {
  return (
    <div className="flex flex-col bg-card border border-app rounded-xl">

      {/* Column Header */}
      <div className="px-4 py-3 border-b border-app flex justify-between items-center">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
          {title}
        </h2>

        <span className="text-xs opacity-50">
          {tasks.length}
        </span>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-xs opacity-50">
            No tasks
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              projectName={task.project.name}
              overdue={
                !!task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "done"
              }
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onMove={(status) => onMove(task.id, status)}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default TaskColumn;