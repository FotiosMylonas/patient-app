import type { Exercise } from "../services/types";

export const exercises: Exercise[] = [
    {
        id: "ex_001",
        name: "Bird dog",
        description:
            "Op handen en knieën, strek tegelijk de rechterarm en linkerbeen. Houd 5 seconden vast, wissel van zijde.",
        sets: 3,
        reps: 10,
        prescribedBy: "Dr. Anna de Vries",
        completedToday: false,
        weeklyTarget: 5,
        weeklyCompleted: 3,
    },
    {
        id: "ex_002",
        name: "Cat-cow stretch",
        description:
            "Wissel langzaam tussen een holle en bolle rug op handen en knieën. Adem rustig door.",
        sets: 2,
        reps: 12,
        prescribedBy: "Dr. Anna de Vries",
        completedToday: true,
        weeklyTarget: 7,
        weeklyCompleted: 5,
    },
    {
        id: "ex_003",
        name: "Glute bridge",
        description:
            "Lig op je rug met gebogen knieën. Til de heupen op tot een rechte lijn, knijp de billen samen.",
        sets: 3,
        reps: 15,
        prescribedBy: "Dr. Anna de Vries",
        completedToday: false,
        weeklyTarget: 5,
        weeklyCompleted: 2,
    },
    {
        id: "ex_004",
        name: "Dead bug",
        description:
            "Lig op je rug, armen omhoog, knieën in een hoek van 90 graden. Strek tegelijk tegenovergestelde arm en been.",
        sets: 3,
        reps: 8,
        prescribedBy: "Dr. Anna de Vries",
        completedToday: false,
        weeklyTarget: 4,
        weeklyCompleted: 2,
    },
];