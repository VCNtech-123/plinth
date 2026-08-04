// client/src/components/ui/Dropdown.tsx
import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="p-2 rounded-md hover:bg-app transition-colors"
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>

      {/* Menu - with z-50 and fixed positioning for overflow escape */}
      {open && (
        <div
          className={clsx(
            "absolute right-0 top-full mt-2 w-48 rounded-lg border border-app bg-card shadow-xl z-50 animate-fadeIn"
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick();
                  setOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-2 text-sm hover:bg-app transition-colors",
                  item.danger && "text-(--color-danger) hover:opacity-80"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;