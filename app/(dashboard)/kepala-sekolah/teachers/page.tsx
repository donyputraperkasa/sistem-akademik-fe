"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal";

type Teacher = {
    id: number;
    name: string;
    subject: string;
    email: string;
};

export default function TeachersPage() {
    const { user } = useAuthStore();
    const isKepsek = user?.role === "KEPALA_SEKOLAH";

    const [teachers, setTeachers] = useState<Teacher[]>([
        { id: 1, name: "Budi Santoso", subject: "Matematika", email: "budi@sekolah.id" },
        { id: 2, name: "Siti Aisyah", subject: "Bahasa Indonesia", email: "siti@sekolah.id" },
    ]);

    const [form, setForm] = useState({ name: "", subject: "", email: "" });
    const [editData, setEditData] = useState<Teacher | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // 🟢 Tambah Guru
    const handleAdd = () => {
        if (!form.name || !form.subject || !form.email) return;
        const newTeacher = { id: teachers.length + 1, ...form };
        setTeachers([...teachers, newTeacher]);
        setForm({ name: "", subject: "", email: "" });
    };

    // 🟡 Simpan Edit
    const handleUpdate = () => {
        if (!editData) return;
        setTeachers((prev) =>
        prev.map((t) => (t.id === editData.id ? editData : t))
        );
        setEditData(null);
    };

    // 🔴 Hapus
    const handleDelete = (id: number) => {
        setTeachers(teachers.filter((t) => t.id !== id));
        setDeleteConfirm(null);
    };

    return (
        <div className="p-8 relative">
        <h1 className="text-2xl font-semibold text-blue-800 mb-4">Data Guru</h1>

        {/* ✅ Form Tambah Guru */}
        {isKepsek && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-medium mb-2">Tambah Guru Baru</h2>
            <div className="grid grid-cols-3 gap-3">
                <input
                type="text"
                placeholder="Nama"
                className="border rounded-md p-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                type="text"
                placeholder="Mata Pelajaran"
                className="border rounded-md p-2"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <input
                type="email"
                placeholder="Email"
                className="border rounded-md p-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
            </div>
            <button
                onClick={handleAdd}
                className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                Tambah
            </button>
            </div>
        )}

        {/* 🧾 Tabel Data Guru */}
        <table className="min-w-full border bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
            <tr>
                <th className="py-2 px-4 border">No</th>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Mata Pelajaran</th>
                <th className="py-2 px-4 border">Email</th>
                {isKepsek && <th className="py-2 px-4 border">Aksi</th>}
            </tr>
            </thead>
            <tbody>
            {teachers.map((t, i) => (
                <tr key={t.id} className="text-center hover:bg-blue-50">
                <td className="border py-2 px-4">{i + 1}</td>
                <td className="border py-2 px-4">{t.name}</td>
                <td className="border py-2 px-4">{t.subject}</td>
                <td className="border py-2 px-4">{t.email}</td>
                {isKepsek && (
                    <td className="border py-2 px-4 space-x-2">
                    <button
                        onClick={() => setEditData(t)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setDeleteConfirm(t.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                    </td>
                )}
                </tr>
            ))}
            </tbody>
        </table>

        {/* ✏️ Modal Edit */}
        <Modal isOpen={!!editData} onClose={() => setEditData(null)} title="Edit Data Guru">
            {editData && (
                <>
                <input
                    type="text"
                    className="border p-2 w-full rounded mb-3"
                    value={editData.name}
                    onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                    }
                />
                <input
                    type="text"
                    className="border p-2 w-full rounded mb-3"
                    value={editData.subject}
                    onChange={(e) =>
                        setEditData({ ...editData, subject: e.target.value })
                    }
                />
                <input
                    type="email"
                    className="border p-2 w-full rounded mb-3"
                    value={editData.email}
                    onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                    }
                />
                <div className="flex justify-end space-x-2">
                    <button
                    onClick={() => setEditData(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                    Batal
                    </button>
                    <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                    Simpan
                    </button>
                </div>
                </>
            )}
        </Modal>

        {/* 🗑️ Modal Konfirmasi Hapus */}
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Data Siswa?">
            <p className="text-gray-600 mb-6">
                Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-center space-x-3">
                <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Batal
                </button>
                <button
                    onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Hapus
                </button>
            </div>
        </Modal>
        </div>
    );
}