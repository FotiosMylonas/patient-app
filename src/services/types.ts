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
    trajectoryId?: string; // which traj this belogs to
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

export interface TreatmentTrajectory {
    id: string;
    diagnosis: string; //ex. Lower back pain
    treatmentPlan: string; //ex manual therapy
    startDate: string;          // ISO
    estimatedSessions: number;
    completedSessions: number;
    primaryPractitioner: Practitioner;
    status: "active" | "completed" | "paused";
    goal: string;
}

export interface PSKActivity {
    id: string;
    label: string; // ex sit to stand 

}

export interface PSKEntry {
    date: string;
    scores: Record<string, number>;


}

export type QuestionnaireCode = "PSK" | "NPRS" | "GPE";
export type questionnaireStatus = "pending" | "completed";

export interface Questionnaire {
    id: string;
    code: QuestionnaireCode;
    name: string;
    description: string;
    trajectoryId?: string;
    assignedBy: string;
    assignedAt: string;
    dueDate: string;
    status: questionnaireStatus;
    completedAt: string;
    result?: QuestionnaireResult;
}

export type QuestionnaireResult =
    | { code: "PSK"; scores: Record<string, number>; average: number }
    | { code: "NPRS"; painNow: number; painWorst: number; label: string }
    | { code: "GPE"; rating: number; label: string };
