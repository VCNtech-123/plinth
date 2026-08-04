import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; email: string }) => Promise<void>;
}

const AddClientModal = ({
  open,
  onClose,
  onCreate,
}: AddClientModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email) return;

    try {
      setLoading(true);
      await onCreate({ name, email });

      setName("");
      setEmail("");
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
            Add Client
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Enter client details below.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Client Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!name || !email || loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default AddClientModal;