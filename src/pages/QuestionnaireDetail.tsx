import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import type { Questionnaire, QuestionnaireResult } from "../services/types";

const GPE_OPTIONS = [
  { value: 1, label: "Much worse" },
  { value: 2, label: "Worse" },
  { value: 3, label: "Slightly worse" },
  { value: 4, label: "No change" },
  { value: 5, label: "Slightly better" },
  { value: 6, label: "Better" },
  { value: 7, label: "Much better" },
];

export default function QuestionnaireDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [painNow, setPainNow] = useState(0);
  const [painWorst, setPainWorst] = useState(0);
  const [gpeRating, setGpeRating] = useState<number | null>(null);

useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const data = await api.getQuestionnaire(id);
        setQuestionnaire(data ?? null);
      } catch (error) {
        console.error("Failed to load:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

   async function handleSubmit() {
    if (!questionnaire) return;
    setSubmitting(true);

    let result: QuestionnaireResult;

    if (questionnaire.code === "NPRS") {
      result = { code: "NPRS", painNow, painWorst, label: "" };
    } else if (questionnaire.code === "GPE") {
      const option = GPE_OPTIONS.find((o) => o.value === gpeRating);
      if (!option) {
        setSubmitting(false);
        return;
      }
      result = { code: "GPE", rating: option.value, label: option.label };
    } else {
      // PSK not implemented here 
      setSubmitting(false);
      return;
    }

    try {
      await api.submitQuestionnaire(questionnaire.id, result);
      navigate("/questionnaires");
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-6 w-32 bg-bg-secondary rounded animate-pulse" />
        <div className="h-40 bg-bg-secondary rounded-card animate-pulse" />
      </div>
    );
  }

  if (!questionnaire) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-secondary mb-4">Questionnaire not found.</p>
        <button onClick={() => navigate(-1)} className="text-accent text-sm font-medium">
          ← Back
        </button>
      </div>
    );
  }

  const canSubmit =
    (questionnaire.code === "NPRS") ||
    (questionnaire.code === "GPE" && gpeRating !== null);

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-text-secondary hover:text-text-primary text-sm font-medium"
      >
        ← Back
      </button>

      {/* header */}
      <header className="space-y-1">
        <span className="text-xs font-medium px-2 py-1 rounded bg-accent/15 text-accent inline-block">
          {questionnaire.code}
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-2">
          {questionnaire.name}
        </h1>
        <p className="text-text-secondary text-sm">
          {questionnaire.description}
        </p>
      </header>

      {/* form branches by code */}
      <section className="bg-bg-secondary border border-border rounded-card p-5 space-y-6">
        {questionnaire.code === "NPRS" && (
          <>
            <SliderQuestion
              label="Your pain right now"
              hint="0 = no pain · 10 = worst pain imaginable"
              value={painNow}
              onChange={setPainNow}
            />
            <SliderQuestion
              label="Worst pain in the past week"
              hint="0 = no pain · 10 = worst pain imaginable"
              value={painWorst}
              onChange={setPainWorst}
            />
          </>
        )}

        {questionnaire.code === "GPE" && (
          <div>
            <p className="font-medium mb-1">
              Compared to when you started treatment, how do you feel now?
            </p>
            <p className="text-text-secondary text-sm mb-4">
              Select the option that best describes your overall change.
            </p>
            <div className="space-y-2">
              {GPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setGpeRating(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-button border transition-colors ${
                    gpeRating === option.value
                      ? "bg-accent/15 border-accent text-text-primary"
                      : "bg-bg-tertiary border-border hover:border-text-secondary"
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* submission */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-button transition-colors"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>

      <p className="text-text-secondary text-xs text-center">
        Your answers are shared with {questionnaire.assignedBy} for your care.
      </p>
    </div>
  );
}

function SliderQuestion({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="font-medium">{label}</label>
        <span className="text-xl font-semibold text-accent tabular-nums w-8 text-right">
          {value}
        </span>
      </div>
      <p className="text-text-secondary text-xs mb-3">{hint}</p>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full accent-accent"
      />
    </div>
  );
}