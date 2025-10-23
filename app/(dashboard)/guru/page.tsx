"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

export default function GuruDashboard() {
    useAuth(["GURU"]);

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTasks: 0,
        avgGrade: 0,
        attendanceRate: 0,
    });
    const [loading, setLoading] = useState(true);

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
        <div className="space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">
            Dashboard Guru
        </h1>
        <p className="text-gray-600 mb-4">
            Ringkasan aktivitas mengajar hari ini 📊
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
            <h2 className="text-gray-500 text-sm">Jumlah Siswa</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
            </Card>
            <Card>
            <h2 className="text-gray-500 text-sm">Rata-rata Nilai</h2>
            <p className="text-3xl font-bold text-green-600">{stats.avgGrade}</p>
            </Card>
            <Card>
            <h2 className="text-gray-500 text-sm">Kehadiran</h2>
            <p className="text-3xl font-bold text-purple-600">
                {stats.attendanceRate}%
            </p>
            </Card>
            <Card>
            <h2 className="text-gray-500 text-sm">Total Tugas</h2>
            <p className="text-3xl font-bold text-orange-500">{stats.totalTasks}</p>
            </Card>
        </div>
        </div>
    );
}