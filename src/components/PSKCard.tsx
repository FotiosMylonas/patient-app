import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { PSKActivity, PSKEntry } from "../services/types";

interface Props {
  todayIso: string; 
}

export default function PSKCard ({todayIso} : Props) {
  const [activities, setActivities] = useState<PSKActivity[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [acts,etnries] = await Promise.all([
            api.getPSKActivities() ,
            api.getPSKEntries() ,
        ]);


        setActivities(acts);
        
        const todayEntry = etnries.find((e) => e.date === todayIso);

        if (todayEntry) {
            setScores(todayEntry.scores);
            setAlreadySubmitted(true);
        } else {
            // initialize the score at zero for each act
            const initial : Record<string, number> = {};
            acts.forEach((a) => (initial[a.id] = 0)) ;
            setScores (initial);

        }

      } catch (error) {
        console.error("Failed to load PSK:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [todayIso]);
function handleScoreChange(activityId: string, value: number) {
    setScores((prev) => ({ ...prev, [activityId]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const entry: PSKEntry = { date: todayIso, scores };
      await api.submitPSKEntry(entry);
      setAlreadySubmitted(true);
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-bg-secondary border border-border rounded-card p-5 h-64 animate-pulse" />
    );
  }

  // ---- Submitted -- summary also
  if (alreadySubmitted) {
    const average =
      Object.values(scores).reduce((s, v) => s + v, 0) /
      (Object.values(scores).length || 1);

    return (
      <div className="bg-bg-secondary border border-success/30 rounded-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
              Today's check-in
            </p>
            <p className="font-medium">Submitted ✓</p>
            <p className="text-text-secondary text-sm mt-1">
              Average score: {average.toFixed(1)} / 10
            </p>
          </div>
          <button
            onClick={() => setAlreadySubmitted(false)}
            className="text-accent text-sm font-medium"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // ---- Active --> sliders
  return (
    <div className="bg-bg-secondary border border-border rounded-card p-5">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">
          Quick check-in (PSK)
        </p>
        <p className="font-medium">Rate today's pain or limitation</p>
        <p className="text-text-secondary text-xs mt-1">
          0 = no problem · 10 = cannot perform
        </p>
      </header>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id}>
            <div className="flex items-baseline justify-between mb-1.5">
              <label
                htmlFor={`psk-${activity.id}`}
                className="text-sm font-medium"
              >
                {activity.label}
              </label>
              <span className="text-lg font-semibold text-accent tabular-nums w-6 text-right">
                {scores[activity.id] ?? 0}
              </span>
            </div>
            <input
              id={`psk-${activity.id}`}
              type="range"
              min="0"
              max="10"
              step="1"
              value={scores[activity.id] ?? 0}
              onChange={(e) =>
                handleScoreChange(activity.id, parseInt(e.target.value, 10))
              }
              className="w-full accent-accent"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full mt-5 bg-accent hover:bg-accent-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-button transition-colors"
      >
        {submitting ? "Saving..." : "Save my check-in"}
      </button>
    </div>
  );
}
