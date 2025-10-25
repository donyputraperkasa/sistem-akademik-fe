"use client";

import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) {
        return <div className="p-8 text-center text-gray-600">Memuat data profil...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-blue-800">Profil Pengguna</h1>
        <div className="space-y-4">
            <div>
            <p className="text-gray-500 text-sm">Nama</p>
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