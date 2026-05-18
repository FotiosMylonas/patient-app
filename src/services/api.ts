import { currentUser } from "../mocks/user";
import { appointments } from "../mocks/appointments";
import { exercises } from "../mocks/exercises";
import { conversations } from "../mocks/messages";
import type {
    Patient,
    Appointment,
    Exercise,
    Conversation,
} from "./types";

// latency so the UI behaves like production
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Patient API client.
 *
 * Currently backed by mock data. In production each method would
 * call the corresponding backend endpoint with the patient's
 * JWT in the Authorization header.
 */

export const api = {
    /**
     * GET /api/patients/me
     *
     * Returns the authenticated patient's profile.
     */
    async getCurrentPatient(): Promise<Patient> {
        await delay(300);
        return currentUser;
    },

    /**
     * GET /api/patients/me/appointments
     *
     * Returns all appointments (scheduled + history) for the patient,
     * sorted chronologically. In production, would support query
     * params for filtering by status and date range.
     */
    async getAppointments(): Promise<Appointment[]> {
        await delay(400);
        return [...appointments].sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date);
            if (dateCompare !== 0) return dateCompare;
            return a.startTime.localeCompare(b.startTime);
        });
    },

    /**
     * GET /api/patients/me/appointments/:id
     */
    async getAppointment(id: string): Promise<Appointment | undefined> {
        await delay(200);
        return appointments.find((a) => a.id === id);
    },

    /**
     * POST /api/patients/me/appointments/:id/cancel
     *
     * In production this would also trigger a notification to the
     * practitioner and free up the slot in the clinic calendar.
     */
    async cancelAppointment(id: string): Promise<void> {
        await delay(500);
        const appt = appointments.find((a) => a.id === id);
        if (appt) appt.status = "cancelled";
    },

    /**
     * GET /api/patients/me/exercises
     *
     * Returns the patient's prescribed home exercises.
     * Could be backed by the Physitrack integration in production.
     */
    async getExercises(): Promise<Exercise[]> {
        await delay(400);
        return exercises;
    },

    /**
     * POST /api/patients/me/exercises/:id/complete
     */
    async markExerciseComplete(id: string): Promise<void> {
        await delay(200);
        const ex = exercises.find((e) => e.id === id);
        if (ex) {
            ex.completedToday = true;
            ex.weeklyCompleted += 1;
        }
    },

    /**
     * GET /api/patients/me/conversations
     *
     * Returns all conversation threads with practitioners.
     */
    async getConversations(): Promise<Conversation[]> {
        await delay(300);
        return conversations;
    },
};