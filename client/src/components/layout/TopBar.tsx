import { Menu, Sun, Moon, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useWorkspaceStore } from "../../store/workspace.store";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const location = useLocation();

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const workspaceName = useWorkspaceStore(
    (s) => s.current.workspace?.name ?? "Workspace"
  );

  const toggleTheme = () => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const seg = location.pathname.split("/")[1] || "";
  const pageTitle =
    seg === "" ? "Dashboard" : seg.charAt(0).toUpperCase() + seg.slice(1);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-card border-b border-app sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-app transition-colors"
          aria-label="Toggle sidebar"
          type="button"
        >
          <Menu size={20} className="text-app" />
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-app truncate max-w-[200px] sm:max-w-[320px]">
            {workspaceName}
          </span>

          <ChevronRight size={16} className="text-app/40 shrink-0" />

          <span className="text-sm font-medium text-app/80 truncate">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-app transition-colors"
          aria-label="Toggle theme"
          type="button"
        >
          {isDark ? (
            <Sun size={20} className="text-primary" />
          ) : (
            <Moon size={20} className="text-primary" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Topbar;