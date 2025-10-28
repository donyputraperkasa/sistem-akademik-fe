// types/announcement.ts

export type Announcement = {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO string dari database
    createdBy?: string;
    createdByUser?: {
        username: string;
        role: "KEPALA_SEKOLAH" | "GURU" | "SISWA";
    };
};