import { create } from "zustand";

interface AuthState {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  isLoading: boolean; 
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, 
  setUser: (user) => set({ user, isLoading: false }), 
  clearUser: () => set({ user: null, isLoading: false }), 
}));