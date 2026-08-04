// client/src/layouts/sidebar/Sidebar.tsx
import Logo from "../../assets/logo.png";
import SidebarNav from "./components/SidebarNav";
import SidebarStats from "./components/SideBarStats";
import SidebarProfile from "./components/SidebarProfile";

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
          min-h-screen w-64
          bg-card border-r border-border
          transform transition-transform duration-300 ease-out
          flex flex-col
          overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          md:static
        `}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 px-4 py-6 border-b border-border shrink-0">
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
        <div className="border-b border-border shrink-0">
          <SidebarNav onClose={onClose} />
        </div>

        {/* Stats */}
        <div className="border-b border-border shrink-0">
          <SidebarStats />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile */}
        <div className="shrink-0">
          <SidebarProfile />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;