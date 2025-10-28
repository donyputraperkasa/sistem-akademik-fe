"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function GuruDashboard() {
    useAuth(["GURU"]);

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTasks: 0,
        avgGrade: 0,
        attendanceRate: 0,
    });
    const [loading, setLoading] = useState(true);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        async function fetchData() {
        try {
            const [gradeRes, attRes, taskRes, studentRes] = await Promise.all([
            api.get("/grades"),
            api.get("/attendance"),
            api.get("/tasks"),
            api.get("/students"),
            ]);

            const grades = gradeRes.data;
            const attendance = attRes.data;
            const tasks = taskRes.data;
            const students = studentRes.data;

            const avgGrade =
            grades.length > 0
                ? grades.reduce((a: number, b: any) => a + b.value, 0) / grades.length
                : 0;

            const hadirCount = attendance.filter(
            (a: any) => a.status === "HADIR"
            ).length;
            const attendanceRate =
            attendance.length > 0
                ? (hadirCount / attendance.length) * 100
                : 0;

            setStats({
            totalStudents: students.length,
            totalTasks: tasks.length,
            avgGrade: parseFloat(avgGrade.toFixed(2)),
            attendanceRate: parseFloat(attendanceRate.toFixed(2)),
            });

            try {
                const annRes = await api.get("/announcements");
                if (annRes.data.length > 0) {
                    setAnnouncement(annRes.data[0]);
                } else {
                    setAnnouncement(null);
                }
            } catch (err) {
                console.error("Gagal memuat pengumuman:", err);
                setAnnouncement(null);
            }
        } catch (err) {
            console.error("Gagal memuat data:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat rekap data...
            </p>
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
                <div className="flex items-center gap-2">
                    <span className="text-lg">📢</span>
                    <p className="font-semibold">Belum ada pengumuman.</p>
                </div>
            </div>
        )}
        <div className="mb-4">
            <h1 className="text-2xl font-bold text-blue-700">Dashboard Guru</h1>
            <p className="text-gray-600 text-sm">Ringkasan aktivitas mengajar hari ini 📊</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
            <h2 className="text-blue-700 text-sm">Jumlah Siswa</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
            </Card>
            <Card>
            <h2 className="text-blue-700 text-sm">Rata-rata Nilai</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.avgGrade}</p>
            </Card>
            <Card>
            <h2 className="text-blue-700 text-sm">Kehadiran</h2>
            <p className="text-3xl font-bold text-blue-600">
                {stats.attendanceRate}%
            </p>
            </Card>
            <Card>
            <h2 className="text-blue-700 text-sm">Total Tugas</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTasks}</p>
            </Card>
        </div>
        </div>
    );
}