"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "PENDING" | "SUBMITTED" | "GRADED";
    teacher: { user: { username: string } };
}

export default function TasksPage() {
    useAuth(["SISWA"]);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // 🔹 Ambil data tugas
    const fetchTasks = async () => {
        try {
        setError(null);
        const res = await api.get("/tasks");
        setTasks(res.data);
        } catch (err) {
        console.error("❌ Gagal memuat tugas:", err);
        setError("Gagal memuat data tugas. Silakan coba lagi nanti.");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // 🔹 Upload tugas
    const handleSubmitTask = async () => {
        if (!selectedTask || !file) return alert("Pilih file terlebih dahulu.");

        const formData = new FormData();
        formData.append("file", file);

        try {
        setUploading(true);
        await api.post(`/tasks/${selectedTask.id}/submit`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Update status tugas jadi SUBMITTED
        setTasks((prev) =>
            prev.map((t) =>
            t.id === selectedTask.id ? { ...t, status: "SUBMITTED" } : t
            )
        );

        setSelectedTask(null);
        setFile(null);
        // toast.success("Tugas berhasil dikumpulkan!");
        alert("✅ Tugas berhasil dikumpulkan!");

        // Refresh data
        fetchTasks();
        } catch (error) {
        console.error("❌ Gagal upload tugas:", error);
        alert("Gagal mengumpulkan tugas, coba lagi.");
        // toast.error("Gagal mengumpulkan tugas.");
        } finally {
        setUploading(false);
        }
    };

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat daftar tugas...
            </p>
        </div>
        );

    if (error)
        return (
        <div className="text-center py-20 text-gray-600">
            <p>{error}</p>
            <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Coba Lagi
            </button>
        </div>
        );

    return (
        <div className="space-y-8">
        <h1 className="text-2xl font-bold text-blue-700">📝 Daftar Tugas</h1>

        <Card>
            {tasks.length > 0 ? (
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="bg-blue-50 text-left border-b">
                    <th className="p-2">Judul</th>
                    <th className="p-2">Deskripsi</th>
                    <th className="p-2">Tenggat</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-blue-50">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.description}</td>
                    <td className="p-2">
                        {new Date(task.dueDate).toLocaleDateString("id-ID")}
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
                    <td className="p-2">
                        {task.status === "PENDING" ? (
                        <button
                            onClick={() => setSelectedTask(task)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Kumpulkan
                        </button>
                        ) : (
                        <span className="text-gray-400 text-sm italic">
                            {task.status === "SUBMITTED"
                            ? "Menunggu Penilaian"
                            : "Selesai"}
                        </span>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">Belum ada tugas tersedia.</p>
            )}
        </Card>

        {/* 🔹 Modal Upload Tugas */}
        <Modal
            isOpen={!!selectedTask}
            onClose={() => {
            setSelectedTask(null);
            setFile(null);
            }}
            title={`Kumpulkan Tugas: ${selectedTask?.title || ""}`}
        >
            <p className="text-sm text-gray-600 mb-4">
            Unggah file jawaban kamu untuk tugas ini. Format yang diperbolehkan:
            PDF, DOCX, JPG, PNG.
            </p>

            <input
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border w-full p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
            <button
                onClick={() => {
                setSelectedTask(null);
                setFile(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                Batal
            </button>
            <button
                disabled={!file || uploading}
                onClick={handleSubmitTask}
                className={`px-4 py-2 rounded text-white ${
                uploading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {uploading ? "Mengirim..." : "Kirim Tugas"}
            </button>
            </div>
        </Modal>
        </div>
    );
}