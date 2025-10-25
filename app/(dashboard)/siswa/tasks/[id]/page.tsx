"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Modal from "@/components/Modal";
import Card from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";

interface TaskDetail {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: "PENDING" | "SUBMITTED" | "GRADED";
    teacher: { user: { username: string } };
    submissionFile?: string | null; // file yang diunggah siswa (kalau ada)
    grade?: number | null;
    feedback?: string | null;
}

export default function TaskDetailPage() {
    useAuth(["SISWA"]);

    const params = useParams();
    const router = useRouter();
    const taskId = params.id as string;

    const [task, setTask] = useState<TaskDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        async function fetchTask() {
        try {
            const res = await api.get(`/tasks/${taskId}`);
            setTask(res.data);
        } catch (error) {
            console.error("❌ Gagal memuat detail tugas:", error);
        } finally {
            setLoading(false);
        }
        }

        fetchTask();
    }, [taskId]);

    const handleSubmit = async () => {
        if (!file) return alert("Pilih file terlebih dahulu.");
        const formData = new FormData();
        formData.append("file", file);

        try {
        setUploading(true);
        await api.post(`/tasks/${taskId}/submit`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Tugas berhasil dikumpulkan!");
        setOpenModal(false);
        setFile(null);
        setTask((prev) => (prev ? { ...prev, status: "SUBMITTED" } : prev));
        } catch (error) {
        console.error("❌ Gagal mengumpulkan tugas:", error);
        alert("Terjadi kesalahan saat upload, coba lagi.");
        } finally {
        setUploading(false);
        }
    };

    if (loading)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat detail tugas...
            </p>
        </div>
        );

    if (!task)
        return (
        <div className="text-center py-10">
            <p className="text-gray-600">Tugas tidak ditemukan.</p>
        </div>
        );

    return (
        <div className="p-6 space-y-8">
        <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-sm"
        >
            ← Kembali ke daftar tugas
        </button>

        <h1 className="text-2xl font-bold text-blue-700">{task.title}</h1>

        <Card>
            <div className="space-y-4">
            <p>
                <span className="font-semibold">Deskripsi:</span> {task.description}
            </p>
            <p>
                <span className="font-semibold">Guru:</span>{" "}
                {task.teacher.user.username}
            </p>
            <p>
                <span className="font-semibold">Tenggat:</span>{" "}
                {new Date(task.dueDate).toLocaleDateString("id-ID")}
            </p>
            <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                className={`font-semibold ${
                    task.status === "GRADED"
                    ? "text-green-600"
                    : task.status === "SUBMITTED"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
                >
                {task.status}
                </span>
            </p>

            {task.grade && (
                <p>
                <span className="font-semibold">Nilai:</span> {task.grade}
                </p>
            )}

            {task.feedback && (
                <p>
                <span className="font-semibold">Feedback:</span> {task.feedback}
                </p>
            )}

            {task.submissionFile && (
                <p>
                <span className="font-semibold">File Jawaban:</span>{" "}
                <a
                    href={task.submissionFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                >
                    Lihat File
                </a>
                </p>
            )}
            </div>

            {task.status === "PENDING" && (
            <div className="mt-6">
                <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                Kumpulkan Jawaban
                </button>
            </div>
            )}
        </Card>

        {/* Modal Upload Tugas */}
        <Modal
            isOpen={openModal}
            onClose={() => {
            setOpenModal(false);
            setFile(null);
            }}
            title={`Kumpulkan Tugas: ${task.title}`}
        >
            <p className="text-sm text-gray-600 mb-4">
            Unggah file jawaban kamu untuk tugas ini (PDF, DOCX, JPG, PNG).
            </p>

            <input
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border w-full p-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">
            <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
                Batal
            </button>
            <button
                disabled={!file || uploading}
                onClick={handleSubmit}
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