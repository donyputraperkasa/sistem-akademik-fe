export type Role = 'KEPALA_SEKOLAH' | 'GURU' | 'SISWA';

export interface User {
    id: string;
    username: string;
    role: Role;
}
