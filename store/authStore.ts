// store/authStore.ts
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    username: string;
    role: "GURU" | "SISWA" | "KEPALA_SEKOLAH";
    token?: string;
}

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));