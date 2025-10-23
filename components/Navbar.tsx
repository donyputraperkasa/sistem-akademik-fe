"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Sistem Informasi Akademik</h1>
        <div className="flex items-center gap-4">
            {user && <p className="text-sm font-medium">👋 {user.username}</p>}
            <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1.5 rounded-md hover:bg-gray-200 transition-all font-semibold"
            >
            Logout
            </button>
        </div>
        </nav>
    );
}