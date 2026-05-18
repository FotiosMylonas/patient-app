import type { Conversation } from "../services/types";
import { practitioners } from "./practitioners";

function hoursAgo(hours: number): string {
    const d = new Date();
    d.setHours(d.getHours() - hours);
    return d.toISOString();
}

export const conversations: Conversation[] = [
    {
        practitioner: practitioners[0],
        lastMessageAt: hoursAgo(2),
        unreadCount: 1,
        messages: [
            {
                id: "msg_001",
                from: "practitioner",
                practitionerId: practitioners[0].id,
                text: "Hoi fotis, zou je de oefeningen van vandaag voor mijn volgende afspraak nog kunnen afronden? Dan kunnen we kijken hoe het gaat.",
                timestamp: hoursAgo(26),
                read: true,
            },
            {
                id: "msg_002",
                from: "patient",
                text: "Ja zeker! Ik heb cat-cow al gedaan, ga zo verder met de rest.",
                timestamp: hoursAgo(20),
                read: true,
            },
            {
                id: "msg_003",
                from: "practitioner",
                practitionerId: practitioners[0].id,
                text: "Top! Laat me weten als je vragen hebt over de bird dog houding.",
                timestamp: hoursAgo(2),
                read: false,
            },
        ],
    },
];