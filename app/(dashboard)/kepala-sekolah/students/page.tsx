"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal";

type Student = {
    id: number;
    name: string;
    grade: string;
};

export default function StudentsPage() {
    const { user } = useAuthStore();
    const isKepsek = user?.role === "KEPALA_SEKOLAH";

    const [students, setStudents] = useState<Student[]>([
        { id: 1, name: "Andi Wijaya", grade: "8A" },
        { id: 2, name: "Dewi Lestari", grade: "9B" },
    ]);

    const [form, setForm] = useState({ name: "", grade: "" });
    const [editData, setEditData] = useState<Student | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleAdd = () => {
        if (!form.name || !form.grade) return;
        const newStudent = { id: students.length + 1, ...form };
        setStudents([...students, newStudent]);
        setForm({ name: "", grade: "" });
    };

    const handleUpdate = () => {
        if (!editData) return;
        setStudents((prev) =>
        prev.map((s) => (s.id === editData.id ? editData : s))
        );
        setEditData(null);
    };

    const handleDelete = (id: number) => {
        setStudents(students.filter((s) => s.id !== id));
        setDeleteConfirm(null);
    };

    return (
        <div className="p-8 relative">
        <h1 className="text-2xl font-semibold text-blue-800 mb-4">Data Siswa</h1>

        {/* Tambah Siswa */}
        {isKepsek && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-medium mb-2">Tambah Siswa Baru</h2>
            <div className="grid grid-cols-2 gap-3">
                <input
                type="text"
                placeholder="Nama"
                className="border rounded-md p-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                type="text"
                placeholder="Kelas"
                className="border rounded-md p-2"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
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

        {/* Tabel Data */}
        <table className="min-w-full border bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
            <tr>
                <th className="py-2 px-4 border">No</th>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Kelas</th>
                {isKepsek && <th className="py-2 px-4 border">Aksi</th>}
            </tr>
            </thead>
            <tbody>
            {students.map((s, i) => (
                <tr key={s.id} className="text-center hover:bg-blue-50">
                <td className="border py-2 px-4">{i + 1}</td>
                <td className="border py-2 px-4">{s.name}</td>
                <td className="border py-2 px-4">{s.grade}</td>
                {isKepsek && (
                    <td className="border py-2 px-4 space-x-2">
                    <button
                        onClick={() => setEditData(s)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setDeleteConfirm(s.id)}
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

        {/* Modal Edit */}
        <Modal isOpen={!!editData} onClose={() => setEditData(null)} title="Edit Data Siswa">
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
                        value={editData.grade}
                        onChange={(e) =>
                            setEditData({ ...editData, grade: e.target.value })
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

        {/* Modal Hapus */}
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
                    onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Hapus
                </button>
            </div>
        </Modal>
        </div>
    );
}