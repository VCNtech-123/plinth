// client/src/layouts/sidebar/components/SidebarProfile.tsx
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Settings } from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import { logout } from "../../../api/auth.api";
import Dropdown from "../../../components/ui/Dropdown";

const SidebarProfile = () => {
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

  if (!user) return null;

  return (
    <div className="px-4 py-4 border-t border-border flex items-center justify-between">
      {/* User Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">
          {user.name}
        </p>
        <p className="text-xs text-text/60 truncate">
          {user.email}
        </p>
      </div>

      {/* Dropdown Menu */}
      <Dropdown
        items={[
          {
            label: "Settings",
            onClick: () => navigate("/settings"),
          },
          {
            label: "Logout",
            onClick: handleLogout,
            danger: true,
          },
        ]}
      />
    </div>
  );
};

export default SidebarProfile;