

"use client";

type Teacher = {
    id: number;
    fullName: string;
    nickname: string;
    birthDate: string;
    subject: string;
    position: string;
};

type Props = {
    data: Teacher;
    setData: (teacher: Teacher) => void;
    onSave: () => void;
    onCancel: () => void;
};

export default function TeacherEditForm({ data, setData, onSave, onCancel }: Props) {
    return (
        <div>
        <input
            type="text"
            className="border p-2 w-full rounded mb-3"
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
        />
        <input
            type="text"
            className="border p-2 w-full rounded mb-3"
            value={data.nickname}
            onChange={(e) => setData({ ...data, nickname: e.target.value })}
        />
        <input
            type="date"
            className="border p-2 w-full rounded mb-3"
            value={data.birthDate}
            onChange={(e) => setData({ ...data, birthDate: e.target.value })}
        />
        <input
            type="text"
            className="border p-2 w-full rounded mb-3"
            value={data.subject}
            onChange={(e) => setData({ ...data, subject: e.target.value })}
        />
        <input
            type="text"
            className="border p-2 w-full rounded mb-3"
            value={data.position}
            onChange={(e) => setData({ ...data, position: e.target.value })}
        />

        <div className="flex justify-end space-x-2">
            <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
            Batal
            </button>
            <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Simpan
            </button>
        </div>
        </div>
    );
}