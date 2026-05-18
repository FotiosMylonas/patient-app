import { Link } from "react-router-dom";
import type { Appointment } from "../services/types";
import { formatDateLong, getRelativeTime, isToday } from "../services/utils";

interface Props{
    appointment: Appointment;
    variant?: "default" | "highlighted";
}

export default function AppointmentCard({ appointment, variant = "default" }: Props) {
  const isHighlighted = variant === "highlighted";
  const today = isToday(appointment.date);

   return (
    <Link
      to={`/appointments/${appointment.id}`}
      className={`block rounded-card p-4 transition-all active:scale-[0.98] ${
        isHighlighted
          ? "bg-bg-secondary border border-accent/40 hover:border-accent/60"
          : "bg-bg-secondary border border-border hover:border-text-secondary"
      }`}
    >
      {/* Top row ---> time + relative label */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{appointment.startTime}</span>
          <span className="text-text-secondary text-sm">
            {appointment.durationMinutes} min
          </span>
        </div>
        {today ? (
          <span className="text-xs font-medium px-2 py-1 rounded bg-accent/20 text-accent">
            Today
          </span>
        ) : (
          <span className="text-xs text-text-secondary">
            {getRelativeTime(appointment.date, appointment.startTime)}
          </span>
        )}
      </div>

      {/* treatment + practitioner */}
      <div className="space-y-1">
        <p className="font-medium">{appointment.treatmentType}</p>
        <p className="text-text-secondary text-sm">
          {appointment.practitioner.name} · {appointment.practitioner.role}
        </p>
        <p className="text-text-secondary text-xs">{appointment.location}</p>
      </div>

      {/* Date  if not today) */}
      {!today && (
        <p className="text-text-secondary text-xs mt-3 pt-3 border-t border-border">
          {formatDateLong(appointment.date)}
        </p>
      )}
    </Link>
  );
}