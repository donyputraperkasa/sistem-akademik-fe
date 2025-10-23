"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const { user } = useAuthStore();
    const pathname = usePathname();

    const menuGuru = [
        { name: "Dashboard", href: "/dashboard/guru" },
        { name: "Nilai", href: "/dashboard/guru/grades" },
        { name: "Absensi", href: "/dashboard/guru/attendance" },
        { name: "Tugas", href: "/dashboard/guru/tasks" },
    ];

    const menuSiswa = [
        { name: "Dashboard", href: "/dashboard/siswa" },
        { name: "Nilai Saya", href: "/dashboard/siswa/grades" },
        { name: "Kehadiran", href: "/dashboard/siswa/attendance" },
        { name: "Tugas", href: "/dashboard/siswa/tasks" },
    ];

    const menuKepsek = [
        { name: "Dashboard", href: "/dashboard/kepala-sekolah" },
        { name: "Guru", href: "/dashboard/kepala-sekolah/teachers" },
        { name: "Siswa", href: "/dashboard/kepala-sekolah/students" },
        { name: "Pengumuman", href: "/dashboard/kepala-sekolah/announcements" },
    ];

    const menus =
        user?.role === "GURU"
        ? menuGuru
        : user?.role === "SISWA"
        ? menuSiswa
        : menuKepsek;

    return (
        <aside className="w-64 bg-blue-700 text-white flex flex-col h-screen shadow-lg">
        <div className="p-6 text-center font-bold text-lg border-b border-blue-500">
            {user?.role === "GURU" && "Guru"}
            {user?.role === "SISWA" && "Siswa"}
            {user?.role === "KEPALA_SEKOLAH" && "Kepala Sekolah"}
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {menus.map((menu) => (
            <Link
                key={menu.href}
                href={menu.href}
                className={`block px-4 py-2 rounded-md transition-all ${
                pathname === menu.href
                    ? "bg-blue-500 font-semibold"
                    : "hover:bg-blue-600"
                }`}
            >
                {menu.name}
            </Link>
            ))}
        </nav>
        </aside>
    );
}