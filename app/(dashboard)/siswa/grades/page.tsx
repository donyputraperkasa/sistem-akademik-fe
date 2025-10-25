"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";

interface Grade {
    id: string;
    subject: string;
    value: number;
    teacher: { user: { username: string } };
}

export default function GradesPage() {
    useAuth(["SISWA"]);

    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGrades() {
        try {
            const res = await api.get("/grades");
            setGrades(res.data);
        } catch (error) {
            console.error("❌ Gagal memuat nilai:", error);
        } finally {
            setLoading(false);
        }
        }

        fetchGrades();
    }, []);

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat nilai...
            </p>
        </div>
        );

    return (
        <div className="space-y-8">
        <h1 className="text-2xl font-bold text-blue-700">📘 Nilai Saya</h1>

        <Card>
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
                {grades.map((g) => (
                    <tr key={g.id} className="border-b hover:bg-blue-50">
                    <td className="p-2">{g.subject}</td>
                    <td className="p-2 font-semibold text-blue-600">{g.value}</td>
                    <td className="p-2">{g.teacher.user.username}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">Belum ada nilai yang masuk.</p>
            )}
        </Card>
        </div>
    );
}