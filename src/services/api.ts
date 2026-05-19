import { currentUser } from "../mocks/user";
import { appointments } from "../mocks/appointments";
import { exercises } from "../mocks/exercises";
import { conversations } from "../mocks/messages";
import type {
    Patient,
    Appointment,
    Exercise,
    Conversation,
    TreatmentTrajectory,
    PSKActivity,
    PSKEntry,
    Questionnaire,
    QuestionnaireResult,
    questionnaireStatus
} from "./types";
import { trajectories, PSKActivities } from "../mocks/trajectories";
import { questionnaires } from "../mocks/questionnaires";



// latency so the UI behaves like production
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Patient API client.
 *
 * Currently backed by mock data. In production each method would
 * call the corresponding backend endpoint with the patient's
 * JWT in the Authorization header.
 */

const PSK_STORAGE_KEY = "patient_psk_entries";

function loadPSKHistory(): PSKEntry[] {
    try {
        const raw = localStorage.getItem(PSK_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function savePSKHistory(entries: PSKEntry[]): void {
    localStorage.setItem(PSK_STORAGE_KEY, JSON.stringify(entries));
}

const QUESTIONNAIRE_STORAGE_KEY = "patient_questionnaire_results";

function loadQuestionnaireResults(): Record<string, { completedAt: string; result: QuestionnaireResult }> {
    try {
        const raw = localStorage.getItem(QUESTIONNAIRE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveQuestionnaireResults(
    results: Record<string, { completedAt: string; result: QuestionnaireResult }>
): void {
    localStorage.setItem(QUESTIONNAIRE_STORAGE_KEY, JSON.stringify(results));
}



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


    /**
   * GET /api/patients/me/trajectories
   *
   * Returns the patient's treatment trajectories — the multi-appointment
   * care arcs that group related visits, exercises, and questionnaires.
   */
    async getTrajectories(): Promise<TreatmentTrajectory[]> {
        await delay(300);
        return trajectories;
    },

    /**
   * GET /api/patients/me/trajectories/active
   *
   * Returns the patient's currently-active trajectory, if any.
   */
    async getActiveTrajectory(): Promise<TreatmentTrajectory | null> {
        await delay(200);
        return trajectories.find((t) => t.status === "active") ?? null;
    },


    /**
    * GET /api/patients/me/psk/activities
    *
    * Returns the patient-specific activities tracked for this
    * patient's active trajectory.
    */
    async getPSKActivities(): Promise<PSKActivity[]> {
        await delay(150);
        return PSKActivities;
    },

    /**
     * GET /api/patients/me/psk/entries
     *
     * Returns all PSK entries (history of daily check-ins).
     * Locally persisted to localStorage; would be backed by the
     * database in production.
     */
    async getPSKEntries(): Promise<PSKEntry[]> {
        await delay(150);
        return loadPSKHistory();
    },

    /**
     * POST /api/patients/me/psk/entries
     *
     * Submits today's PSK check-in. Replaces an existing entry
     * for the same date if one exists (idempotent for today).
     */
    async submitPSKEntry(entry: PSKEntry): Promise<void> {
        await delay(300);
        const existing = loadPSKHistory();
        const withoutToday = existing.filter((e) => e.date !== entry.date);
        savePSKHistory([...withoutToday, entry]);
    },


    /**
   * GET /api/patients/me/questionnaires
   *
   * Returns all assigned questionnaires. Merges base questionnaires
   * (from clinician's assignment) with completion data persisted locally.
   */

    async getQuestionnaires(): Promise<Questionnaire[]> {
        await delay(250);
        const completions = loadQuestionnaireResults();

        return questionnaires.map((q) => {
            const completion = completions[q.id];
            if (completion) {
                return {
                    ...q,
                    status: "completed" as const,
                    completedAt: completion.completedAt,
                    result: completion.result,
                };
            }
            return q;
        });
    },

    /**
     * GET /api/patients/me/questionnaires/:id
     */
    async getQuestionnaire(id: string): Promise<Questionnaire | undefined> {
        await delay(150);
        const all = await this.getQuestionnaires();
        return all.find((q) => q.id === id);
    },

    /**
     * POST /api/patients/me/questionnaires/:id/submit
     *
     * Submits a completed questionnaire. Idempotent — re-submitting
     * the same questionnaire updates the existing record.
     */
    async submitQuestionnaire(
        id: string,
        result: QuestionnaireResult
    ): Promise<void> {
        await delay(400);
        const completions = loadQuestionnaireResults();
        completions[id] = {
            completedAt: new Date().toISOString(),
            result,
        };
        saveQuestionnaireResults(completions);
    },


    /**
   * POST /api/patients/me/demo/reset
   *
   * Demo-only endpoint: clears all locally persisted patient state
   * (questionnaire completions, PSK entries). Real backend
   * obviously has no such endpoint.
   */
    async resetDemoData(): Promise<void> {
        await delay(200);
        localStorage.removeItem(PSK_STORAGE_KEY);
        localStorage.removeItem(QUESTIONNAIRE_STORAGE_KEY);
    },

};