"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
        setMessage("Password baru tidak cocok.");
        return;
        }

        // TODO: panggil API backend NestJS untuk ubah password
        // misal await fetch("/api/change-password", { ... })

        setMessage("Password berhasil diubah!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Ubah Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm text-gray-600">Password Saat Ini</label>
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                required
            />
            </div>

            <div>
            <label className="block text-sm text-gray-600">Password Baru</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                required
            />
            </div>

            <div>
            <label className="block text-sm text-gray-600">Konfirmasi Password Baru</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                required
            />
            </div>

            {message && <p className="text-sm text-blue-700">{message}</p>}

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