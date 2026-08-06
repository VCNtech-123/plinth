import { Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "../../../types/task.types";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: Task["status"]) => void;
  isDraggingOver?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onEdit,
  onDelete,
  onMove,
  isDraggingOver,
}: TaskColumnProps) => {
  return (
    <div className="flex flex-col h-full">

      {/* Column Header */}
      <div className="px-4 py-3 border-b border-app flex justify-between items-center shrink-0">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
          {title}
        </h2>

        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          isDraggingOver
            ? "bg-primary/20 text-primary"
            : "bg-app text-text/60"
        }`}>
          {tasks.length}
        </span>
      </div>

      {/* Scrollable Tasks Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-center">
            <p className="text-xs opacity-50">
              No tasks yet
              <br />
              Drag one here or create new
            </p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`transition-all ${
                    snapshot.isDragging
                      ? "shadow-lg scale-105 opacity-100"
                      : ""
                  }`}
                >
                  <TaskCard
                    onOpen={() => onEdit(task)}
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
                    isDragging={snapshot.isDragging}
                  />
                </div>
              )}
            </Draggable>
          ))
        )}
      </div>

    </div>
  );
};

export default TaskColumn;