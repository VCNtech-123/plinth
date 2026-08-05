
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

      // Reset form
      setName("");
      setDescription("");
      setDeadline("");
      setBudget("");
      setClient("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setName("");
    setDescription("");
    setDeadline("");
    setBudget("");
    setClient("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="space-y-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text">
              Create New Project
            </h2>
            <p className="text-sm text-text/60 mt-1">
              Add a new project to get started
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Client Selection (Required) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">
              Client *
            </label>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-app bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {!client && (
              <p className="text-xs text-text/50">Required field</p>
            )}
          </div>

          {/* Project Name (Required) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">
              Project Name *
            </label>
            <Input
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {!name && (
              <p className="text-xs text-text/50">Required field</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text">
              Description
            </label>
            <textarea
              placeholder="Brief description of the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-app bg-card p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              rows={3}
            />
            <p className="text-xs text-text/50">Optional</p>
          </div>

          {/* Deadline & Budget Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">
                Deadline
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <p className="text-xs text-text/50">Optional</p>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text">
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-sm text-text/60">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-text/50">Optional</p>
            </div>
          </div>
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
            disabled={!name || !client || loading}
            className="flex-1"
          >
            {loading ? "Creating..." : "Create Project"}
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

export default AddProjectModal;