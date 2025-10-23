"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";
import Card from "@/components/Card";

interface Comment {
    id: string;
    text: string;
    createdAt: string;
    user: { username: string; role: string };
}

interface TaskDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    dueDate?: string;
    comments: Comment[];
    student: { user: { username: string } };
}

export default function GuruTaskDetail() {
    useAuth(["GURU"]);
    const { id } = useParams();
    const [task, setTask] = useState<TaskDetail | null>(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        async function fetchTask() {
        try {
            const res = await api.get(`/tasks/${id}`);
            setTask(res.data);
        } catch (err) {
            console.error("Gagal memuat detail tugas:", err);
        }
        }
        fetchTask();
    }, [id]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
        await api.post(`/tasks/${id}/comments`, { text: newComment });
        setNewComment("");
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
        } catch (err) {
        console.error("Gagal menambahkan komentar:", err);
        }
    };

    if (!task)
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-blue-600 font-semibold animate-pulse">
            Memuat detail tugas...
            </p>
        </div>
        );

    return (
        <div className="space-y-6">
        <Card>
            <h1 className="text-2xl font-bold text-blue-700 mb-2">
            {task.title}
            </h1>
            <p className="text-gray-700 mb-2">{task.description}</p>
            <p className="text-sm text-gray-500">
            Status: <span className="font-semibold">{task.status}</span>
            </p>
            <p className="text-sm text-gray-500">
            Tenggat:{" "}
            {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Tidak ada"}
            </p>
            <p className="text-sm text-gray-500">
            Siswa: <span className="font-semibold">{task.student.user.username}</span>
            </p>
        </Card>

        <Card>
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
            💬 Komentar Tugas
            </h2>
            <div className="border rounded-md p-3 bg-gray-50 max-h-80 overflow-y-auto space-y-3">
            {task.comments.length > 0 ? (
                task.comments.map((c) => (
                <div
                    key={c.id}
                    className={`p-2 rounded-md ${
                    c.user.role === "GURU" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                >
                    <p className="text-sm">
                    <span
                        className={`font-semibold ${
                        c.user.role === "GURU"
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                    >
                        {c.user.username}:
                    </span>{" "}
                    {c.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                    </p>
                </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">Belum ada komentar.</p>
            )}
            </div>

            <form onSubmit={handleAddComment} className="flex mt-3 gap-2">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar sebagai guru..."
                className="border p-2 rounded-md flex-1"
                required
            />
            <Button type="submit">Kirim</Button>
            </form>
        </Card>
        </div>
    );
}