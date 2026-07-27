import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    project: string;
  }) => Promise<void>;
  projects: {
    id: string;
    name: string;
  }[];
}

const AddTaskModal = ({
  open,
  onClose,
  onCreate,
  projects,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [project, setProject] = useState("");
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
      });

      onClose();
      setTitle("");
      setDescription("");
      setPriority("");
      setDueDate("");
      setProject("");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">

        <h2 className="text-lg font-semibold">
          Create Task
        </h2>

        <div className="space-y-4">

          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-app bg-card p-3 text-sm"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm"
          >
            <option value="">No Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!title || !project || loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default AddTaskModal;