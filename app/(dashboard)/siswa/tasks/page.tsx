"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTyped } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/Card";
import { Task } from "@/types/task";

export default function SiswaTasksPage() {
    useAuth(["SISWA"]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
        try {
            const data = await getTyped<Task[]>("/tasks/by-student");
            setTasks(data);
        } catch (err) {
            console.error("Gagal memuat daftar tugas:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchTasks();
    }, []);

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat daftar tugas...
            </p>
        </div>
        );

    return (
        <div className="space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">📝 Daftar Tugas Saya</h1>

        <Card>
            {tasks.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-blue-50 text-left border-b">
                    <th className="p-2">Judul</th>
                    <th className="p-2">Deskripsi</th>
                    <th className="p-2">Tenggat</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Guru</th>
                    <th className="p-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-blue-50">
                    <td className="p-2 font-semibold">{task.title}</td>
                    <td className="p-2 text-gray-700">{task.description}</td>
                    <td className="p-2">
                        {new Date(task.dueDate).toLocaleDateString()}
                    </td>
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
                    <td className="p-2">{task.teacher.user.username}</td>
                    <td className="p-2">
                        <Link
                        href={`/dashboard/siswa/tasks/${task.id}`}
                        className="text-blue-600 hover:underline"
                        >
                        Lihat Detail
                        </Link>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">Belum ada tugas yang diberikan.</p>
            )}
        </Card>
        </div>
    );
}