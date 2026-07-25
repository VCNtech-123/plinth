import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

interface DeleteClientModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteClientModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteClientModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6 animate-fadeIn">

        <div>
          <h2 className="text-lg font-semibold">
            Delete Client
          </h2>
          <p className="text-sm opacity-70 mt-2">
            This action will archive the client.
            You can restore it later.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default DeleteClientModal;