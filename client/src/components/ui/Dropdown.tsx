// client/src/components/ui/Dropdown.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import clsx from "clsx";

interface DropdownItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
}

const Dropdown = ({ items }: DropdownProps) => {
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.right - 192,
      });
    }

    setOpen((prev) => !prev);
  };

  const handleItemClick = (callback: () => void) => {
    callback();
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-2 rounded-md hover:bg-app transition-colors"
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>

      {/* Portal Menu */}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed w-48 rounded-lg border border-app bg-card shadow-xl z-50 animate-fadeIn text-app"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.onClick)}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    item.danger
                      ? "text-(--color-danger) hover:opacity-80"
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