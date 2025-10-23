// hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuth(allowedRoles?: string[]) {
    const router = useRouter();
    const { user, initialized, getUserFromToken } = useAuthStore();

    useEffect(() => {
        if (!initialized) return; // tunggu sampai selesai init

        if (!user) {
        router.replace("/login");
        } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.replace("/unauthorized");
        }
    }, [user, initialized, allowedRoles, router]);

    useEffect(() => {
        getUserFromToken(); // jaga-jaga kalau belum sempat dipanggil
    }, [getUserFromToken]);

    return { user, initialized };
}