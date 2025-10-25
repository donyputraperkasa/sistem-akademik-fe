"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
    });
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user) {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            username: user.username || "",
        });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("Token tidak ditemukan. Silakan login ulang.");
            return;
        }

        // ⚙️ Ganti URL ini dengan endpoint NestJS kamu
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Gagal menyimpan perubahan");

        const updatedUser = await res.json();
        setUser({ ...user, ...updatedUser }); // update di Zustand store
        setMessage("✅ Data berhasil diperbarui!");
        } catch (error: any) {
        console.error(error);
        setMessage("❌ Terjadi kesalahan saat menyimpan perubahan.");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">Pengaturan Akun</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-sm text-gray-600">Nama Lengkap</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200"
            />
            </div>

            <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200"
            />
            </div>

            <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200"
            />
            </div>

            {message && (
            <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                {message}
            </p>
            )}

            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
            >
            Simpan Perubahan
            </button>
        </form>
        </div>
    );
}