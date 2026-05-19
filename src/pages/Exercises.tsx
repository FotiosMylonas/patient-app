import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Exercise, TreatmentTrajectory } from "../services/types";
import ExerciseCard from "../components/ExerciseCard";
import TrajectoryCard from "../components/TrajectoryCard";



export default function Exercises() {
  const [exercises,setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
    const [trajectory, setTrajectory] = useState< TreatmentTrajectory | null>(null);


   useEffect(() => {
    async function loadData() {
      try {
        const [exerciseData, trajectoryData] = await Promise.all([
          api.getExercises(),
          api.getActiveTrajectory(),
        ]);
        setExercises(exerciseData);
        setTrajectory(trajectoryData);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
 
  async function handleToggleComplete(id: string) {
    const exercise = exercises.find((ex) => ex.id === id);
    if (!exercise || exercise.completedToday) return;

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, completedToday: true, weeklyCompleted: ex.weeklyCompleted + 1 }
          : ex
      )
    );

    try {
      await api.markExerciseComplete(id);
    } catch (error) {
      console.error("Failed to mark complete:", error);
      //  on failure we can revert
      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === id
            ? { ...ex, completedToday: false, weeklyCompleted: ex.weeklyCompleted - 1 }
            : ex
        )
      );
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-bg-secondary rounded-card animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
    
    const totalToday = exercises.length;
    const completedToday = exercises.filter((ex) => ex.completedToday).length;
    const allDone = completedToday === totalToday && totalToday > 0;
    const pending = exercises.filter((ex) => !ex.completedToday);
    const completed = exercises.filter((ex) => ex.completedToday);

    return (
    <div className="p-6 space-y-6">
      
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
        <p className="text-text-secondary mt-1">
          {allDone
            ? "All done for today — great job!"
            : `${completedToday} of ${totalToday} completed today`}
        </p>

        {/* progress bar */}
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{
              width: totalToday > 0 ? `${(completedToday / totalToday) * 100}%` : "0%",
            }}
          />
        </div>

      </header>

      {/* Trajectory context */}
      {trajectory && <TrajectoryCard trajectory={trajectory} variant="compact" />}

      {/* when pending */}
      {pending.length > 0 && (

        <section>
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            To do
          </h2>

          <div className="space-y-3">
            {pending.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>

        </section>
      )}

      {/* when completed*/}
      {completed.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            Completed today
          </h2>
          <div className="space-y-3">
            {completed.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        </section>
      )}

      
      {exercises.length === 0 && (
        <div className="bg-bg-secondary border border-border rounded-card p-6 text-center">
          <p className="text-text-secondary">
            No exercises prescribed yet. Check back after your next appointment.
          </p>
        </div>
      )}
    </div>
  );
}
