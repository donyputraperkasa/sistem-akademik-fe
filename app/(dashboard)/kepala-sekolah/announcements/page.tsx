"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal";

type Announcement = {
    id: number;
    title: string;
    date: string;
    content: string;
};

export default function AnnouncementsPage() {
    const { user } = useAuthStore();
    const isKepsek = user?.role === "KEPALA_SEKOLAH";

    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
        id: 1,
        title: "Rapat Guru Mingguan",
        date: "2025-10-25",
        content: "Rapat akan diadakan pukul 09.00 WIB di ruang guru.",
        },
    ]);

    const [form, setForm] = useState({ title: "", date: "", content: "" });
    const [editData, setEditData] = useState<Announcement | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const handleAdd = () => {
        if (!form.title || !form.date || !form.content) return;
        const newData = { id: announcements.length + 1, ...form };
        setAnnouncements([...announcements, newData]);
        setForm({ title: "", date: "", content: "" });
    };

    const handleUpdate = () => {
        if (!editData) return;
        setAnnouncements((prev) =>
        prev.map((a) => (a.id === editData.id ? editData : a))
        );
        setEditData(null);
    };

    const handleDelete = (id: number) => {
        setAnnouncements(announcements.filter((a) => a.id !== id));
        setDeleteConfirm(null);
    };

    return (
        <div className="p-8 relative">
        <h1 className="text-2xl font-semibold text-blue-800 mb-4">Pengumuman Sekolah</h1>

        {isKepsek && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
            <h2 className="font-medium mb-2">Tambah Pengumuman Baru</h2>
            <div className="grid grid-cols-3 gap-3">
                <input
                type="text"
                placeholder="Judul"
                className="border rounded-md p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                type="date"
                className="border rounded-md p-2"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <textarea
                placeholder="Isi Pengumuman"
                className="border rounded-md p-2 col-span-3"
                rows={3}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
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

        <div className="space-y-4">
            {announcements.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold">{a.title}</h2>
                <p className="text-sm text-gray-500">{a.date}</p>
                <p className="mt-2 text-gray-700">{a.content}</p>

                {isKepsek && (
                <div className="mt-3 flex gap-2">
                    <button
                    onClick={() => setEditData(a)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => setDeleteConfirm(a.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                    Hapus
                    </button>
                </div>
                )}
            </div>
            ))}
        </div>

        {/* Modal Edit */}
        <Modal isOpen={!!editData} onClose={() => setEditData(null)} title="Edit Pengumuman">
            {editData && (
                <>
                <input
                    type="text"
                    className="border p-2 w-full rounded mb-3"
                    value={editData.title}
                    onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                    }
                />
                <input
                    type="date"
                    className="border p-2 w-full rounded mb-3"
                    value={editData.date}
                    onChange={(e) =>
                        setEditData({ ...editData, date: e.target.value })
                    }
                />
                <textarea
                    className="border p-2 w-full rounded mb-3"
                    rows={4}
                    value={editData.content}
                    onChange={(e) =>
                        setEditData({ ...editData, content: e.target.value })
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