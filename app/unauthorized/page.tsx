export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">🚫 Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <a
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            Kembali ke Dashboard
        </a>
        </div>
    );
}