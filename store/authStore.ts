// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

type AuthState = {
    user: User | null;
    token: string | null;
    initialized: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    getUserFromToken: () => User | null;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
        user: null,
        token: null,
        initialized: false,

        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),

        getUserFromToken: () => {
            const token = get().token;
            if (!token) return null;
            try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return {
                id: payload.id,
                username: payload.username,
                role: payload.role,
            } as User;
            } catch (err) {
            console.error("Invalid token:", err);
            return null;
            }
        },

        logout: () => {
          set({ user: null, token: null });
          localStorage.removeItem("auth-storage");
        },
        }),
        {
        name: "auth-storage",

        onRehydrateStorage: () => {
            return (persistedState, error) => {
            if (error) {
                console.error("❌ Error rehydrating auth storage:", error);
                return;
            }
            setTimeout(() => {
                try {
                const saved = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state || {};
                useAuthStore.setState({
                    initialized: true,
                    user: saved.user || null,
                    token: saved.token || null,
                });
                console.log("✅ Auth store rehydrated:", saved);
                } catch (err) {
                console.error("❌ Failed to finalize rehydrate:", err);
                }
            }, 0);
            };
        },
        }
    )
);

// helper to get token outside react components
export const getToken = () => useAuthStore.getState().token;