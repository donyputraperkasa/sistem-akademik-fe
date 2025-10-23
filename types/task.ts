export enum TaskStatus {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    GRADED = "GRADED",
}

export interface UserSummary {
    id: string;
    username: string;
    role: "GURU" | "SISWA" | "KEPALA_SEKOLAH";
}

export interface StudentSummary {
    id: string;
    user: UserSummary;
    kelas: string;
}

export interface TeacherSummary {
    id: string;
    user: UserSummary;
    mapel: string;
}

export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    user: UserSummary;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: TaskStatus;
    createdAt: string;
    teacher: TeacherSummary;
    student: StudentSummary;
    comments?: Comment[];
}