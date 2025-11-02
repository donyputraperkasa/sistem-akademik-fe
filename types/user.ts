export type Role = 'KEPALA_SEKOLAH' | 'GURU' | 'SISWA';

export type User = {
    id: number;
    username: string;
    name?: string;
    email?: string;
    role: string;
};