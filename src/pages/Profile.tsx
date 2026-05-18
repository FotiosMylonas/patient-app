import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Patient } from "../services/types";

type Language = "nl" | "en";

export default function Profile() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("nl");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getCurrentPatient();
        setPatient(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  function handleSignOut() {
    // Mock sign out --> clear state and redirect to login
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-8 w-32 bg-bg-secondary rounded animate-pulse" />
        <div className="h-32 bg-bg-secondary rounded-card animate-pulse" />
        <div className="h-40 bg-bg-secondary rounded-card animate-pulse" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center text-text-secondary">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 animate-fade-in">
      
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </header>

      {/* card of user */}
      <section className="bg-bg-secondary border border-border rounded-card p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-bg-tertiary flex items-center justify-center text-2xl font-medium mb-3">
          {patient.name.charAt(0)}
        </div>
        <p className="font-medium text-lg">{patient.name}</p>
        <p className="text-text-secondary text-sm">{patient.email}</p>
      </section>

      {/*  personal info */}
      <section>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
          Personal information
        </h2>
        <div className="bg-bg-secondary border border-border rounded-card divide-y divide-border">
          <Row label="Birthdate" value={patient.birthdate} />
          <Row label="Phone" value={patient.phone ?? "Not set"} />
          <Row label="Insurer" value={patient.insurer ?? "Not set"} />
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
          Preferences
        </h2>

        <div className="bg-bg-secondary border border-border rounded-card divide-y divide-border">
          {/* Language toggle */}
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-text-secondary text-xs mt-0.5">
                {language === "nl" ? "Nederlands" : "English"}
              </p>
            </div>
            <div className="flex rounded-button bg-bg-tertiary p-0.5">
              <button
                onClick={() => setLanguage("nl")}
                className={`px-3 py-1 text-xs font-medium rounded-button transition-colors ${
                  language === "nl"
                    ? "bg-accent text-white"
                    : "text-text-secondary"
                }`}
              >
                NL
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs font-medium rounded-button transition-colors ${
                  language === "en"
                    ? "bg-accent text-white"
                    : "text-text-secondary"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Notifications toggle */}
          <Toggle
            label="Notifications"
            description="In-app push notifications"
            enabled={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />

          {/* Appointment reminders */}
          <Toggle
            label="Appointment reminders"
            description="Email and SMS 24h before"
            enabled={remindersEnabled}
            onToggle={() => setRemindersEnabled(!remindersEnabled)}
          />
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">
          About
        </h2>
        <div className="bg-bg-secondary border border-border rounded-card divide-y divide-border">
          <Row label="Version" value="0.1.0 (concept)" />
          <LinkRow label="Privacy" />
          <LinkRow label="Terms of service" />
        </div>
      </section>

      {/* Sign out */}
      <button
        onClick={handleSignOut}

        className="w-full bg-bg-secondary-red rounded-button `hover:bg-red-500/10 hover:border-red-500/30 border border-border transition-colors text-red-500 font-medium py-3 round-button diable:opacity-50"
      >
        Sign out
      </button>

      {/* Footer note */}
      <p className="text-text-secondary text-xs text-center pt-4">
        Patient · Made with care
      </p>
    </div>
  );
}

// -----------------------------------------------------
//  helper components for cleaner layout
// -----------------------------------------------------

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-text-secondary text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function LinkRow({ label }: { label: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary/50 transition-colors">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-text-secondary">→</span>
    </button>
  );
}

function Toggle({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p className="font-medium">{label}</p>
        {description && (
          <p className="text-text-secondary text-xs mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-accent" : "bg-bg-tertiary"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}