import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  if (isLoading) {
    return null; 
  }

  return user ? (children ? children : <Outlet />) : <Navigate to="/login" replace />;
};

export default ProtectedRoute;