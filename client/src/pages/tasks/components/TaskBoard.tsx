
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd"
import TaskColumn from "./TaskColumn";
import type { Task } from "../../../types/task.types";

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

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Get the status from droppable ID
    const status = destination.droppableId as Task["status"];
    
    // Move the task
    onMove(draggableId, status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-160px)]">

        {/* Todo Column */}
        <Droppable droppableId="todo">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`rounded-xl transition-colors ${
                snapshot.isDraggingOver
                  ? "bg-primary/5 border-2 border-primary"
                  : "bg-card border border-app"
              }`}
            >
              <TaskColumn
                title="Todo"
                tasks={todo}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                isDraggingOver={snapshot.isDraggingOver}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* In Progress Column */}
        <Droppable droppableId="in-progress">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`rounded-xl transition-colors ${
                snapshot.isDraggingOver
                  ? "bg-primary/5 border-2 border-primary"
                  : "bg-card border border-app"
              }`}
            >
              <TaskColumn
                title="In Progress"
                tasks={inProgress}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                isDraggingOver={snapshot.isDraggingOver}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Done Column */}
        <Droppable droppableId="done">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`rounded-xl transition-colors ${
                snapshot.isDraggingOver
                  ? "bg-primary/5 border-2 border-primary"
                  : "bg-card border border-app"
              }`}
            >
              <TaskColumn
                title="Done"
                tasks={done}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                isDraggingOver={snapshot.isDraggingOver}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

      </div>
    </DragDropContext>
  );
};

export default TaskBoard;