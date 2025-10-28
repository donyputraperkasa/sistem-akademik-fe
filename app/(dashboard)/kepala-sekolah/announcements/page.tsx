"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Announcement } from "@/types/announcement";
import Modal from "@/components/Modal";
import { apiFetch } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AnnouncementsPage() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    const isKepsek = user?.role === "KEPALA_SEKOLAH";
    const router = useRouter();

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [form, setForm] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // --- Debug helper: expose current auth store to window for easy inspection in DevTools
  useEffect(() => {
    // log initial values when component mounts or token changes
    console.log("[debug] auth store:", useAuthStore.getState());

    // expose helper to access auth store from browser console: call __getAuth() to get { user, token }
    (window as any).__getAuth = () => useAuthStore.getState();

    // cleanup when component unmounts
    return () => {
        try {
            // remove helper to avoid leaking to global scope
            delete (window as any).__getAuth;
        } catch (e) {
            // ignore
        }
        };
    }, [token]);

    // ========================
    // GET: Ambil semua pengumuman
    // ========================
    useEffect(() => {
        const fetchAnnouncements = async () => {
        try {
            const data: Announcement[] = await apiFetch("/announcements");
            setAnnouncements(data || []);
        } catch (err: any) {
            console.error("Error fetch announcements:", err);
            if (err?.status === 401) {
            // unauthorized: logout and redirect to login
            useAuthStore.getState().logout();
            router.push("/login");
            }
        }
        };

        // only fetch if token exists (prevents unnecessary 401 preflight on anonymous)
        if (token) fetchAnnouncements();
    }, [token, router]);

    // ========================
    // POST: Tambah pengumuman
    // ========================
    const handleAdd = async () => {
        if (!form.title || !form.content) return alert("Lengkapi semua field!");
        setLoading(true);
        try {
        const newAnnouncement: Announcement = await apiFetch("/announcements", {
            method: "POST",
            body: JSON.stringify(form),
        });
        setAnnouncements((prev) => [newAnnouncement, ...prev]);
        setForm({ title: "", content: "" });
        } catch (err: any) {
        console.error("Error: Gagal menambah pengumuman", err);
        if (err?.status === 401) {
            alert("Sesi habis. Silakan login ulang.");
            useAuthStore.getState().logout();
            router.push("/login");
        } else {
            alert("Gagal menambah pengumuman");
        }
        } finally {
        setLoading(false);
        }
    };

    // ========================
    // DELETE: Hapus pengumuman
    // ========================
    const handleDelete = async (id: string) => {
        try {
        await apiFetch(`/announcements/${id}`, {
            method: "DELETE",
        });
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        } catch (err: any) {
        console.error(err);
        if (err?.status === 401) {
            useAuthStore.getState().logout();
            router.push("/login");
        } else {
            alert("Gagal menghapus pengumuman");
        }
        } finally {
        setDeleteConfirm(null);
        }
    };

    // ========================
    // RENDER
    // ========================
    return (
        <div className="p-8 relative">
        <h1 className="text-2xl font-semibold text-blue-800 mb-6">📢 Pengumuman Sekolah</h1>

        {/* FORM TAMBAH */}
        {isKepsek && (
            <div className="mb-8 bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm">
            <h2 className="font-semibold mb-3">Tambah Pengumuman Baru</h2>
            <div className="flex flex-col gap-3">
                <input
                type="text"
                placeholder="Judul Pengumuman"
                className="border rounded-md p-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                placeholder="Isi Pengumuman"
                className="border rounded-md p-2"
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
            </div>
            <button
                onClick={handleAdd}
                disabled={loading}
                className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? "Menyimpan..." : "Tambah"}
            </button>
            </div>
        )}

        {/* LIST PENGUMUMAN */}
        <div className="space-y-4">
            {announcements.length === 0 ? (
            <p className="text-gray-500 italic">Belum ada pengumuman.</p>
            ) : (
            announcements.map((a) => (
                <div key={a.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800">{a.title}</h2>
                <p className="text-sm text-gray-500">
                    {new Date(a.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
                <p className="mt-2 text-gray-700">{a.content}</p>

                {a.createdByUser && (
                    <p className="text-xs text-gray-500 mt-2">Dibuat oleh: {a.createdByUser.username} ({a.createdByUser.role})</p>
                )}

                {isKepsek && (
                    <div className="mt-3 flex gap-2">
                    <button onClick={() => setDeleteConfirm(a.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Hapus</button>
                    </div>
                )}
                </div>
            ))
            )}
        </div>

        {/* MODAL HAPUS */}
        <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Pengumuman?">
            <p className="text-gray-600 mb-6">Pengumuman yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
            </div>
        </Modal>
        </div>
    );
}