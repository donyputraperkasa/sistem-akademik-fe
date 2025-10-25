"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";

interface Attendance {
    id: string;
    date: string;
    status: "HADIR" | "TIDAK_HADIR";
    teacher: { user: { username: string } };
}

export default function AttendancePage() {
    useAuth(["SISWA"]);

    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAttendance() {
        try {
            const res = await api.get("/attendance");
            setAttendance(res.data);
        } catch (error) {
            console.error("❌ Gagal memuat kehadiran:", error);
        } finally {
            setLoading(false);
        }
        }

        fetchAttendance();
    }, []);

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat data kehadiran...
            </p>
        </div>
        );

    return (
        <div className="space-y-8">
        <h1 className="text-2xl font-bold text-blue-700">🕒 Riwayat Kehadiran</h1>

        <Card>
            {attendance.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-blue-50 text-left border-b">
                    <th className="p-2">Tanggal</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Guru Piket</th>
                </tr>
                </thead>
                <tbody>
                {attendance.map((a) => (
                    <tr key={a.id} className="border-b hover:bg-blue-50">
                    <td className="p-2">
                        {new Date(a.date).toLocaleDateString("id-ID")}
                    </td>
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
            <p className="text-gray-500 text-sm">
                Belum ada catatan kehadiran.
            </p>
            )}
        </Card>
        </div>
    );
}