"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/auth";

type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export default function AnnouncementList() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
        try {
            const data = await apiFetch("/announcements");
            setAnnouncements(data);
        } catch (err) {
            console.error("Gagal memuat pengumuman:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchData();
    }, []);

    if (loading) return <p className="text-gray-500">Memuat pengumuman...</p>;
    if (announcements.length === 0)
        return <p className="text-gray-500">Belum ada pengumuman.</p>;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-blue-700 mb-3">
            📢 Pengumuman Sekolah
        </h2>
        <div className="space-y-3">
            {announcements.map((a) => (
            <div key={a.id} className="border-b pb-2 last:border-none">
                <h3 className="font-medium text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                {new Date(a.createdAt).toLocaleDateString("id-ID")}
                </p>
            </div>
            ))}
        </div>
        </div>
    );
}