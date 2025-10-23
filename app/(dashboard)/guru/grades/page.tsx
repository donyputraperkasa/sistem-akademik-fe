"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface Grade {
    id: string;
    subject: string;
    value: number;
    student: {
        user: {
        username: string;
        };
    };
}

export default function GuruGradesPage() {
    useAuth(["GURU"]);

    const [grades, setGrades] = useState<Grade[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [subject, setSubject] = useState("");
    const [value, setValue] = useState<number | "">("");
    const [studentId, setStudentId] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [editData, setEditData] = useState<{id: string; subject: string; value: number | "";} | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
        try {
            const [gradeRes, studentRes] = await Promise.all([
            api.get("/grades"),
            api.get("/students"), // pastikan BE kamu punya endpoint ini
            ]);
            setGrades(gradeRes.data);
            setStudents(studentRes.data);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    const handleAddGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await api.post("/grades", { subject, value: Number(value), studentId });
        setSubject("");
        setValue("");
        setStudentId("");
        setShowModal(false);
        const res = await api.get("/grades");
        setGrades(res.data);
        } catch (err) {
        console.error("Gagal menambah nilai:", err);
        }
    };

    const handleDeleteGrade = async (id: string) => {
        if (!confirm("Yakin ingin menghapus nilai ini?")) return;
        try {
        await api.delete(`/grades/${id}`);
        setGrades((prev) => prev.filter((g) => g.id !== id));
        } catch (err) {
        console.error("Gagal menghapus nilai:", err);
        }
    };

    const handleEditGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;
        try {
            await api.put(`/grades/${editData.id}`, { subject: editData.subject, value: Number(editData.value) });
            setShowEditModal(false);
            setEditData(null);
            const res = await api.get("/grades");
            setGrades(res.data);
        } catch (err) {
            console.error("Gagal memperbarui nilai:", err);
        }
    };

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">Memuat data...</p>
        </div>
        );

    return (
        <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-700">Manajemen Nilai</h1>
            <Button onClick={() => setShowModal(true)}>+ Tambah Nilai</Button>
        </div>

        <Card>
            <h2 className="font-semibold text-lg mb-3 text-blue-700">📘 Daftar Nilai Siswa</h2>
            {grades.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-blue-50 text-left border-b">
                    <th className="p-2">Siswa</th>
                    <th className="p-2">Mata Pelajaran</th>
                    <th className="p-2">Nilai</th>
                    <th className="p-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {grades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-blue-50">
                    <td className="p-2">{grade.student.user.username}</td>
                    <td className="p-2">{grade.subject}</td>
                    <td className="p-2 font-semibold text-blue-600">{grade.value}</td>
                    <td className="p-2">
                        <button
                        onClick={() => {
                            setEditData({ id: grade.id, subject: grade.subject, value: grade.value });
                            setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-800 font-medium mr-4"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDeleteGrade(grade.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                        >
                        Hapus
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">Belum ada nilai yang diberikan</p>
            )}
        </Card>

        {/* Modal tambah nilai */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-bold text-blue-700 mb-4">Tambah Nilai Baru</h2>
                <form onSubmit={handleAddGrade} className="space-y-3">
                <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    required
                >
                    <option value="">Pilih Siswa</option>
                    {students.map((student) => (
                    <option key={student.id} value={student.id}>
                        {student.user.username}
                    </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Mata Pelajaran"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="number"
                    placeholder="Nilai"
                    value={value}
                    onChange={(e) => setValue(e.target.valueAsNumber || "")}
                    className="w-full border p-2 rounded-md"
                    required
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => setShowModal(false)} className="bg-gray-400">
                    Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
                </form>
            </div>
            </div>
        )}

        {/* Modal edit nilai */}
        {showEditModal && editData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-bold text-blue-700 mb-4">Edit Nilai</h2>
                <form onSubmit={handleEditGrade} className="space-y-3">
                <input
                    type="text"
                    placeholder="Mata Pelajaran"
                    value={editData.subject}
                    onChange={(e) => setEditData({...editData, subject: e.target.value})}
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    type="number"
                    placeholder="Nilai"
                    value={editData.value}
                    onChange={(e) => setEditData({...editData, value: e.target.valueAsNumber || ""})}
                    className="w-full border p-2 rounded-md"
                    required
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => {setShowEditModal(false); setEditData(null);}} className="bg-gray-400">
                    Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
}