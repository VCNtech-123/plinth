import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description?: string;
    deadline?: string;
    budget?: number;
    client: string;
  }) => Promise<void>;
  clients: { id: string; name: string }[];
}

const AddProjectModal = ({
  open,
  onClose,
  onCreate,
  clients,
}: AddProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !client) return;

    try {
      setLoading(true);

      await onCreate({
        name,
        description,
        deadline,
        budget: budget ? Number(budget) : undefined,
        client,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">

        <div>
          <h2 className="text-lg font-semibold">
            Create Project
          </h2>
        </div>

        <div className="space-y-4">

          <Input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
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
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            disabled={!name || !client || loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default AddProjectModal;