// client/src/layouts/DashboardLayout.tsx
import { useState } from "react";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/TopBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-app text-app overflow-hidden">
      {/* Sidebar - Fixed */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-6 py-8">
            <Toaster position="top-right" richColors />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;