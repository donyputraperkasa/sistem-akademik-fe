import axios, { InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/store/authStore";
import Router from "next/router"; // ✅ tambahkan ini

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
  },
});

// ✅ Tambahkan token JWT ke setiap request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
  (error) => Promise.reject(error)
);

// ✅ Tangani response error global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // 401 = token tidak valid → logout & redirect ke login
        if (status === 401) {
        console.warn("🔒 Token invalid atau expired, redirect ke login...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Router.push("/login");
        }

        // ❌ 403 / 404 / 500 tidak redirect → cukup tampilkan error di console
        else if (status === 403) {
        console.warn("🚫 Akses ditolak (403 Forbidden):", error.response?.data);
        } else if (status === 404) {
        console.warn("🔍 Endpoint tidak ditemukan (404):", error.config?.url);
        } else if (status >= 500) {
        console.error("💥 Server error:", error.response?.data);
        }

        return Promise.reject(error);
    }
);

// ✅ Helper generic untuk request bertipe
export async function getTyped<T>(url: string) {
    const res = await api.get<T>(url);
    return res.data;
}
export async function postTyped<T>(url: string, data?: any) {
    const res = await api.post<T>(url, data);
    return res.data;
}
export async function patchTyped<T>(url: string, data?: any) {
    const res = await api.patch<T>(url, data);
    return res.data;
}
export async function delTyped<T>(url: string) {
    const res = await api.delete<T>(url);
    return res.data;
}