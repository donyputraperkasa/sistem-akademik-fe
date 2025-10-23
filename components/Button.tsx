import { ButtonHTMLAttributes } from "react";

export default function Button({
    children,
    className,
    ...props
    }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
        {...props}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition-all ${className}`}
        >
        {children}
        </button>
    );
}