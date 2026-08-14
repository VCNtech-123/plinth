
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  UsersRound,
  Mail,
  Settings,
} from "lucide-react";

interface SidebarNavProps {
  onClose?: () => void;
}

const SidebarNav = ({ onClose }: SidebarNavProps) => {
  return (
    <nav className="px-4 py-5">
      <Section title="Main">
        <NavItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={onClose} />
        <NavItem to="/clients" icon={Users} label="Clients" onClick={onClose} />
        <NavItem to="/projects" icon={FolderKanban} label="Projects" onClick={onClose} />
        <NavItem to="/tasks" icon={CheckSquare} label="Tasks" onClick={onClose} />
      </Section>

      <div className="my-4 border-t border-app" />

      <Section title="Workspace">
        <NavItem to="/workspace/members" icon={UsersRound} label="Members" onClick={onClose} />
        <NavItem to="/workspace/invites" icon={Mail} label="Invites" onClick={onClose} />
        <NavItem to="/workspace" icon={Settings} label="Settings" onClick={onClose} />
      </Section>
    </nav>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div>
      <div className="px-2 mb-2 text-xs font-medium text-app/60">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
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
        [
          "flex items-center gap-3",
          "px-3 py-2.5 rounded-md",
          "text-sm font-medium",
          "transition-colors duration-150",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-app/70 hover:bg-app hover:text-app",
        ].join(" ")
      }
    >
      <Icon size={18} className="shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

export default SidebarNav;