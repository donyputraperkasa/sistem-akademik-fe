// lib/auth.ts
import { api } from "./api";
import { useAuthStore } from "@/store/authStore";

export async function loginUser(username: string, password: string) {
  const response = await api.post("/auth/login", { username, password });

  // ✅ Ambil token dan user dari response BE
  const token = response.data.access_token;
  const user = response.data.user;

  // ✅ Simpan ke Zustand store
  useAuthStore.getState().setUser({
    ...user,
    token,
  });

  return response.data;
}