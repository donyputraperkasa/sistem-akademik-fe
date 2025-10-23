"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
        const { access_token, user } = await loginUser(username, password);

        // ✅ Simpan ke Zustand
        setUser({
            ...user,
            token: access_token,
        });

        // ✅ Redirect berdasarkan role
        switch (user.role) {
            case "GURU":
            router.push("/guru");
            break;
            case "SISWA":
            router.push("/siswa");
            break;
            case "KEPALA_SEKOLAH":
            router.push("/kepala-sekolah");
            break;
            default:
            router.push("/");
        }
        } catch (err: any) {
        setError("Username atau password salah");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 p-4">
        <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md transform transition-all hover:scale-[1.02]">
            <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 text-white p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m12.75 0a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 19.5v-6.75a2.25 2.25 0 012.25-2.25m12.75 0H4.5" />
                </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-blue-700 text-center">Login SIA - SMP BOSA</h2>
            <p className="text-gray-500 text-sm text-center mt-1">Masuk untuk melanjutkan ke dashboard</p>
            </div>

            {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-100 py-2 rounded-md">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                disabled={loading}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                disabled={loading}
            />

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? "Loading..." : "Masuk"}
            </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
            <p>Belum punya akun? <span className="text-blue-600 hover:underline cursor-pointer">Hubungi Admin</span></p>
            </div>
        </div>
        </div>
    );
}