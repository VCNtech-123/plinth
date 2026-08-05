// client/src/components/layout/TopBar.tsx
import { Menu, Sun, Moon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
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

  const pageTitle =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname
          .split("/")[1]
          ?.charAt(0)
          .toUpperCase() + location.pathname.split("/")[1]?.slice(1);

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-card border-b border-border sticky top-0 z-30">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-app transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg sm:text-xl font-display font-bold text-text">
          {pageTitle}
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-app transition-colors"
          aria-label="Toggle theme"
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