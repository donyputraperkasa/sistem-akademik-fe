import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Interceptor untuk nambah token Authorization
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (token) {
        // Pastikan headers selalu ada
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
