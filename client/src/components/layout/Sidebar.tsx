import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
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
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static
          md:flex md:flex-col md:min-h-screen
          md:px-4 md:py-6
        `}
      >
        {/* Desktop Branding */}
        <div className="hidden md:flex items-center gap-3 mb-8 px-2">
          <img
            src={Logo}
            alt="WorkPilot Logo"
            className="w-8 h-8 object-contain"
          />
          <h2 className="text-lg font-bold tracking-wide text-text">
            WorkPilot
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1.5 px-2">

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

export default Sidebar;