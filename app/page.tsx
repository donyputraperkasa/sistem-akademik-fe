import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen flex flex-col justify-between">
            <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                    Sistem Informasi Akademik
                </h1>
                <p className="text-2xl font-semibold text-blue-700 mb-8">
                    SMP BOPKRI 1 Yogyakarta
                </p>

                <Link
                href="/login"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg shadow-md transition-all"
                >
                    Masuk ke Sistem
                </Link>
            </div>
            <Footer />
        </div>
    );
}