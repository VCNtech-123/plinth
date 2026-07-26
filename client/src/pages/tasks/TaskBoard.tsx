import TaskColumn from "./TaskColumn";
import type { Task } from "../../types/task.types";

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMove: (taskId: string, status: Task["status"]) => void;
}

const TaskBoard = ({
  tasks,
  onEdit,
  onDelete,
  onMove,
}: TaskBoardProps) => {

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in-progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-160px)]">

      <TaskColumn
        title="Todo"
        tasks={todo}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
      />

      <TaskColumn
        title="In Progress"
        tasks={inProgress}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
      />

      <TaskColumn
        title="Done"
        tasks={done}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={onMove}
      />

    </div>
  );
};

export default TaskBoard;