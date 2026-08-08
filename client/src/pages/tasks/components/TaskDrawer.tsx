
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import { getTaskById, updateTask } from "../../../api/task.api";
import { useAuthStore } from "../../../store/auth.store";
import AssigneeSection from "./AssigneeSection";
import CommentSection from "./CommentSection";
import type { Task } from "../../../types/task.types";

interface TaskDrawerProps {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskDrawer = ({ taskId, open, onClose, onUpdate }: TaskDrawerProps) => {
  const user = useAuthStore((state) => state.user);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

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

  const handleAssign = async (assigneeId: string | null) => {
    if (!task) return;

    try {
      setAssignLoading(true);
      const updated = await updateTask(task.id, {
        assignee: assigneeId,
      });
      
      setTask(updated.data);
      onUpdate(updated.data);
    } finally {
      setAssignLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative ml-auto h-full w-full sm:w-120 bg-card border-l border-app shadow-2xl overflow-hidden flex flex-col">
        {loading || !task ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-text/60">Loading...</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b border-app flex justify-between items-center shrink-0">
              <h2 className="text-lg font-semibold truncate">{task.title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-app transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-text/60 mb-2 block">
                  Title
                </label>
                <Input
                  value={task.title}
                  onChange={(e) =>
                    setTask({ ...task, title: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-text/60 mb-2 block">
                  Description
                </label>
                <textarea
                  value={task.description || ""}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-app bg-card p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  rows={3}
                />
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text/60 mb-2 block">
                    Status
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      setTask({
                        ...task,
                        status: e.target.value as Task["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text/60 mb-2 block">
                    Priority
                  </label>
                  <select
                    value={task.priority || ""}
                    onChange={(e) =>
                      setTask({
                        ...task,
                        priority: (e.target.value || undefined) as Task["priority"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div>
                  <Badge variant="warning">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </Badge>
                </div>
              )}

              {/* Assignee Section */}
              {user && (
                <AssigneeSection
                  task={task}
                  onAssign={handleAssign}
                  currentUserId={user._id}
                  loading={assignLoading}
                />
              )}
              <CommentSection taskId={task.id} />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-app flex justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>

              <Button
                onClick={async () => {
                  const updated = await updateTask(task.id, {
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate,
                  });
                  onUpdate(updated);
                  onClose();
                }}
              >
                Save Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDrawer;