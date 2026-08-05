import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

interface DeleteProjectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectName?: string;
  loading?: boolean;
}

const DeleteProjectModal = ({
  open,
  onClose,
  onConfirm,
  projectName,
  loading,
}: DeleteProjectModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-6">

        <div>
          <h2 className="text-lg font-semibold text-(--color-danger)">
            Delete Project
          </h2>

          <p className="text-sm opacity-70 mt-2">
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {projectName}
            </span>
            ? This action cannot be undone.
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

export default DeleteProjectModal;