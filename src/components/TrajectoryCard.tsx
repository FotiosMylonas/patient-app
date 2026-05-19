import type { TreatmentTrajectory } from "../services/types";

interface Props {
  trajectory: TreatmentTrajectory;
  variant?: "default" | "compact";
}

export default function TrajectoryCard({ trajectory, variant = "default" }: Props) {
  const progressPercent =
    trajectory.estimatedSessions > 0
      ? (trajectory.completedSessions / trajectory.estimatedSessions) * 100
      : 0;

     if (variant === "compact") {
    return (
      <div className="bg-bg-secondary border border-border rounded-card p-4">
        <div className="flex items-baseline justify-between mb-2">
          <p className="font-medium">{trajectory.diagnosis}</p>
          <span className="text-text-secondary text-xs">
            {trajectory.completedSessions} of {trajectory.estimatedSessions} visits
          </span>
        </div>
        <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
            Treatment trajectory
          </p>
          <h3 className="font-semibold text-lg leading-tight">
            {trajectory.diagnosis}
          </h3>
          <p className="text-text-secondary text-sm mt-0.5">
            {trajectory.treatmentPlan}
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded bg-success/15 text-success">
          Active
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between text-sm mb-1.5">
          <span className="text-text-secondary">Progress</span>
          <span className="font-medium">
            Visit {trajectory.completedSessions} of {trajectory.estimatedSessions}
          </span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Goal */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
          Your goal
        </p>
        <p className="text-sm leading-relaxed">{trajectory.goal}</p>
      </div>

      {/* Practitioner */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-sm font-medium">
          {trajectory.primaryPractitioner.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">
            {trajectory.primaryPractitioner.name}
          </p>
          <p className="text-text-secondary text-xs">
            {trajectory.primaryPractitioner.role}
          </p>
        </div>
      </div>
    </div>
  );

}