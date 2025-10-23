export enum AttendanceStatus {
    HADIR = "HADIR",
    TIDAK_HADIR = "TIDAK_HADIR",
}

export interface Attendance {
    id: string;
    status: AttendanceStatus;
    date: string;
    teacher: {
        id: string;
        mapel: string;
        user: {
        id: string;
        username: string;
        };
    };
    student: {
        id: string;
        kelas: string;
        user: {
        id: string;
        username: string;
        };
    };
}