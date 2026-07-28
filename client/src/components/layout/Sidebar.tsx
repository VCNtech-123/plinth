import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo.png";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside
      className="
        fixed bottom-0 left-0 right-0 z-40
        h-16 bg-card border-t border-border
        flex items-center justify-around
        lg:static lg:h-auto lg:w-64 lg:min-h-screen
        lg:flex-col lg:items-stretch lg:justify-start
        lg:border-t-0 lg:border-r
        lg:px-4 lg:py-6
      "
    >
      {/* Desktop Branding */}
      <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
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
      <nav className="flex w-full justify-around lg:justify-start lg:flex-col lg:space-y-1.5">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
        <NavItem to="/clients" icon={Users} label="Clients" />
        <NavItem to="/projects" icon={FolderKanban} label="Projects" />
        <NavItem to="/tasks" icon={CheckSquare} label="Tasks" />
      </nav>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ElementType;
}

const NavItem = ({ to, label, icon: Icon }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `
        flex items-center gap-3
        px-3 py-2.5
        rounded-md
        text-sm font-medium
        transition-all duration-200
        w-full
        justify-center lg:justify-start

        ${
          isActive
            ? "bg-primary/10 text-primary font-semibold" 
            : "text-text/60 hover:bg-text/5 hover:text-text"
        }
        `
      }
    >
      <Icon size={18} className="shrink-0" />
      <span className="hidden lg:inline">
        {label}
      </span>
    </NavLink>
  );
};

export default Sidebar;