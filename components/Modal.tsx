"use client";

import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string; // ✅ tambahkan ini
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg min-w-[350px]">
            {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>} {/* ✅ tampilkan title jika ada */}
            {children}
            <div className="flex justify-end mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                Tutup
            </button>
            </div>
        </div>
        </div>
    );
}