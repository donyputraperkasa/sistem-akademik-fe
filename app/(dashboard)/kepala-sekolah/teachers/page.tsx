"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal";
import TeacherForm from "@/components/TeacherForm";
import TeacherTable from "@/components/TeacherTable";
import TeacherEditForm from "@/components/TeacherEditForm";

type Teacher = {
    id: number;
    fullName: string;
    nickname: string;
    birthDate: string;
    subject: string;
    position: string;
};

export default function TeachersPage() {
    const { user } = useAuthStore();
    const isKepsek = user?.role === "KEPALA_SEKOLAH";

    const [teachers, setTeachers] = useState<Teacher[]>([
        { id: 1, fullName: "Budi Santoso", nickname: "Budi", birthDate: "1980-03-12", subject: "Matematika", position: "Wali Kelas 9A" },
        { id: 2, fullName: "Siti Aisyah", nickname: "Siti", birthDate: "1985-06-22", subject: "Bahasa Indonesia", position: "Guru BK" },
    ]);

    const [editData, setEditData] = useState<Teacher | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredTeachers = teachers.filter(
        (t) =>
            t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <TeacherForm teachers={teachers} setTeachers={setTeachers} />
        )}

        {/* Search Bar */}
        <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Cari guru..."
        />

        {/* 🧾 Tabel Data Guru */}
        <TeacherTable
            teachers={filteredTeachers}
            isKepsek={isKepsek}
            onEdit={setEditData}
            onDelete={setDeleteConfirm}
        />

        {/* ✏️ Modal Edit */}
        <Modal isOpen={!!editData} onClose={() => setEditData(null)} title="Edit Data Guru">
            {editData && (
                <TeacherEditForm
                    data={editData}
                    setData={setEditData}
                    onSave={handleUpdate}
                    onCancel={() => setEditData(null)}
                />
            )}
        </Modal>

        {/* 🗑️ Modal Konfirmasi Hapus */}
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Data Guru?">
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