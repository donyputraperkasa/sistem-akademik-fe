"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // hanya kepala sekolah yang bisa akses
        if (user?.role !== "KEPALA_SEKOLAH") {
        router.push("/unauthorized");
        }
    }, [user, router]);

    // data dummy sementara
    const records = [
        { id: 1, date: "2025-10-25", present: 120, absent: 5 },
        { id: 2, date: "2025-10-24", present: 118, absent: 7 },
    ];

    return (
        <div className="p-8">
        <h1 className="text-2xl font-semibold text-blue-800 mb-4">
            Rekap Kehadiran Sekolah
        </h1>

        <table className="min-w-full border bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
            <tr>
                <th className="py-2 px-4 border">Tanggal</th>
                <th className="py-2 px-4 border">Jumlah Hadir</th>
                <th className="py-2 px-4 border">Jumlah Tidak Hadir</th>
            </tr>
            </thead>
            <tbody>
            {records.map((r) => (
                <tr key={r.id} className="text-center hover:bg-blue-50">
                <td className="border py-2 px-4">{r.date}</td>
                <td className="border py-2 px-4">{r.present}</td>
                <td className="border py-2 px-4 text-red-600">{r.absent}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
}