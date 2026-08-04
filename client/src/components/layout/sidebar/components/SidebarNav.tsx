// client/src/layouts/sidebar/components/SidebarNav.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

interface SidebarNavProps {
  onClose?: () => void;
}

const SidebarNav = ({ onClose }: SidebarNavProps) => {
  return (
    <nav className="flex flex-col space-y-1.5 px-4 py-6">
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

export default SidebarNav;