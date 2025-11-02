"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import { useAuthStore } from "@/store/authStore";
import Modal from "@/components/Modal";
import StudentForm from "@/components/StudentForm";
import StudentTable from "@/components/StudentTable";
import StudentEditForm from "@/components/StudentEditForm";

type Student = {
    id: number;
    fullName: string;
    nickname: string;
    birthDate: string;
    className: string;
};

export default function StudentsPage() {
    const { user } = useAuthStore();
    const isKepsek = user?.role === "KEPALA_SEKOLAH";

    const [students, setStudents] = useState<Student[]>([
        { id: 1, fullName: "Andi Wijaya", nickname: "Andi", birthDate: "2010-05-14", className: "8A" },
        { id: 2, fullName: "Dewi Lestari", nickname: "Dewi", birthDate: "2011-02-20", className: "9B" },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [editData, setEditData] = useState<Student | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {isKepsek && (
                <StudentForm students={students} setStudents={setStudents} />
            )}

            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Cari siswa..."
            />

            <StudentTable
                students={filteredStudents}
                isKepsek={isKepsek}
                onEdit={setEditData}
                onDelete={setDeleteConfirm}
            />

            {/* ✏️ Modal Edit */}
            <Modal
                isOpen={!!editData}
                onClose={() => setEditData(null)}
                title="Edit Data Siswa"
            >
                {editData && (
                    <StudentEditForm
                        data={editData}
                        setData={setEditData}
                        onSave={handleUpdate}
                        onCancel={() => setEditData(null)}
                    />
                )}
            </Modal>

            {/* 🗑️ Modal Konfirmasi Hapus */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Hapus Data Siswa?"
            >
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
                        onClick={() =>
                            deleteConfirm !== null && handleDelete(deleteConfirm)
                        }
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Hapus
                    </button>
                </div>
            </Modal>
        </div>
    );
}