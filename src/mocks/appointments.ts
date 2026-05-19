import type { Appointment } from "../services/types";
import { practitioners } from "./practitioners";

// Helper func , date relative to today
function daysFromNow(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
}

export const appointments: Appointment[] = [
    // Upcoming
    {
        id: "appt_001",
        date: daysFromNow(0),
        startTime: "14:30",
        durationMinutes: 20,
        practitioner: practitioners[0],
        treatmentType: "Manuele therapie",
        treatmentCode: "CO",
        location: "Clinic Amsterdam Centrum",
        status: "scheduled",
        notes: "Focus on Lower back mobility",
        trajectoryId: "traj_001"
    },
    {
        id: "appt_002",
        date: daysFromNow(3),
        startTime: "10:00",
        durationMinutes: 30,
        practitioner: practitioners[0],
        treatmentType: "Droge naaldtechniek",
        treatmentCode: "CO",
        location: "Clinic Amsterdam Centrum",
        status: "scheduled",
        trajectoryId: "traj_001"

    },
    {
        id: "appt_003",
        date: daysFromNow(7),
        startTime: "11:15",
        durationMinutes: 20,
        practitioner: practitioners[1],
        treatmentType: "Manuele therapie",
        treatmentCode: "CO",
        location: "Clinic Amsterdam Centrum",
        status: "scheduled",
        trajectoryId: "traj_001"

    },
    {
        id: "appt_004",
        date: daysFromNow(14),
        startTime: "09:30",
        durationMinutes: 60,
        practitioner: practitioners[0],
        treatmentType: "Eindevaluatie",
        treatmentCode: "EV",
        location: "Clinic Amsterdam Centrum",
        status: "scheduled",
        notes: "Final evaluation — bring questionnaires",
        trajectoryId: "traj_001"

    },

    // Past 
    {
        id: "appt_005",
        date: daysFromNow(-3),
        startTime: "14:00",
        durationMinutes: 20,
        practitioner: practitioners[0],
        treatmentType: "Manuele therapie",
        treatmentCode: "CO",
        location: "Clinic Amsterdam Centrum",
        status: "completed",
        trajectoryId: "traj_001"

    },
    {
        id: "appt_006",
        date: daysFromNow(-10),
        startTime: "10:30",
        durationMinutes: 60,
        practitioner: practitioners[0],
        treatmentType: "Intake & onderzoek",
        treatmentCode: "NP",
        location: "Clinic Amsterdam Centrum",
        status: "completed",
        trajectoryId: "traj_001"

    },
];