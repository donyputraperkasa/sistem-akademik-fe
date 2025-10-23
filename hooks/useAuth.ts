"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(allowedRoles: string[]) {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
        router.push("/login");
        return;
        }

        if (!allowedRoles.includes(user.role)) {
        router.push("/login");
        }
    }, [user, allowedRoles, router]);
}