import React from "react";
import clsx from "clsx";

interface CardProps {
    children: React.ReactNode;
    className?: string; // ✅ tambahkan ini
}

export default function Card({ children, className }: CardProps) {
    return (
        <div
        className={clsx(
            "bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all",
            className // ✅ gabungkan dengan className tambahan
        )}
        >
        {children}
        </div>
    );
}