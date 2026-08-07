import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useAuthStore } from "../../../store/auth.store";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    project: string;
    assignee?: string;
  }) => Promise<void>;
  projects: {
    id: string;
    name: string;
  }[];
  defaultProjectId?: string;
}

const AddTaskModal = ({
  open,
  onClose,
  onCreate,
  projects,
  defaultProjectId,
}: AddTaskModalProps) => {
  const user = useAuthStore((state) => state.user);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState(defaultProjectId || "");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !project) return;

    try {
      setLoading(true);
      await onCreate({
        title,
        description,
        priority,
        dueDate,
        project,
        assignee: assignee || undefined,
      });

      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("");
      setDueDate("");
      setProject(defaultProjectId || "");
      setAssignee("");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("");
    setDueDate("");
    setProject(defaultProjectId || "");
    setAssignee("");
    onClose();
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="space-y-6 w-full max-w-md">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-text">Create Task</h2>
          <p className="text-sm text-text/60 mt-1">
            Add a new task to your project
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title - Required */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              Task Title <span className="text-(--color-danger)">*</span>
            </label>
            <Input
              placeholder="e.g. Design landing page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {!title && (
              <p className="text-xs text-text/50">Required field</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">
              Description
            </label>
            <textarea
              placeholder="Add details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-app bg-card p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              rows={3}
            />
            <p className="text-xs text-text/50">Optional</p>
          </div>

          {/* Priority & Due Date Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-xs text-text/50">Optional</p>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <p className="text-xs text-text/50">Optional</p>
            </div>
          </div>

          {/* Project - Required */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              Project <span className="text-(--color-danger)">*</span>
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {!project && (
              <p className="text-xs text-text/50">Required field</p>
            )}
          </div>

          {/* Assignee - NEW */}
          {user && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">
                Assign To
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Unassigned</option>
                <option value={user._id}>Me ({user.name})</option>
              </select>
              <p className="text-xs text-text/50">Optional</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-app">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title || !project || loading}
            className="flex-1"
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>

        {/* Helper Text */}
        <p className="text-xs text-text/50 text-center">
          Fields marked with * are required
        </p>
      </div>
    </Modal>
  );
};

export default AddTaskModal;