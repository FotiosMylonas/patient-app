import type { Questionnaire } from "../services/types";


function daysFromNow(offset: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
}

function hoursAgo(hours: number): string {
    const d = new Date();
    d.setHours(d.getHours() - hours);
    return d.toISOString();
}


export const questionnaires: Questionnaire[] = [

    {
        id: "q_001",
        code: "NPRS",
        name: "NPRS — Numeric Pain Rating",
        description: "Rate your current and worst pain over the last week.",
        trajectoryId: "traj_001",
        assignedBy: "Dr. Anna de Vries",
        assignedAt: hoursAgo(48),
        dueDate: daysFromNow(3),
        status: "pending",
        completedAt: ""
    },
    {
        id: "q_002",
        code: "GPE",
        name: "GPE — Global Perceived Effect",
        description: "Compared to when you started treatment, how do you feel now?",
        trajectoryId: "traj_001",
        assignedBy: "Dr. Anna de Vries",
        assignedAt: hoursAgo(24),
        dueDate: daysFromNow(7),
        status: "pending",
        completedAt: ""
    },

    // ---- Completed ----
    {
        id: "q_003",
        code: "NPRS",
        name: "NPRS — Numeric Pain Rating",
        description: "Rate your current and worst pain over the last week.",
        trajectoryId: "traj_001",
        assignedBy: "Dr. Anna de Vries",
        assignedAt: hoursAgo(14 * 24),
        dueDate: daysFromNow(-10),
        status: "completed",
        completedAt: hoursAgo(12 * 24),
        result: { code: "NPRS", label: "Numeric Pain Rating", painNow: 6, painWorst: 8 },
    },
];