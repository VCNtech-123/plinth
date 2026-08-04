// client/src/layouts/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  LogOut,
  Settings,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { logout } from "../../../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import Button from "../../ui/Button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40
          min-h-full w-64
          bg-card border-r border-border
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static
          md:min-h-screen
        `}
      >
        {/* Desktop Branding */}
        <div className="hidden md:flex items-center gap-3 px-4 py-6 border-b border-border">
          <img
            src={Logo}
            alt="Plinth Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-lg font-bold tracking-wide text-text">
            Plinth
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1.5 px-4 py-6 border-b border-border">
          <NavItem
            to="/"
            icon={LayoutDashboard}
            label="Dashboard"
            onClick={onClose}
          />

          <NavItem
            to="/clients"
            icon={Users}
            label="Clients"
            onClick={onClose}
          />

          <NavItem
            to="/projects"
            icon={FolderKanban}
            label="Projects"
            onClick={onClose}
          />

          <NavItem
            to="/tasks"
            icon={CheckSquare}
            label="Tasks"
            onClick={onClose}
          />
        </nav>

        {/* Quick Stats - Placeholder for now */}
        <div className="px-4 py-6 border-b border-border space-y-3">
          <p className="text-xs font-semibold text-text/60 uppercase tracking-wide">
            Quick Stats
          </p>

          <StatItem
            icon={Clock}
            label="Tasks Today"
            value={0}
            color="primary"
          />

          <StatItem
            icon={AlertCircle}
            label="Overdue"
            value={0}
            color="danger"
          />

          <StatItem
            icon={Zap}
            label="Active Projects"
            value={0}
            color="success"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Profile */}
        <div className="px-4 py-6 border-t border-border space-y-4">
          {user ? (
            <>
              {/* User Info */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text truncate">
                  {user.name}
                </p>
                <p className="text-xs text-text/60 truncate">
                  {user.email}
                </p>
              </div>

              {/* User Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    navigate("/settings");
                    onClose?.();
                  }}
                >
                  <Settings size={16} />
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const NavItem = ({ to, label, icon: Icon, onClick }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2.5
        rounded-md
        text-sm font-medium
        transition-all duration-200
        w-full

        ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-text/60 hover:bg-text/5 hover:text-text"
        }
        `
      }
    >
      <Icon size={18} className="shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: "primary" | "success" | "danger" | "warning";
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => {
  const colorClasses = {
    primary: "text-primary",
    success: "text-(--color-success)",
    danger: "text-(--color-danger)",
    warning: "text-(--color-warning)",
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-app">
      <Icon size={16} className={colorClasses[color]} />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text/60">{label}</p>
        <p className="text-sm font-semibold text-text">{value}</p>
      </div>
    </div>
  );
};

export default Sidebar;