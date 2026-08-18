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

const AddProjectModal = ({ open, onClose, onCreate, clients }: AddProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName("");
    setDescription("");
    setDeadline("");
    setBudget("");
    setClient("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim() || !client) return;

    try {
      setLoading(true);
      await onCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        budget: budget ? Number(budget) : undefined,
        client,
      });
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const clientError = !client;
  const nameError = !name.trim();

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="w-full max-w-md">
        <div className="pb-4 border-b border-app">
          <div className="text-xs font-medium text-app/60">Projects</div>
          <h2 className="mt-1 text-xl font-semibold text-app">Create project</h2>
          <p className="mt-1 text-sm text-app/60">
            Projects live under a client and help you track tasks and progress.
          </p>
        </div>

        {/* Body */}
        <div className="pt-5 space-y-5">
          {/* Section: Required */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-app">Required</div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-app">Client</label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-app bg-card text-sm text-app focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                <option value="">Select a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {clientError && (
                <p className="text-xs text-app/60">Please select a client.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-app">Project name</label>
              <Input
                placeholder="Website redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {nameError && (
                <p className="text-xs text-app/60">Project name is required.</p>
              )}
            </div>
          </div>

          {/* Section: Details */}
          <div className="pt-4 border-t border-app space-y-3">
            <div className="text-sm font-semibold text-app">Details</div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-app">Description</label>
              <textarea
                placeholder="Optional description…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-app bg-card p-3 text-sm text-app resize-none focus:outline-none focus:ring-1 focus:ring-primary/30"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-app">Deadline</label>
                <Input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-app">Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-app/60">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-app flex items-center justify-between gap-3">
          <div className="text-xs text-app/60">
            Required: client and project name.
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading || !client || !name.trim()}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddProjectModal;