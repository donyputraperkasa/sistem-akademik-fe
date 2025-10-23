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
    initialized: boolean; // 👈 tambahan
    setUser: (user: User) => void;
    logout: () => void;
    getUserFromToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    initialized: false, // 👈 awalnya false

    setUser: (user) => {
        if (user.token) localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, initialized: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, initialized: true });
    },

    getUserFromToken: () => {
        const token = localStorage.getItem("token");
        if (!token) return set({ initialized: true }); // 👈 tandai sudah selesai

        try {
        const decoded: any = jwtDecode(token);
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        set({
            user: { ...user, id: decoded.sub, role: decoded.role, token },
            initialized: true, // 👈 penting
        });
        } catch (err) {
        console.error("Token tidak valid:", err);
        localStorage.removeItem("token");
        set({ user: null, initialized: true });
        }
    },
}));

export function getToken() {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    // Debug sementara:
    if (!token) console.warn("⚠️ Token belum ada di localStorage");
    return token;
}