import { useEffect, useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import { getTaskById, updateTask } from "../../../api/task.api";

interface TaskDrawerProps {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: any) => void;
}

const TaskDrawer = ({ taskId, open, onClose, onUpdate }: TaskDrawerProps) => {
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        const result = await getTaskById(taskId);
        setTask(result);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
            relative ml-auto
            h-full
            w-full sm:w-120
            bg-card
            border-l border-app
            shadow-2xl
            transition-transform duration-300 ease-out
        "
        >
        {loading || !task ? (
          <div className="p-6">Loading...</div>
        ) : (
          <div className="flex flex-col h-full">

            {/* Header */}
            <div className="p-6 border-b border-app flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {task.title}
              </h2>

              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              <div>
                <label className="text-xs opacity-60">Title</label>
                <Input
                  value={task.title}
                  onChange={(e) =>
                    setTask({ ...task, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs opacity-60">Description</label>
                <textarea
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-app bg-card p-3 text-sm"
                />
              </div>

              <div className="flex gap-4 flex-wrap">

                <div>
                  <label className="text-xs opacity-60">Status</label>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      setTask({ ...task, status: e.target.value })
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-app bg-card text-sm"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs opacity-60">Priority</label>
                  <select
                    value={task.priority || ""}
                    onChange={(e) =>
                      setTask({ ...task, priority: e.target.value })
                    }
                    className="mt-1 px-3 py-2 rounded-lg border border-app bg-card text-sm"
                  >
                    <option value="">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

              </div>

              {task.dueDate && (
                <div>
                  <Badge variant="warning">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </Badge>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-app flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>

              <Button
                onClick={async () => {
                    const updated = await updateTask(task.id,  {
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate,});
                    onUpdate(updated.data);
                    onClose();
                }}
              >
                Save Changes
              </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDrawer;