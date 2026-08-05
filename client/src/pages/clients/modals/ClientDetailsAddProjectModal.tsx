// client/src/pages/clients/ClientDetails/modals/ClientDetailsAddProjectModal.tsx
import { useState } from "react";
import Modal from "../../../components/ui/Modal"
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Calendar, DollarSign, FileText } from "lucide-react";

interface ClientDetailsAddProjectModalProps {
  open: boolean;
  onClose: () => void;
  clientName: string;
  onCreate: (data: {
    name: string;
    description?: string;
    deadline?: string;
    budget?: number;
    client: string;
  }) => Promise<void>;
  clientId: string;
}

const ClientDetailsAddProjectModal = ({
  open,
  onClose,
  clientName,
  onCreate,
  clientId,
}: ClientDetailsAddProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      await onCreate({
        name,
        description,
        deadline,
        budget: budget ? Number(budget) : undefined,
        client: clientId,
      });

      // Reset form
      setName("");
      setDescription("");
      setDeadline("");
      setBudget("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setDeadline("");
    setBudget("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="space-y-6 w-full max-w-md">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-text">
            Create New Project
          </h2>
          <p className="text-sm text-text/60 mt-2">
            For <span className="font-semibold text-text">{clientName}</span>
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Project Name (Required) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              Project Name <span className="text-(--color-danger)">*</span>
            </label>
            <Input
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {!name.trim() && (
              <p className="text-xs text-text/50">Required field</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text flex items-center gap-2">
              <FileText size={16} />
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
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <Calendar size={16} />
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
              <label className="text-sm font-semibold text-text flex items-center gap-2">
                <DollarSign size={16} />
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
            disabled={!name.trim() || loading}
            className="flex-1"
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientDetailsAddProjectModal;