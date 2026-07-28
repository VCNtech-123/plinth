import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { getUser } from "../api/auth.api";

const SessionProvider = ({ children }: { children: React.ReactNode }) => {

  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const res = await getUser();
        setUser(res.data.user);
      } catch (error: any) {
        clearUser();
      }
    };

    initializeSession();
  }, [setUser, clearUser]);

  return <>{children}</>;
};

export default SessionProvider;