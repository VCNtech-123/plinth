import {
  Menu,
  Sun,
  Moon,
  LogOut,
  Settings
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/auth.store";
import { logout } from "../../api/auth.api";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

interface TopbarProps {
  user?: {
    name: string;
    email: string;
  };
  onToggleSidebar?: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout()
      clearUser();
      navigate("/login")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const pageTitle =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
        location.pathname.split("/")[1]?.slice(1);

  const userInitial =
    user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-card border-b border-app">

      {/* Left Section */}
      <div className="flex items-center gap-4">

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-app transition"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base sm:text-lg font-semibold tracking-tight">
          {pageTitle}
        </h1>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-app transition"
        >
          <Sun size={18} className="hidden dark:block" />
          <Moon size={18} className="block dark:hidden" />
        </button>

        {/* Avatar */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-primary/90 text-white flex items-center justify-center text-sm font-semibold hover:opacity-90 transition"
        >
          {userInitial}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-52 bg-card border border-app rounded-xl shadow-xl py-2 animate-fadeIn">

            <div className="px-4 py-3 border-b border-app">
              <p className="text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="text-xs opacity-60">
                {user?.email}
              </p>
            </div>

            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-app transition flex items-center gap-2"
            >
              <Settings size={16} />
              Settings
            </button>

            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-app transition flex items-center gap-2 text-(--color-danger)"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>

          </div>
        )}

      </div>
    </header>
  );
};

export default Topbar;