import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const token = useAuthStore((state) => state.token);

    console.log(token, typeof token)
    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <>{ children }</>
}

export default ProtectedRoute;