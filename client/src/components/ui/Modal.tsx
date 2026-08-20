import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={clsx(
          "relative z-10 w-full bg-card border border-app shadow-xl",
          "rounded-t-2xl sm:rounded-xl",
          "max-h-[90vh] overflow-y-auto",
          "p-6",
          "animate-slideUp",
          "sm:max-w-md sm:mx-4"
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;