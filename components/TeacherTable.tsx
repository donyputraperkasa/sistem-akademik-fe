"use client";

type Teacher = {
  id: number;
  fullName: string;
  nickname: string;
  birthDate: string;
  subject: string;
  position: string;
};

type TeacherTableProps = {
  teachers: Teacher[];
  isKepsek: boolean;
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
};

export default function TeacherTable({ teachers, isKepsek, onEdit, onDelete }: TeacherTableProps) {
  return (
    <table className="min-w-full border bg-white rounded-lg shadow-sm">
      <thead className="bg-blue-100">
        <tr>
          <th className="py-2 px-4 border">No</th>
          <th className="py-2 px-4 border">Nama Lengkap</th>
          <th className="py-2 px-4 border">Nama Panggilan</th>
          <th className="py-2 px-4 border">Tanggal Lahir</th>
          <th className="py-2 px-4 border">Mata Pelajaran</th>
          <th className="py-2 px-4 border">Jabatan Lain</th>
          {isKepsek && <th className="py-2 px-4 border">Aksi</th>}
        </tr>
      </thead>
      <tbody>
        {teachers.map((t, i) => (
          <tr key={t.id} className="text-center hover:bg-blue-50">
            <td className="border py-2 px-4">{i + 1}</td>
            <td className="border py-2 px-4">{t.fullName}</td>
            <td className="border py-2 px-4">{t.nickname}</td>
            <td className="border py-2 px-4">{t.birthDate}</td>
            <td className="border py-2 px-4">{t.subject}</td>
            <td className="border py-2 px-4">{t.position}</td>
            {isKepsek && (
              <td className="border py-2 px-4 space-x-2">
                <button
                  onClick={() => onEdit(t)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
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
