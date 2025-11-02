"use client";

import { useState } from "react";

type Teacher = {
    id: number;
    fullName: string;
    nickname: string;
    birthDate: string;
    subject: string;
    position: string;
};

type TeacherFormProps = {
    teachers: Teacher[];
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
};

export default function TeacherForm({ teachers, setTeachers }: TeacherFormProps) {
    const [form, setForm] = useState({
        fullName: "",
        nickname: "",
        birthDate: "",
        subject: "",
        position: "",
    });

    const handleAdd = () => {
        if (!form.fullName || !form.nickname || !form.birthDate || !form.subject || !form.position)
        return;
        const newTeacher = { id: teachers.length + 1, ...form };
        setTeachers([...teachers, newTeacher]);
        setForm({ fullName: "", nickname: "", birthDate: "", subject: "", position: "" });
    };

    return (
        <div className="mb-6 bg-blue-50 p-4 rounded-lg shadow-sm">
        <div className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="font-medium mb-2">Tambah Guru Baru</h2>
            <div className="grid grid-cols-5 gap-3">
            <input
                type="text"
                placeholder="Nama Lengkap"
                className="border rounded-md p-2"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
                type="text"
                placeholder="Nama Panggilan"
                className="border rounded-md p-2"
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
            <input
                type="date"
                className="border rounded-md p-2"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
            <input
                type="text"
                placeholder="Mata Pelajaran"
                className="border rounded-md p-2"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <input
                type="text"
                placeholder="Jabatan Lain"
                className="border rounded-md p-2"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
            </div>
        </div>
        <button
            onClick={handleAdd}
            className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
            Tambah
        </button>
        </div>
    );
}
