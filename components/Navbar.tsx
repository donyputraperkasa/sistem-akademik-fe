"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-8 py-4 flex items-center justify-between shadow-lg">
            <h1 className="text-2xl font-semibold tracking-wide">Sistem Informasi Akademik</h1>
            
            <div className="flex items-center gap-5">
                {user && (
                    <div className="flex items-center gap-2 bg-blue-600/30 px-3 py-1.5 rounded-md backdrop-blur-sm">
                        <User size={18} />
                        <p className="text-sm font-medium">{user.username}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-blue-50 active:scale-95 transition-all duration-200 shadow-sm"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </nav>
    );
}