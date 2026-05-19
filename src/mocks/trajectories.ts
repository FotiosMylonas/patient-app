import type { PSKActivity, TreatmentTrajectory } from "../services/types";
import { practitioners } from "./practitioners";

export const trajectories: TreatmentTrajectory[] = [
    {
        id: 'traj_001',
        diagnosis: "Lower back pain",
        treatmentPlan: 'Manual Therapy',
        startDate: "16-05-2026",
        estimatedSessions: 8,
        completedSessions: 3,
        primaryPractitioner: practitioners[0],
        status: "active",
        goal: "Pain-free and returning to running 2x/week."
    }
];

export const PSKActivities: PSKActivity[] = [
    { id: "psk_001", label: "sitting at desk" },
    { id: "psk_002", label: "climb stairs" },
    { id: "psk_003", label: " walking/running" },

];

