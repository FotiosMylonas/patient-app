import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { Appointment } from "../services/types";
import { formatDateLong, getRelativeTime, isToday } from "../services/utils";

export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await api.getAppointment(id);
        setAppointment(data ?? null);
      } catch (error) {
        console.error("Failed to load appointment:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function handleCancel() {
    if (!appointment) return;
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      await api.cancelAppointment(appointment.id);
      setAppointment({ ...appointment, status: "cancelled" });
    } catch (error) {
      console.error("Failed to cancel:", error);
    } finally {
      setCancelling(false);
    }
  }

  // loading 
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-32 bg-bg-secondary rounded animate-pulse" />
        <div className="h-40 bg-bg-secondary rounded-card animate-pulse" />
      </div>
    );
  }

  // not found 
  if (!appointment) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-secondary mb-4">
          This appointment could not be found.
        </p>
        <button
          onClick={() => navigate("/appointments")}
          className="text-accent text-sm font-medium"
        >
          ← Back to appointments
        </button>
      </div>
    );
  }

  const isCancelled = appointment.status === "cancelled";
  const isCompleted = appointment.status === "completed";
  const isPast = isCompleted || isCancelled;
  const today = isToday(appointment.date);

  return (
    <div className="p-6 space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="text-text-secondary hover:text-text-primary text-sm font-medium transition-colors"
      >
        ← Back
      </button>

      {/* Status banner */}
      {isCancelled && (
<div className="bg-red-500/10 border border-red-500/30 rounded-card p-3 text-red-500 text-sm">          This appointment has been cancelled.
        </div>
      )}
      {isCompleted && (
        <div className="bg-success/10 border border-success/30 rounded-card p-3 text-success text-sm">
          This appointment has been completed.
        </div>
      )}

      {/* Header — date & time */}
      <header className="space-y-1">
        <p className="text-text-secondary text-sm">
          {today ? "Today" : getRelativeTime(appointment.date, appointment.startTime)}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {appointment.startTime}
        </h1>
        <p className="text-text-secondary">
          {formatDateLong(appointment.date)} · {appointment.durationMinutes} minutes
        </p>
      </header>

      {/* Treatment info */}
      <section className="bg-bg-secondary border border-border rounded-card p-4 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
            Treatment
          </p>
          <p className="font-medium">{appointment.treatmentType}</p>
          <p className="text-text-secondary text-xs mt-1">
            Code: {appointment.treatmentCode}
          </p>
        </div>

        {appointment.notes && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
              Notes
            </p>
            <p className="text-sm">{appointment.notes}</p>
          </div>
        )}
      </section>

      {/* Practitioner */}
      <section className="bg-bg-secondary border border-border rounded-card p-4">
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-3">
          Practitioner
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-lg font-medium">
            {appointment.practitioner.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{appointment.practitioner.name}</p>
            <p className="text-text-secondary text-sm">
              {appointment.practitioner.role}
            </p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-bg-secondary border border-border rounded-card p-4">
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
          Location
        </p>
        <p className="font-medium">{appointment.location}</p>
        <button className="text-accent text-sm font-medium mt-2">
          Get directions →
        </button>
      </section>

      {/* Actions */}
      {!isPast && (
        <section className="space-y-3 pt-2">
          <button className="w-full bg-bg-secondary hover:bg-bg-tertiary border border-border transition-colors text-text-primary font-medium py-3 rounded-button">
            Reschedule
          </button>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-bg-secondary hover:bg-red-500/10 hover:border-red-500/30 border border-border transition-colors text-red-500 font-medium py-3 rounded-button disabled:opacity-50"          >
            {cancelling ? "Cancelling..." : "Cancel appointment"}
          </button>
        </section>
      )}
    </div>
  );
}