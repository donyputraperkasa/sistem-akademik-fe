"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import Button from "@/components/Button";

interface Attendance {
    id: string;
    date: string;
    status: "HADIR" | "TIDAK_HADIR";
    student: {
        user: {
        username: string;
        };
    };
}

export default function GuruAttendancePage() {
    useAuth(["GURU"]);

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [studentId, setStudentId] = useState("");
    const [status, setStatus] = useState<"HADIR" | "TIDAK_HADIR">("HADIR");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New states for editing attendance
    const [editData, setEditData] = useState<Attendance | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
        try {
            const [attRes, studentRes] = await Promise.all([
            api.get("/attendance"),
            api.get("/students"),
            ]);
            setAttendance(attRes.data);
            setStudents(studentRes.data);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    const handleAddAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await api.post("/attendance", {
            studentId,
            status,
        });
        setShowModal(false);
        setStudentId("");
        setStatus("HADIR");
        const res = await api.get("/attendance");
        setAttendance(res.data);
        } catch (err) {
        console.error("Gagal menambah kehadiran:", err);
        }
    };

    // New function to handle editing attendance
    const handleEditAttendance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;
        try {
            await api.put(`/attendance/${editData.id}`, {
                status: editData.status,
            });
            setShowEditModal(false);
            setEditData(null);
            const res = await api.get("/attendance");
            setAttendance(res.data);
        } catch (err) {
            console.error("Gagal mengedit kehadiran:", err);
        }
    };

    const handleDeleteAttendance = async (id: string) => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        try {
        await api.delete(`/attendance/${id}`);
        setAttendance((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
        console.error("Gagal menghapus kehadiran:", err);
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
            <h1 className="text-2xl font-bold text-blue-700">Manajemen Kehadiran</h1>
            <Button onClick={() => setShowModal(true)}>+ Tambah Kehadiran</Button>
        </div>

        <Card>
            <h2 className="font-semibold text-lg mb-3 text-blue-700">🕓 Daftar Kehadiran</h2>
            {attendance.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-blue-50 text-left border-b">
                    <th className="p-2">Siswa</th>
                    <th className="p-2">Tanggal</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {attendance.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-blue-50">
                    <td className="p-2">{a.student.user.username}</td>
                    <td className="p-2">{new Date(a.date).toLocaleDateString()}</td>
                    <td
                        className={`p-2 font-semibold ${
                        a.status === "HADIR" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {a.status}
                    </td>
                    <td className="p-2 space-x-2">
                        <button
                        onClick={() => handleDeleteAttendance(a.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                        >
                        Hapus
                        </button>
                        <button
                        onClick={() => {
                            setEditData(a);
                            setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                        Edit
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">Belum ada data kehadiran</p>
            )}
        </Card>

        {/* Modal Tambah Kehadiran */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-bold text-blue-700 mb-4">Tambah Kehadiran</h2>
                <form onSubmit={handleAddAttendance} className="space-y-3">
                <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full border p-2 rounded-md"
                    required
                >
                    <option value="">Pilih Siswa</option>
                    {students.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.user.username}
                    </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={(e) =>
                    setStatus(e.target.value as "HADIR" | "TIDAK_HADIR")
                    }
                    className="w-full border p-2 rounded-md"
                >
                    <option value="HADIR">Hadir</option>
                    <option value="TIDAK_HADIR">Tidak Hadir</option>
                </select>

                <div className="flex justify-end gap-2">
                    <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-400"
                    >
                    Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
                </form>
            </div>
            </div>
        )}

        {/* Modal Edit Kehadiran */}
        {showEditModal && editData && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-bold text-blue-700 mb-4">Edit Kehadiran</h2>
                <form onSubmit={handleEditAttendance} className="space-y-3">
                <p className="font-semibold">
                    Siswa: {editData.student.user.username}
                </p>
                <p className="font-semibold">
                    Tanggal: {new Date(editData.date).toLocaleDateString()}
                </p>

                <select
                    value={editData.status}
                    onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value as "HADIR" | "TIDAK_HADIR" })
                    }
                    className="w-full border p-2 rounded-md"
                >
                    <option value="HADIR">Hadir</option>
                    <option value="TIDAK_HADIR">Tidak Hadir</option>
                </select>

                <div className="flex justify-end gap-2">
                    <Button
                    type="button"
                    onClick={() => {
                        setShowEditModal(false);
                        setEditData(null);
                    }}
                    className="bg-gray-400"
                    >
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