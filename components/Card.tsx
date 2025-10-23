import { ReactNode } from "react";

export default function Card({ children }: { children: ReactNode }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all">
        {children}
        </div>
    );
}