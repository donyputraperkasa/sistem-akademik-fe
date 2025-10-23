"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    user: { username: string };
}

interface TaskDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    comments: Comment[];
}

export default function SiswaTaskDetail() {
    useAuth(["SISWA"]);
    const { id } = useParams();
    const [task, setTask] = useState<TaskDetail | null>(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        async function fetchTask() {
        try {
            const res = await api.get(`/tasks/${id}`);
            setTask(res.data);
        } catch (err) {
            console.error("Gagal mengambil detail tugas:", err);
        }
        }
        fetchTask();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await api.post(`/tasks/${id}/comments`, { text: newComment });
        setNewComment("");
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
        } catch (err) {
        console.error("Gagal menambahkan komentar:", err);
        }
    };

    if (!task) return <p className="text-gray-500">Memuat data tugas...</p>;

    return (
        <div className="space-y-4">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <p className="text-gray-700">{task.description}</p>
        <p className="text-sm text-gray-500">Status: {task.status}</p>

        <div className="mt-4">
            <h2 className="font-semibold mb-2 text-blue-700">💬 Komentar</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2 bg-gray-50">
            {task.comments.length > 0 ? (
                task.comments.map((c) => (
                <div key={c.id} className="text-sm">
                    <span className="font-semibold text-blue-700">
                    {c.user.username}:
                    </span>{" "}
                    {c.text}
                    <div className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">Belum ada komentar.</p>
            )}
            </div>

            <form onSubmit={handleSubmit} className="flex mt-3 gap-2">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar..."
                className="border p-2 rounded-md flex-1"
                required
            />
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md">
                Kirim
            </button>
            </form>
        </div>
        </div>
    );
}