import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { loginRequest } from '../lib/auth';
import { User } from '../types/user';

interface AuthState {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,

    login: async (username, password) => {
        const data = await loginRequest(username, password);
        const token = data.access_token;
        const decoded = jwtDecode<User>(token);
        set({ user: decoded, token });
        localStorage.setItem('token', token);
    },

    logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
    },
}));
