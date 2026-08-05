// client/src/layouts/sidebar/components/SidebarProfile.tsx
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Settings, ChevronUp } from "lucide-react";
import { useAuthStore } from "../../../../store/auth.store";
import { logout } from "../../../../api/auth.api";
import clsx from "clsx";

const SidebarProfile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.message || "Failed to logout");
    }
  };

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Generate a consistent color based on user ID
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
    "bg-emerald-500",
  ];
  
  const colorIndex = user.id.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div
      ref={menuRef}
      className="px-4 py-4 border-t border-border flex items-center gap-3 relative"
    >
      {/* Avatar */}
      <div
        className={clsx(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
          "text-white font-semibold text-sm",
          avatarColor
        )}
      >
        {initials}
      </div>

  
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">
          {user.name}
        </p>
        <p className="text-xs text-text/60 truncate">
          {user.email}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-2 rounded-md hover:bg-app transition-colors shrink-0"
      >
        <ChevronUp
          size={16}
          className={clsx(
            "transition-transform",
            open ? "rotate-0" : "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-app rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="py-1">
            {/* Settings */}
            <button
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-text hover:bg-app transition-colors flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </button>

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-(--color-danger) hover:bg-app transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarProfile;