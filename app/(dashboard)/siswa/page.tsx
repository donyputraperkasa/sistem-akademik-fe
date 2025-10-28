"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";

interface Grade {
    id: string;
    subject: string;
    value: number;
    teacher: {
        user: { username: string };
    };
}

interface Attendance {
    id: string;
    date: string;
    status: "HADIR" | "TIDAK_HADIR";
    teacher: { user: { username: string } };
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: "PENDING" | "SUBMITTED" | "GRADED";
    teacher: { user: { username: string } };
    dueDate: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function SiswaDashboard() {
    useAuth(["SISWA"]);

    const [grades, setGrades] = useState<Grade[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);

    // 📡 Ambil semua data siswa: nilai, kehadiran, tugas, dan pengumuman terbaru
    useEffect(() => {
        async function fetchData() {
            try {
                const [gradesRes, attendanceRes, tasksRes, annRes] = await Promise.all([
                    api.get("/grades"),
                    api.get("/attendance"),
                    api.get("/tasks"),
                    api.get("/announcements"),
                ]);
                setGrades(gradesRes.data);
                setAttendance(attendanceRes.data);
                setTasks(tasksRes.data);
                if (annRes.data.length > 0) {
                    setAnnouncement(annRes.data[0]);
                } else {
                    setAnnouncement(null);
                }
            } catch (error) {
                console.error("Gagal memuat data siswa:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-blue-600 font-semibold animate-pulse">Memuat data siswa...</p>
            </div>
        );

    return (
        <div className="space-y-8">
            {announcement ? (
                <div className="bg-blue-100 border border-blue-300 text-blue-900 p-4 rounded-lg shadow-sm transition-all">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">📢</span>
                        <p className="font-semibold">{announcement.title}</p>
                    </div>
                    <p className="text-sm mt-1 text-gray-700">{announcement.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Diterbitkan: {new Date(announcement.createdAt).toLocaleDateString("id-ID")}
                    </p>
                </div>
            ) : (
                <div className="bg-blue-100 border border-blue-300 text-blue-900 p-4 rounded-lg shadow-sm transition-all">
                    <p className="font-semibold">Belum ada pengumuman.</p>
                </div>
            )}

            <div className="mb-4">
                <h1 className="text-2xl font-bold text-blue-700">Dashboard Siswa</h1>
                <p className="text-gray-600 text-sm">Aktivitas dan progres belajar 📘</p>
            </div>

            {/* --- Nilai --- */}
            <Card>
                <h2 className="font-semibold text-lg mb-3 text-blue-700">📘 Nilai Saya</h2>
                {grades.length > 0 ? (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-50 text-left border-b">
                                <th className="p-2">Mata Pelajaran</th>
                                <th className="p-2">Nilai</th>
                                <th className="p-2">Guru</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade) => (
                                <tr key={grade.id} className="border-b hover:bg-blue-50">
                                    <td className="p-2">{grade.subject}</td>
                                    <td className="p-2 font-semibold text-blue-600">{grade.value}</td>
                                    <td className="p-2">{grade.teacher.user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-sm">Belum ada nilai.</p>
                )}
            </Card>

            {/* --- Kehadiran --- */}
            <Card>
                <h2 className="font-semibold text-lg mb-3 text-blue-700">🕒 Riwayat Kehadiran</h2>
                {attendance.length > 0 ? (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-50 text-left border-b">
                                <th className="p-2">Tanggal</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Guru</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((a) => (
                                <tr key={a.id} className="border-b hover:bg-blue-50">
                                    <td className="p-2">{new Date(a.date).toLocaleDateString()}</td>
                                    <td
                                        className={`p-2 font-semibold ${
                                            a.status === "HADIR" ? "text-green-600" : "text-red-500"
                                        }`}
                                    >
                                        {a.status}
                                    </td>
                                    <td className="p-2">{a.teacher.user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-sm">Belum ada data kehadiran.</p>
                )}
            </Card>

            {/* --- Tugas --- */}
            <Card>
                <h2 className="font-semibold text-lg mb-3 text-blue-700">📝 Daftar Tugas</h2>
                {tasks.length > 0 ? (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-blue-50 text-left border-b">
                                <th className="p-2">Judul</th>
                                <th className="p-2">Deskripsi</th>
                                <th className="p-2">Tenggat</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task.id} className="border-b hover:bg-blue-50">
                                    <td className="p-2">{task.title}</td>
                                    <td className="p-2">{task.description}</td>
                                    <td className="p-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td
                                        className={`p-2 font-semibold ${
                                            task.status === "GRADED"
                                                ? "text-green-600"
                                                : task.status === "SUBMITTED"
                                                ? "text-blue-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {task.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-sm">Belum ada tugas.</p>
                )}
            </Card>
        </div>
    );
}