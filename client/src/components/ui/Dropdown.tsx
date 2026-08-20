import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import clsx from "clsx";

interface DropdownItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode; // ✅ custom trigger
  align?: "left" | "right";
  widthClassName?: string; // optional, default w-48
}

const Dropdown = ({
  items,
  trigger,
  align = "right",
  widthClassName = "w-56",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const menuWidth = 224; // matches w-56-ish; we keep it simple
      const left =
        align === "right" ? rect.right - menuWidth : rect.left;

      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, left), 
      });
    }

    setOpen((prev) => !prev);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    item.onClick();
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        type="button"
        className="p-2 rounded-md hover:bg-app transition-colors text-app"
        aria-label="More options"
      >
        {trigger ?? <MoreHorizontal size={18} className="text-app/70" />}
      </button>

      {/* Portal Menu */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className={clsx(
              "fixed rounded-lg border border-app bg-card shadow-xl z-50 animate-fadeIn text-app",
              widthClassName
            )}
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    item.danger
                      ? "text-danger hover:bg-app"
                      : "text-app hover:bg-app"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Dropdown;