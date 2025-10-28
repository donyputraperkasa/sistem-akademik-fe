// lib/auth.ts
import { getToken } from "@/store/authStore";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(username: string, password: string) {
  const base = BASE;
  console.log("Attempt login to:", base);

  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined. Check .env.local and restart dev server.");
  }

  const res = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    // credentials: "include", // uncomment only if server uses cookies
  });

  // debug jaringan
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login gagal: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}

export async function apiFetch(endpoint: string, init: RequestInit = {}) {
  const base = BASE;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not defined. Check .env.local and restart dev server.");

  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as Record<string, string>;

  const res = await fetch(`${base}${endpoint}`, {
    ...init,
    headers,
    // credentials: "include", // uncomment if backend uses cookie based auth
  });

  if (!res.ok) {
    // grab response body (if any) for better error message
    const text = await res.text().catch(() => "");
    const err = new Error(`API Error: ${res.status} ${res.statusText} ${text}`);
    // attach status for callers
    (err as any).status = res.status;
    throw err;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return null;
}