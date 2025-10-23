"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    BookOpen,
    ClipboardList,
    CalendarCheck,
    Users,
    Megaphone,
    LogOut,
} from "lucide-react";

export default function Sidebar() {
    const { user, logout } = useAuthStore();
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const menuGuru = [
        { name: "Dashboard", href: "/guru", icon: Home },
        { name: "Nilai", href: "/guru/grades", icon: BookOpen },
        { name: "Absensi", href: "/guru/attendance", icon: CalendarCheck },
        { name: "Tugas", href: "/guru/tasks", icon: ClipboardList },
    ];

    const menuSiswa = [
        { name: "Dashboard", href: "/siswa", icon: Home },
        { name: "Nilai Saya", href: "/siswa/grades", icon: BookOpen },
        { name: "Kehadiran", href: "/siswa/attendance", icon: CalendarCheck },
        { name: "Tugas", href: "/siswa/tasks", icon: ClipboardList },
    ];

    const menuKepsek = [
        { name: "Dashboard", href: "/kepala-sekolah", icon: Home },
        { name: "Guru", href: "/kepala-sekolah/teachers", icon: Users },
        { name: "Siswa", href: "/kepala-sekolah/students", icon: Users },
        { name: "Pengumuman", href: "/kepala-sekolah/announcements", icon: Megaphone },
    ];

    const menus =
        user?.role === "GURU"
        ? menuGuru
        : user?.role === "SISWA"
        ? menuSiswa
        : menuKepsek;

    return (
        <aside className="w-64 bg-blue-100 text-slate-800 flex flex-col h-screen shadow-md rounded-r-lg transition-all">
        <div className="p-6 flex items-center justify-center gap-3 border-b border-blue-200">
            <span className="font-semibold text-lg">
            {user?.role === "GURU" && "Guru"}
            {user?.role === "SISWA" && "Siswa"}
            {user?.role === "KEPALA_SEKOLAH" && "Kepala Sekolah"}
            </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {menus.map((menu) => {
            const Icon = menu.icon;
            return (
                <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 transform ${
                    pathname === menu.href
                    ? "bg-blue-200 text-blue-900 font-medium shadow-sm"
                    : "hover:bg-blue-50 hover:scale-105"
                }`}
                >
                <Icon size={20} className="opacity-80" />
                <span>{menu.name}</span>
                </Link>
            );
            })}
        </nav>

        <div className="p-4 border-t border-blue-200">
            <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-md font-medium hover:bg-red-200 transition-all duration-300"
            >
            <LogOut size={18} />
            Logout
            </button>
        </div>
        </aside>
    );
}