import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Questionnaire } from "../services/types";
import { getDuePhrase } from "../services/utils";

export default function Questionnaires() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await api.getQuestionnaires();
      setQuestionnaires(data);
    } catch (error) {
      console.error("Failed to load questionnaires:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      "Reset all demo data? This clears questionnaire completions and daily check-ins."
    );
    if (!confirmed) return;

    setResetting(true);
    try {
      await api.resetDemoData();
      await loadData();
    } finally {
      setResetting(false);
    }
  }

  const pending = questionnaires.filter((q) => q.status === "pending");
  const completed = questionnaires.filter((q) => q.status === "completed");

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-bg-secondary rounded-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header with reset button */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Questionnaires</h1>
          <p className="text-text-secondary mt-1">
            {pending.length} pending · {completed.length} completed
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-xs font-medium px-3 py-2 rounded-button border border-border hover:border-text-secondary transition-colors disabled:opacity-50"
          title="Reset demo data — clears all questionnaire completions and PSK check-ins"
        >
          <ResetIcon />
          <span>{resetting ? "Resetting..." : "Reset demo"}</span>
        </button>
      </header>

      {/* Pending */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            To complete
          </h2>
          <div className="space-y-3">
            {pending.map((q) => (
              <PendingCard key={q.id} questionnaire={q} />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
            Completed
          </h2>
          <div className="space-y-3">
            {completed.map((q) => (
              <CompletedCard key={q.id} questionnaire={q} />
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {questionnaires.length === 0 && (
        <div className="bg-bg-secondary border border-border rounded-card p-6 text-center">
          <p className="text-text-secondary">
            No questionnaires yet. Your practitioner will assign these as part of your trajectory.
          </p>
        </div>
      )}
    </div>
  );
}

// Sub-components

function ResetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function PendingCard({ questionnaire }: { questionnaire: Questionnaire }) {
  return (
    <Link
      to={`/questionnaires/${questionnaire.id}`}
      className="block bg-bg-secondary border border-accent/30 hover:border-accent/60 rounded-card p-4 transition-all active:scale-[0.99]"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium px-2 py-1 rounded bg-accent/15 text-accent">
          {questionnaire.code}
        </span>
        <span className="text-xs text-text-secondary">
          {getDuePhrase(questionnaire.dueDate)}
        </span>
      </div>
      <h3 className="font-medium leading-tight">{questionnaire.name}</h3>
      <p className="text-text-secondary text-sm mt-1.5">
        {questionnaire.description}
      </p>
      <p className="text-text-secondary text-xs mt-3">
        Assigned by {questionnaire.assignedBy}
      </p>
      <p className="text-accent text-sm font-medium mt-3">Start →</p>
    </Link>
  );
}

function CompletedCard({ questionnaire }: { questionnaire: Questionnaire }) {
  let summary = "Completed";
  const r = questionnaire.result;
  if (r?.code === "PSK") summary = `Average: ${r.average.toFixed(1)} / 10`;
  if (r?.code === "NPRS") summary = `Pain now: ${r.painNow} / 10`;
  if (r?.code === "GPE") summary = r.label;

  return (
    <div className="bg-bg-secondary border border-border rounded-card p-4 opacity-80">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium px-2 py-1 rounded bg-success/15 text-success">
          ✓ {questionnaire.code}
        </span>
      </div>
      <h3 className="font-medium leading-tight">{questionnaire.name}</h3>
      <p className="text-text-secondary text-sm mt-1.5">{summary}</p>
    </div>
  );
}