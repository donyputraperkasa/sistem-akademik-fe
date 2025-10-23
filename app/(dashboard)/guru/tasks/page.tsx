"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/Button";
import Card from "@/components/Card";


interface UserLite {
    id: string;
    username?: string;
    name?: string;
}

interface TeacherLite {
    id: string;
    user?: UserLite;
}

interface StudentLite {
    id: string;
    user?: UserLite;
}

interface TaskWithRelations {
    id: string;
    title: string;
    description?: string;
    dueDate?: string; // ISO string
    status?: "PENDING" | "SUBMITTED" | "GRADED";
    teacher?: TeacherLite;
    student?: StudentLite;
    createdAt?: string;
}

export default function TasksPage() {
    useAuth(["GURU"]);

    const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editTask, setEditTask] = useState<TaskWithRelations | null>(null);

    // form edit fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<TaskWithRelations["status"]>("PENDING");

    useEffect(() => {
        async function fetchTasks() {
        try {
            const res = await api.get("/tasks"); // sesuaikan endpoint backend-mu
            setTasks(res.data || []);
        } catch (err) {
            console.error("Gagal mengambil tasks:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchTasks();
    }, []);

    const openEdit = (task: TaskWithRelations) => {
        setEditTask(task);
        setTitle(task.title || "");
        setDescription(task.description || "");
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");
        setStatus(task.status || "PENDING");
        setShowEditModal(true);
    };

    const handleEditSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editTask) return;
        try {
        const payload: Partial<TaskWithRelations> = {
            title,
            description,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            status,
        };
        await api.put(`/tasks/${editTask.id}`, payload);
        // update local state
        setTasks((prev) =>
            prev.map((t) => (t.id === editTask.id ? { ...t, ...payload } as TaskWithRelations : t))
        );
        setShowEditModal(false);
        setEditTask(null);
        } catch (err) {
        console.error("Gagal menyimpan perubahan task:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus tugas ini?")) return;
        try {
        await api.delete(`/tasks/${id}`);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
        console.error("Gagal hapus tugas:", err);
        }
    };

    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-[200px]">
            <p className="animate-pulse text-blue-600">Memuat tugas...</p>
        </div>
        );
    }

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Daftar Tugas</h1>
        </div>

        <Card>
            {tasks.length === 0 ? (
            <p className="text-gray-500">Belum ada tugas.</p>
            ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-blue-50">
                    <th className="px-4 py-2 text-left">Judul</th>
                    <th className="px-4 py-2 text-left">Siswa</th>
                    <th className="px-4 py-2 text-left">Deadline</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => {
                    const studentName =
                        task.student?.user?.name || task.student?.user?.username || "-";
                    return (
                        <tr key={task.id} className="border-t">
                        <td className="px-4 py-3">{task.title}</td>
                        <td className="px-4 py-3">{studentName}</td>
                        <td className="px-4 py-3">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                        </td>
                        <td className={`px-4 py-3 font-semibold ${task.status === "GRADED" ? "text-green-600" : task.status === "SUBMITTED" ? "text-yellow-600" : "text-gray-600"}`}>
                            {task.status || "PENDING"}
                        </td>
                        <td className="px-4 py-3">
                            <div className="flex gap-3">
                            <button className="text-blue-600 hover:underline" onClick={() => openEdit(task)}>
                                Edit
                            </button>
                            <button className="text-red-600 hover:underline" onClick={() => handleDelete(task.id)}>
                                Hapus
                            </button>
                            </div>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
            )}
        </Card>

        {/* Edit Modal */}
        {showEditModal && editTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-bold mb-3">Edit Tugas</h2>
                <form onSubmit={handleEditSave} className="space-y-3">
                <div>
                    <label className="block text-sm mb-1">Judul</label>
                    <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Deskripsi</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Deadline</label>
                    <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded px-3 py-2">
                    <option value="PENDING">PENDING</option>
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="GRADED">GRADED</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" onClick={() => { setShowEditModal(false); setEditTask(null); }} className="bg-gray-300 text-black">
                    Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
}