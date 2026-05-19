import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Patient, Appointment, Exercise, TreatmentTrajectory } from "../services/types";
import { getGreeting } from "../services/utils";
import AppointmentCard from "../components/AppointmentCard";
import TrajectoryCard from "../components/TrajectoryCard";
import PSKCard from "../components/PSKCard";
import { DumbbellIcon } from "../components/TabBar";

export default function Today() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [trajectory, setTrajectory] = useState<TreatmentTrajectory | null>(null);
  
 
  useEffect(() => {
    async function loadData() {
      try {
        const [patientData, allAppointments, exerciseData,trajectoryData] = await Promise.all([
          api.getCurrentPatient(),
          api.getAppointments(),
          api.getExercises(),
          api.getActiveTrajectory(),
        ]);

        setPatient(patientData);
        setExercises(exerciseData);
        setTrajectory(trajectoryData) ;

        // Find next scheduled appointment
        const upcoming = allAppointments.find((a) => a.status === "scheduled");
        setNextAppointment(upcoming ?? null);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse mb-2" />
        <div className="h-5 w-32 bg-bg-secondary rounded animate-pulse" />
      </div>
    );
  }

  const firstName = patient?.name.split(" ")[0] ?? "";
  const completedToday = exercises.filter((ex) => ex.completedToday).length;
  const totalToday = exercises.length;
  const todayIso = new Date().toISOString().split("T")[0]; 


  return (
    <div className="p-6 space-y-6">
      {/* Greeting */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-text-secondary mt-1">
          Here's what's on your plate today.
        </p>
      </header>

      {/* Treatment trajectory */}
      {trajectory && (
        <section>
          <TrajectoryCard trajectory={trajectory} />
        </section>
      )}

      {/* PSK quick check-in */}
         {trajectory && (
         <section>
               <PSKCard todayIso={todayIso} />
          </section>
      )}

      {/* Next appointment */}
      <section>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
          Next appointment
        </h2>
        {nextAppointment ? (
          <AppointmentCard appointment={nextAppointment} variant="highlighted" />
        ) : (
          <div className="bg-bg-secondary border border-border rounded-card p-6 text-center">
            <p className="text-text-secondary">No upcoming appointments</p>
            <button className="mt-3 text-accent text-sm font-medium">
              Schedule one →
            </button>
          </div>
        )}
      </section>

      {/* Today's exercises */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
            Today's exercises
          </h2>
          <Link to="/exercises" className="text-accent text-sm font-medium">
            See all
          </Link>
        </div>

        <div className="bg-bg-secondary border border-border rounded-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold">
                {completedToday}
                <span className="text-text-secondary text-lg font-normal">
                  {" / "}
                  {totalToday}
                </span>
              </p>
              <p className="text-text-secondary text-sm">Exercises completed</p>
            </div>
            <div className="text-3xl">
              {completedToday === totalToday ? "🎉" : <DumbbellIcon/>}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{
                width: totalToday > 0 ? `${(completedToday / totalToday) * 100}%` : "0%",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}