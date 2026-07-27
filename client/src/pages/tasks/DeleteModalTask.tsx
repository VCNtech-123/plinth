import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

interface DeleteTaskModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  taskTitle?: string;
  loading?: boolean;
}

const DeleteTaskModal = ({
  open,
  onClose,
  onConfirm,
  taskTitle,
  loading,
}: DeleteTaskModalProps) => {
  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">

        <div>
          <h2 className="text-lg font-semibold text-(--color-danger)">
            Delete Task
          </h2>

          <p className="text-sm opacity-70 mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium">{taskTitle}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default DeleteTaskModal;