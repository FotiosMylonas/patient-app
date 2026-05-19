import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Appointment, TreatmentTrajectory } from "../services/types";
import AppointmentCard from "../components/AppointmentCard";
import TrajectoryCard from "../components/TrajectoryCard";


export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [trajectory, setTrajectory] = useState<TreatmentTrajectory | null>(null);


  useEffect(() => {
    async function loadData() {
      try {
        const [appts, traj] = await Promise.all([
          api.getAppointments(),
          api.getActiveTrajectory(),
        ]);
        setAppointments(appts);
        setTrajectory(traj);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Split by status
  const upcoming = appointments.filter((a) => a.status === "scheduled");
  const past = appointments.filter((a) => a.status !== "scheduled");

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-bg-secondary rounded-card animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-text-secondary mt-1">
          {upcoming.length > 0
            ? `${upcoming.length} upcoming`
            : "Nothing scheduled"}
        </p>
      </header>

      {/* Trajectory context */}
      {trajectory && <TrajectoryCard trajectory={trajectory} variant="compact" />}

      {/* Upcoming section */}
      <section>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
          Upcoming
        </h2>

        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        ) : (
          <div className="bg-bg-secondary border border-border rounded-card p-6 text-center">
            <p className="text-text-secondary mb-3">
              You have no upcoming appointments.
            </p>
            <button className="text-accent text-sm font-medium">
              Schedule one →
            </button>
          </div>
        )}
      </section>

      {/* history */}
      {past.length > 0 && (
        <section>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors"
          >
            <span>{showHistory ? "▾" : "▸"}</span>
            History ({past.length})
          </button>

          {showHistory && (
            <div className="space-y-3 mt-3">
              {past.map((appointment) => (
                <div key={appointment.id} className="opacity-60">
                  <AppointmentCard appointment={appointment} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}