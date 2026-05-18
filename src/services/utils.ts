/**
 returns a dutch greeting based on the time of the day 
 
 */

export function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 6) return "Goedenacht";
    if (hour < 12) return "Goedemorgen";
    if (hour < 18) return "Goedemiddag";
    return "Goedenavond";
}

/**
 * ISO date like "2026-05-15" becomes "Friday, May 12".
 */

export function formatDateLong(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
}


/**
 * Returns relative time --> like "in 2 hours" or "tmr" or "in 3 days".
 */
export function getRelativeTime(isoDate: string, startTime: string): string {
    const target = new Date(`${isoDate}T${startTime}`);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Starting soon";
    if (diffHours < 24) return `In ${diffHours} hour${diffHours === 1 ? "" : "s"}`;
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 14) return "Next week";
    return formatDateLong(isoDate);
}

/**
 * Returns true if an appointment is happening today
 */
export function isToday(isoDate: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    return isoDate === today;
}


/**
 * Returns a short relative time like "2h", "3d", "Just now".
 * Used for chat timestamps.
 */
export function getShortRelativeTime(isoDateTime: string): string {
    const then = new Date(isoDateTime);
    const now = new Date();
    const diffMs = now.getTime() - then.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}