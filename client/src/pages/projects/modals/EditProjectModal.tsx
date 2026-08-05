import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: any | null;
  onUpdate: (id: string, data: any) => Promise<void>;
}

const EditProjectModal = ({
  open,
  onClose,
  project,
  onUpdate,
}: EditProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
      setDeadline(project.deadline?.slice(0, 10) || "");
      setBudget(project.budget?.toString() || "");
      setStatus(project.status);
    }
  }, [project]);

  const handleSubmit = async () => {
    if (!project) return;

    try {
      setLoading(true);

      await onUpdate(project.id, {
        name,
        description,
        deadline,
        budget: budget ? Number(budget) : undefined,
        status,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">

        <h2 className="text-lg font-semibold">
          Edit Project
        </h2>

        <div className="space-y-4">

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-app bg-card p-3 text-sm"
          />

          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default EditProjectModal;