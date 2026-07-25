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

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">

      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-md hover:bg-app transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {/* Menu */}
      <div
        className={clsx(
          "absolute right-0 mt-2 w-40 rounded-lg border border-app bg-card shadow-lg transition-all duration-150 origin-top-right",
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="py-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={clsx(
                "w-full text-left px-4 py-2 text-sm hover:bg-app transition-colors",
                item.danger && "text-(--color-danger)"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dropdown;