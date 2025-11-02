"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
    return (
        <div className="flex justify-end mb-3">
            <div className="relative w-1/3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-2.5" />
                <input
                    type="text"
                    className="bg-white border rounded-md p-2 pl-10 w-full"
                    placeholder={placeholder || "Cari..."}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
