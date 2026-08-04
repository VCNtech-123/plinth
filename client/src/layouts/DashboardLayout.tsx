import { useState } from "react";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/TopBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const DashboardLayout = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-full bg-app text-app transition-colors">

      <div className="flex">

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-h-screen">

          {/* Topbar */}
          <Topbar
            onToggleSidebar={() =>
              setIsSidebarOpen((prev) => !prev)
            }
          />

          <main className="p-6">
            <Toaster position="top-right" richColors />
            <Outlet />
          </main>

        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;