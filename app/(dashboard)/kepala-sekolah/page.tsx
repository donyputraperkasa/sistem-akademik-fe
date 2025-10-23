"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";

interface SummaryData {
    totalGuru: number;
    totalSiswa: number;
    totalTugas: number;
    rataRataNilai: number;
    tingkatKehadiran: number; // dalam persen
}

export default function KepalaSekolahDashboard() {
    useAuth(["KEPALA_SEKOLAH"]);
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
        try {
            // panggil semua endpoint yang dibutuhkan
            const [usersRes, gradesRes, attendanceRes, tasksRes] = await Promise.all([
            api.get("/users"),
            api.get("/grades"),
            api.get("/attendance"),
            api.get("/tasks"),
            ]);

            const users = usersRes.data;
            const grades = gradesRes.data;
            const attendance = attendanceRes.data;
            const tasks = tasksRes.data;

            const totalGuru = users.filter((u: any) => u.role === "GURU").length;
            const totalSiswa = users.filter((u: any) => u.role === "SISWA").length;
            const totalTugas = tasks.length;

            const rataRataNilai =
            grades.length > 0
                ? grades.reduce((sum: number, g: any) => sum + g.value, 0) / grades.length
                : 0;

            const totalHadir = attendance.filter((a: any) => a.status === "HADIR").length;
            const tingkatKehadiran =
            attendance.length > 0 ? (totalHadir / attendance.length) * 100 : 0;

            setData({
            totalGuru,
            totalSiswa,
            totalTugas,
            rataRataNilai: parseFloat(rataRataNilai.toFixed(2)),
            tingkatKehadiran: parseFloat(tingkatKehadiran.toFixed(1)),
            });
        } catch (error) {
            console.error("Gagal memuat data rekap:", error);
        } finally {
            setLoading(false);
        }
        }

        fetchSummary();
    }, []);

    if (loading)
        return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">Memuat data sekolah...</p>
        </div>
        );

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-700">Dashboard Kepala Sekolah</h1>
            <Button onClick={() => window.location.reload()}>🔄 Refresh</Button>
        </div>

        {data ? (
            <>
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                <h2 className="text-lg font-semibold text-blue-700">👩‍🏫 Total Guru</h2>
                <p className="text-3xl font-bold">{data.totalGuru}</p>
                </Card>

                <Card>
                <h2 className="text-lg font-semibold text-blue-700">🎓 Total Siswa</h2>
                <p className="text-3xl font-bold">{data.totalSiswa}</p>
                </Card>

                <Card>
                <h2 className="text-lg font-semibold text-blue-700">📘 Total Tugas</h2>
                <p className="text-3xl font-bold">{data.totalTugas}</p>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <Card>
                <h2 className="text-lg font-semibold text-blue-700">📊 Rata-rata Nilai</h2>
                <p className="text-4xl font-bold text-green-600">
                    {data.rataRataNilai.toFixed(2)}
                </p>
                </Card>

                <Card>
                <h2 className="text-lg font-semibold text-blue-700">🕒 Tingkat Kehadiran</h2>
                <p className="text-4xl font-bold text-indigo-600">
                    {data.tingkatKehadiran}%
                </p>
                </Card>
            </div>
            </>
        ) : (
            <p className="text-gray-500">Tidak ada data tersedia.</p>
        )}
        </div>
    );
}