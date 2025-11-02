"use client";

type Student = {
    id: number;
    fullName: string;
    nickname: string;
    birthDate: string;
    className: string;
};

type StudentTableProps = {
    students: Student[];
    isKepsek: boolean;
    onEdit: (student: Student) => void;
    onDelete: (id: number) => void;
};

export default function StudentTable({ students, isKepsek, onEdit, onDelete }: StudentTableProps) {
    return (
        <table className="min-w-full border bg-white rounded-lg shadow-sm">
        <thead className="bg-blue-100">
            <tr>
            <th className="py-2 px-4 border">No</th>
            <th className="py-2 px-4 border">Nama Lengkap</th>
            <th className="py-2 px-4 border">Nama Panggilan</th>
            <th className="py-2 px-4 border">Tanggal Lahir</th>
            <th className="py-2 px-4 border">Kelas</th>
            {isKepsek && <th className="py-2 px-4 border">Aksi</th>}
            </tr>
        </thead>
        <tbody>
            {students.map((s, i) => (
            <tr key={s.id} className="text-center hover:bg-blue-50">
                <td className="border py-2 px-4">{i + 1}</td>
                <td className="border py-2 px-4">{s.fullName}</td>
                <td className="border py-2 px-4">{s.nickname}</td>
                <td className="border py-2 px-4">{s.birthDate}</td>
                <td className="border py-2 px-4">{s.className}</td>
                {isKepsek && (
                <td className="border py-2 px-4 space-x-2">
                    <button
                    onClick={() => onEdit(s)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => onDelete(s.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                    Hapus
                    </button>
                </td>
                )}
            </tr>
            ))}
        </tbody>
        </table>
    );
}
