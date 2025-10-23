// lib/auth.ts
import { api } from "./api";

export async function loginUser(username: string, password: string) {
  const response = await api.post("/auth/login", {
    username,
    password,
  });
  return response.data;
}