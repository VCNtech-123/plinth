import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

interface EditClientModalProps {
  open: boolean;
  onClose: () => void;
  client: {
    id: string;
    name: string;
    email: string;
  } | null;
  onUpdate: (id: string, data: { name: string; email: string }) => Promise<void>;
}

const EditClientModal = ({
  open,
  onClose,
  client,
  onUpdate,
}: EditClientModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
    }
  }, [client]);

  const handleSubmit = async () => {
    if (!client) return;

    try {
      setLoading(true);
      await onUpdate(client.id, { name, email });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6 animate-fadeIn">

        <div>
          <h2 className="text-lg font-semibold">
            Edit Client
          </h2>
        </div>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
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
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default EditClientModal;