"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import Card from "@/components/Card";

export default function SiswaDashboard() {
  useAuth(["SISWA"]); // 🔒 proteksi halaman agar hanya siswa yang bisa masuk

    const [grades, setGrades] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        try {
            const [gradeRes, attRes, taskRes] = await Promise.all([
            api.get("/grades"),
            api.get("/attendance"),
            api.get("/tasks"),
            ]);
            setGrades(gradeRes.data);
            setAttendance(attRes.data);
            setTasks(taskRes.data);
        } catch (err) {
            console.error("Gagal mengambil data:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">Memuat data...</p>
        </div>
        );
    }

    return (
        <div className="space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Dashboard Siswa</h1>
        <p className="text-gray-600">Selamat datang di Sistem Akademik SMP BOPKRI 1 Yogyakarta 🎓</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nilai */}
            <Card>
            <h2 className="font-semibold text-lg mb-2 text-blue-700">📘 Nilai Saya</h2>
            <div className="space-y-2">
                {grades.length > 0 ? (
                grades.map((grade: any) => (
                    <div
                    key={grade.id}
                    className="flex justify-between border-b border-gray-200 pb-1 text-sm"
                    >
                    <span>{grade.subject}</span>
                    <span className="font-bold text-blue-600">{grade.value}</span>
                    </div>
                ))
                ) : (
                <p className="text-gray-500 text-sm">Belum ada data nilai</p>
                )}
            </div>
            </Card>

            {/* Kehadiran */}
            <Card>
            <h2 className="font-semibold text-lg mb-2 text-blue-700">🕓 Kehadiran</h2>
            <div className="space-y-2">
                {attendance.length > 0 ? (
                attendance.map((att: any) => (
                    <div key={att.id} className="flex justify-between text-sm border-b border-gray-200 pb-1">
                    <span>{new Date(att.date).toLocaleDateString()}</span>
                    <span
                        className={`font-semibold ${
                        att.status === "HADIR" ? "text-green-600" : "text-red-500"
                        }`}
                    >
                        {att.status}
                    </span>
                    </div>
                ))
                ) : (
                <p className="text-gray-500 text-sm">Belum ada data kehadiran</p>
                )}
            </div>
            </Card>

            {/* Tugas */}
            <Card>
            <h2 className="font-semibold text-lg mb-2 text-blue-700">📝 Daftar Tugas</h2>
            <div className="space-y-2">
                {tasks.length > 0 ? (
                tasks.map((task: any) => (
                    <div
                    key={task.id}
                    className="border p-2 rounded-md hover:bg-blue-50 transition"
                    >
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">
                        Deadline: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                    <p
                        className={`text-xs font-semibold ${
                        task.status === "GRADED"
                            ? "text-green-600"
                            : task.status === "SUBMITTED"
                            ? "text-yellow-600"
                            : "text-gray-400"
                        }`}
                    >
                        {task.status}
                    </p>
                    </div>
                ))
                ) : (
                <p className="text-gray-500 text-sm">Belum ada tugas</p>
                )}
            </div>
            </Card>
        </div>
        </div>
    );
}