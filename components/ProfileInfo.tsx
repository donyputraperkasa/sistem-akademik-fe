"use client";

import { useAuthStore } from "@/store/authStore";

export default function ProfileInfo() {
    const { user } = useAuthStore();

    if (!user) {
        return <div>Memuat data...</div>;
    }

    return (
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-white p-6 rounded-xl shadow-md">
        {/* Foto profil */}
        <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
        </div>

        {/* Info user */}
        <div className="flex-1 space-y-3">
            <div>
                <p className="text-gray-500 text-sm">Nama Lengkap</p>
                <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p className="text-lg font-medium">{user.role}</p>
            </div>
        </div>
        </div>
    );
}