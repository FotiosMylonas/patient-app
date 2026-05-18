import type { Exercise } from "../services/types";


interface Props {
  exercise:Exercise;
  onToggleComplete: (id: string) => void;
}

export default function ExerciseCard ({exercise,onToggleComplete} : Props) {
  const progressPercent =
    exercise.weeklyTarget > 0
      ? (exercise.weeklyCompleted / exercise.weeklyTarget) *100
     :0;

   return (
     <div
        className={`rounded-card p-4 border transition-all active:scale-[0.99] ${
          exercise.completedToday
          ? "bg-bg-secondary border-success/30 opacity-70"
          : "bg-bg-secondary border-border hover:border-text-secondary"
        }`}
    >
        <div className="flex items-start gap-3">
        {/* Checkbox button */}
        <button
          onClick={() => onToggleComplete(exercise.id)}
            className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center transition-colors active:scale-95 ${            exercise.completedToday
              ? "bg-success border-success text-white"
              : "border-border hover:border-accent"
          }`}
          aria-label={
            exercise.completedToday ? "Mark as not done" : "Mark as done"
          }
        >
          {exercise.completedToday && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

       
        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              exercise.completedToday ? "line-through text-text-secondary" : ""
            }`}
          >
            {exercise.name}
          </h3>
          <p className="text-text-secondary text-xs mt-0.5">
            {exercise.sets} sets · {exercise.reps} reps
          </p>
          <p className="text-text-secondary text-sm mt-2 leading-relaxed">
            {exercise.description}
          </p>

          
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-secondary">This week</span>
              <span className="text-text-secondary">
                {exercise.weeklyCompleted} / {exercise.weeklyTarget}
              </span>
            </div>
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>

          <p className="text-text-secondary text-xs mt-3">
            Prescribed by {exercise.prescribedBy}
          </p>
        </div>
      </div>
    </div>
  );
}