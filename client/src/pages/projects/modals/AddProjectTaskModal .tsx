// client/src/pages/projects/modals/AddProjectTaskModal.tsx
import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface AddProjectTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onCreate: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    project: string;
  }) => Promise<void>;
}

const AddProjectTaskModal = ({
  open,
  onClose,
  projectId,
  projectName,
  onCreate,
}: AddProjectTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    try {
      setLoading(true);

      await onCreate({
        title,
        description,
        dueDate,
        priority,
        project: projectId,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold">Add Task</h2>
          <p className="text-sm text-text/60 mt-1">
            Project: <span className="font-medium text-text">{projectName}</span>
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-text/60 mb-2 block">
              Task Title *
            </label>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-text/60 mb-2 block">
              Description
            </label>
            <textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-app bg-card p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs font-semibold text-text/60 mb-2 block">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs font-semibold text-text/60 mb-2 block">
              Due Date
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddProjectTaskModal;