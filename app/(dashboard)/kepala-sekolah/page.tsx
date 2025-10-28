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

interface Announcement {
    title: string;
    content: string;
    createdAt: string;
}

export default function KepalaSekolahDashboard() {
    useAuth(["KEPALA_SEKOLAH"]);
    const [data, setData] = useState<SummaryData | null>(null);
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
        try {
            // panggil semua endpoint yang dibutuhkan
            const [usersRes, gradesRes, attendanceRes, tasksRes, announcementsRes] = await Promise.all([
            api.get("/users"),
            api.get("/grades"),
            api.get("/attendance"),
            api.get("/tasks"),
            api.get("/announcements"),
            ]);

            const users = usersRes.data;
            const grades = gradesRes.data;
            const attendance = attendanceRes.data;
            const tasks = tasksRes.data;
            const announcements = announcementsRes.data;

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

            if (announcements.length > 0) {
                setAnnouncement(announcements[0]);
            } else {
                setAnnouncement(null);
            }
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
        <div className="space-y-8">
        {/* Banner Pengumuman */}
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

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-blue-700">Dashboard Kepala Sekolah</h1>
          <p className="text-gray-600 text-sm">Ringkasan aktivitas mengelola sekolah hari ini 📊</p>
        </div>

        <div className="flex items-center justify-between mb-4">
            <Button onClick={() => window.location.reload()}>🔄 Refresh</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <h2 className="text-blue-700 text-sm">Jumlah Guru</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.totalGuru ?? 0}</p>
          </Card>
          <Card>
            <h2 className="text-blue-700 text-sm">Jumlah Siswa</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.totalSiswa ?? 0}</p>
          </Card>
          <Card>
            <h2 className="text-blue-700 text-sm">Rata-rata Nilai</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.rataRataNilai?.toFixed(2) ?? "0.00"}</p>
          </Card>
          <Card>
            <h2 className="text-blue-700 text-sm">Tingkat Kehadiran</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.tingkatKehadiran ?? 0}%</p>
          </Card>
          <Card className="lg:col-span-4">
            <h2 className="text-blue-700 text-sm">Total Tugas</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.totalTugas ?? 0}</p>
          </Card>
        </div>
        </div>
    );
}