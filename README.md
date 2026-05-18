<div align="center">

# Patient

A concept patient companion app

*Your care, in your pocket.*

**[View live →](https://patient-app-gamma.vercel.app)**

</div>

---

## Why I built this

Clinics have dashboards for practitioners, but patients rarely get a companion app of their own. This project explores what one could look like.

This is a concept, not a pitch. Intentionally small, intentionally rough in places, intentionally honest about what's missing.

## What it does

Five mobile-first pages, organized around the **treatment trajectory** as the central concept:

- **Login** — email + DigiD
- **Today** — Dutch greeting, treatment trajectory progress, daily PSK check-in, next appointment, exercise progress
- **Appointments** — upcoming + past visits within the trajectory, full detail view with reschedule/cancel
- **Exercises** — home program with mark-as-complete and weekly progress, tied to the trajectory
- **Questionnaires** — clinical questionnaires (NPRS, GPE, PSK) the practitioner has assigned. Branching forms by type. Idempotent submission with localStorage persistence.
- **Profile** — info, NL/EN language toggle, notification preferences

Mock data is Dutch healthcare-flavored: treatments in Dutch (Manuele therapie, Droge naaldtechniek), AGB-style codes (CO, NP, EV), real validated questionnaire codes (PSK, NPRS, GPE), and DigiD on login.

A **Reset demo** button on the Questionnaires page clears local state for fresh runs.

## Architecture

```
src/
├── components/   Reusable UI — AppLayout, TabBar, TrajectoryCard,
│                AppointmentCard, ExerciseCard, PSKCard
├── pages/        One file per route
├── services/     api.ts (mock), types.ts, utils.ts
├── mocks/        Dutch healthcare mock data
└── router.tsx    Routes
```

**`services/api.ts` is the heart of the project.** Each method is structured as if calling a real REST endpoint — same shape, same Promise interface, JSDoc noting the production endpoint it would map to. Local state that should survive refreshes (PSK entries, questionnaire completions) is persisted to `localStorage`, with a documented note that the same pattern in production would write to the database.

```typescript
/**
 * GET /api/patients/me/questionnaires
 * Returns assigned questionnaires merged with locally persisted
 * completions. In production, both would come from the backend.
 */
async getQuestionnaires(): Promise<Questionnaire[]> { ... }
```

Swapping mocks for real `fetch` calls is a single-file refactor.

Other deliberate choices:

- **Treatment trajectory as the primary entity** — appointments, exercises, and questionnaires all reference a trajectory. The patient is *in* a trajectory; everything else *belongs to* it.
- **Discriminated unions for questionnaire results** — each type (NPRS, GPE, PSK) has its own result shape, type-narrowed by a `code` field.
- **Optimistic UI updates** — Exercises checkbox flips instantly, reconciles in background.
- **Idempotent submissions** — re-submitting the same questionnaire replaces the previous record rather than duplicating.
- **TypeScript everywhere** — full type coverage across API, components, and state.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind v4 with design tokens |
| Routing | React Router v7 |
| Persistence | `localStorage` (stub for the real backend) |
| Icons | Inline SVG (Lucide) |

## What I'd build next

- **Auth** — JWT, DigiD integration, session handling
- **Real data** — `fetch` to a real backend, React Query for caching
- **More questionnaires** — the PSK on Today is a quick check-in; the full PSK form (with custom activities) would live on the Questionnaires page like NPRS and GPE
- **Integrations** — Physitrack for exercises, Mollie for payments, Apple Health
- **Outcome history charts** — PSK and NPRS scores trended over the trajectory
- **i18n** — `react-i18next` with NL / EN translation files (current toggle is a placeholder)
- **Accessibility** — full keyboard nav, focus management, screen-reader testing
- **Performance** — route-level code splitting, image lazy loading, offline support
- **Testing** — Vitest for units, Playwright for flows
