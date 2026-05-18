export interface Patient {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    phone?: string;
    insurer?: string;
    avatarUrl?: string;
}

export interface Practitioner {
    id: string;
    name: string;
    role: string;
    avatarUrl?: string;
    location: string;
}

export interface Appointment {
    id: string;
    date: string;
    startTime: string;
    durationMinutes: number;
    practitioner: Practitioner;
    treatmentType: string;
    treatmentCode: string; //  CO = consult NP = new patient as you have it on the dashboard
    location: string;
    status: AppointmentStatus;
    notes?: string;
}

export type AppointmentStatus =
    | "scheduled"
    | "completed"
    | "cancelled"
    | "no_show";

export interface Exercise {
    id: string;
    name: string;
    description: string;
    sets: number;
    reps: number;
    durationSeconds?: number;
    videoUrl?: string;
    thumbnailUrl?: string;
    prescribedBy: string; //name practinioner
    completedToday: boolean;
    weeklyTarget: number;  //times a week
    weeklyCompleted: number;
}

export interface Message {
    id: string;
    from: "patient" | "practitioner";
    practitionerId?: string;
    text: string;
    timestamp: string; //ISO
    read: boolean;
}

export interface Conversation {
    practitioner: Practitioner;
    messages: Message[];
    lastMessageAt: string;
    unreadCount: number;
}