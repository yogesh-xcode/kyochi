# AGENTS.md — Kyochi Wellness Intelligence Platform

> This file instructs OpenAI Codex (and any AI coding agent) on how to work
> within this codebase. Read it fully before writing or modifying any code.

---

## 1. Project Overview

**Kyochi** is a clinical management and wellness intelligence platform for a
foot reflexology and holistic therapy centre. It is a single-outlet web
application (v1) with a planned path to multi-franchise.

**Stack**

- Frontend: Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui
- Backend / DB: Supabase (PostgreSQL + Row Level Security + Auth)
- AI: Anthropic Claude API (`claude-sonnet-4-20250514`) for insight generation
- Charts: Recharts
- Language: TypeScript throughout

**Three user roles** with separate views:

1. `admin` — front desk staff (clinical ops + billing)
2. `therapist` — session management + feedback entry
3. `owner` — full access including analytics and AI insights

---

## 2. Repository Structure

```
kyochi/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Shared sidebar + topbar shell
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin home → redirects to /admin/analytics
│   │   │   ├── analytics/page.tsx
│   │   │   ├── appointments/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── therapists/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── therapies/page.tsx
│   │   ├── therapist/
│   │   │   ├── page.tsx        # Today's appointments
│   │   │   ├── session/[appointmentId]/page.tsx
│   │   │   └── feedback/[appointmentId]/page.tsx
│   │   └── owner/
│   │       ├── page.tsx        # Owner analytics dashboard
│   │       ├── insights/page.tsx
│   │       ├── reports/page.tsx
│   │       └── settings/page.tsx
│   └── api/
│       ├── insights/route.ts   # Claude API — generate AI insight
│       ├── feedback/route.ts   # POST feedback record
│       └── billing/route.ts    # Create / update invoice
├── components/
│   ├── ui/                     # shadcn/ui primitives (auto-generated, do not edit)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── ScoreCard.tsx
│   │   ├── RevenueByTherapy.tsx
│   │   ├── RetentionChart.tsx
│   │   ├── TherapistTable.tsx
│   │   ├── AppointmentList.tsx
│   │   └── AIInsightStrip.tsx
│   ├── patients/
│   │   ├── PatientCard.tsx
│   │   ├── PatientProfile.tsx
│   │   ├── WellnessTrendChart.tsx
│   │   └── SessionHistoryTimeline.tsx
│   ├── appointments/
│   │   ├── AppointmentForm.tsx
│   │   ├── AppointmentStatusBadge.tsx
│   │   └── TherapistPicker.tsx
│   ├── feedback/
│   │   ├── FeedbackFlow.tsx    # Multi-step feedback wizard
│   │   ├── StressScaleStep.tsx
│   │   ├── PhysicalStep.tsx
│   │   ├── OutcomeStep.tsx
│   │   └── NotesStep.tsx
│   ├── billing/
│   │   ├── InvoiceCard.tsx
│   │   └── BillingForm.tsx
│   └── shared/
│       ├── WellnessRing.tsx    # SVG circular score ring
│       ├── DeltaBadge.tsx      # +/- wellness change badge
│       ├── TherapyChip.tsx
│       └── AIInsightCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server component client
│   │   └── middleware.ts       # Auth middleware
│   ├── claude/
│   │   └── insights.ts         # Claude API wrapper
│   ├── utils.ts
│   └── types.ts                # All shared TypeScript types
├── styles/
│   └── globals.css             # Full token system — see Section 5
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── schema.sql              # Master schema
├── public/
├── AGENTS.md                   # ← this file
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 3. Database Schema

All tables live in Supabase PostgreSQL. Row Level Security (RLS) is enabled
on every table. Agents must never disable RLS or write policies that expose
cross-user data.

### Core Tables

```sql
-- Outlet (single for v1; multi-outlet ready)
outlets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  address       text,
  phone         text,
  created_at    timestamptz DEFAULT now()
)

-- Users / auth (extends Supabase auth.users)
profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id),
  outlet_id     uuid REFERENCES outlets(id),
  full_name     text NOT NULL,
  role          text CHECK (role IN ('admin','therapist','owner')),
  phone         text,
  avatar_url    text,
  created_at    timestamptz DEFAULT now()
)

-- Patients
patients (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id     uuid REFERENCES outlets(id),
  full_name     text NOT NULL,
  phone         text UNIQUE,
  email         text,
  dob           date,
  gender        text CHECK (gender IN ('male','female','other')),
  medical_notes text,
  wellness_score numeric(4,2) DEFAULT 0,
  total_sessions int DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)

-- Therapists
therapists (
  id            uuid PRIMARY KEY REFERENCES profiles(id),
  outlet_id     uuid REFERENCES outlets(id),
  specialisations text[],       -- e.g. ARRAY['Relaxation','Femme Cycle']
  bio           text,
  is_active     boolean DEFAULT true
)

-- Therapy catalogue
therapies (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id     uuid REFERENCES outlets(id),
  name          text NOT NULL,  -- e.g. 'Relaxation', 'De-stress'
  description   text,
  duration_options int[],       -- e.g. ARRAY[30, 40, 60]
  price_map     jsonb,          -- e.g. {"30": 500, "40": 600, "60": 700}
  category      text CHECK (category IN ('foot_reflexology','special','holistic')),
  is_active     boolean DEFAULT true
)

-- Appointments
appointments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outlet_id     uuid REFERENCES outlets(id),
  patient_id    uuid REFERENCES patients(id),
  therapist_id  uuid REFERENCES therapists(id),
  therapy_id    uuid REFERENCES therapies(id),
  duration_mins int NOT NULL,
  scheduled_at  timestamptz NOT NULL,
  status        text CHECK (status IN ('booked','in_session','completed','cancelled')),
  notes         text,
  created_by    uuid REFERENCES profiles(id),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)

-- Feedback (post-session)
feedback (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  uuid REFERENCES appointments(id) UNIQUE,
  patient_id      uuid REFERENCES patients(id),
  therapy_id      uuid REFERENCES therapies(id),
  -- Core metrics
  stress_before   int CHECK (stress_before BETWEEN 1 AND 10),
  stress_after    int CHECK (stress_after BETWEEN 1 AND 10),
  pain_before     int CHECK (pain_before BETWEEN 1 AND 10),
  pain_after      int CHECK (pain_after BETWEEN 1 AND 10),
  energy_before   int CHECK (energy_before BETWEEN 1 AND 10),
  energy_after    int CHECK (energy_after BETWEEN 1 AND 10),
  rested_score    int CHECK (rested_score BETWEEN 1 AND 10),
  -- Therapy-specific
  physical_improvement  text,   -- radio option selected
  outcome_rating        int CHECK (outcome_rating BETWEEN 1 AND 10),
  therapist_note        text,   -- open text from patient
  -- Computed
  wellness_delta        numeric(4,2), -- computed on insert
  -- Meta
  collected_by    text CHECK (collected_by IN ('admin','patient_self')),
  submitted_at    timestamptz DEFAULT now()
)

-- Billing / Invoices
invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id  uuid REFERENCES appointments(id) UNIQUE,
  patient_id      uuid REFERENCES patients(id),
  outlet_id       uuid REFERENCES outlets(id),
  amount_paise    int NOT NULL,   -- store in paise (₹ × 100), never floats
  payment_method  text CHECK (payment_method IN ('cash','upi','card','waived')),
  status          text CHECK (status IN ('pending','paid','waived')),
  paid_at         timestamptz,
  created_by      uuid REFERENCES profiles(id),
  created_at      timestamptz DEFAULT now()
)

-- AI Insights (cached per patient)
ai_insights (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    uuid REFERENCES patients(id),
  outlet_id     uuid REFERENCES outlets(id),
  insight_text  text NOT NULL,
  model_version text DEFAULT 'claude-sonnet-4-20250514',
  generated_at  timestamptz DEFAULT now(),
  is_current    boolean DEFAULT true
)
```

### RLS Policies (pattern)

```sql
-- All users can only access data from their own outlet
CREATE POLICY "outlet_isolation" ON patients
  USING (outlet_id = (SELECT outlet_id FROM profiles WHERE id = auth.uid()));

-- Therapists can only see their own appointments
CREATE POLICY "therapist_own_appointments" ON appointments
  FOR SELECT USING (
    therapist_id = auth.uid()
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin','owner')
  );
```

---

## 4. TypeScript Types

All types live in `lib/types.ts`. Agents must import from here — do not
redefine types inline.

```ts
// Key types — full definitions in lib/types.ts

export type Role = "admin" | "therapist" | "owner";

export type AppointmentStatus =
  | "booked"
  | "in_session"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "upi" | "card" | "waived";

export type InvoiceStatus = "pending" | "paid" | "waived";

export type CollectedBy = "admin" | "patient_self";

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  wellnessScore: number;
  totalSessions: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patient: Patient;
  therapistId: string;
  therapyId: string;
  durationMins: number;
  scheduledAt: string;
  status: AppointmentStatus;
}

export interface FeedbackPayload {
  appointmentId: string;
  stressBefore: number;
  stressAfter: number;
  painBefore?: number;
  painAfter?: number;
  energyBefore?: number;
  energyAfter?: number;
  restedScore: number;
  physicalImprovement: string;
  outcomeRating: number;
  therapistNote?: string;
  collectedBy: CollectedBy;
}

export interface Invoice {
  id: string;
  appointmentId: string;
  amountPaise: number; // always paise — divide by 100 to display ₹
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  paidAt?: string;
}

export interface AIInsight {
  id: string;
  patientId: string;
  insightText: string;
  generatedAt: string;
}
```

---

## 5. Design System

The design system is defined in `styles/globals.css` using CSS custom
properties compatible with shadcn/ui. Agents must use these tokens — never
hardcode hex values or Tailwind arbitrary values for brand colours.

### Key tokens

```css
--gold: #d4af35 /* primary brand — buttons, accents, highlights */ --gold-50 to
  --gold-900 /* full ramp */ --cream-100 to --cream-800 --green: #3fa060
  /* wellness positive delta */ --red: #ef4444
  /* wellness negative delta / alerts */ --dark-base: #241e15
  /* sidebar bg, AI insight panels */ --text: #241e15 --text-2: #6b5e4c
  --text-3: #a89880 /* muted labels */ --shadow-gold: 0 4px 20px
  rgba(212, 175, 53, 0.22);
```

### Tailwind config additions (tailwind.config.ts)

```ts
colors: {
  gold: {
    DEFAULT: '#d4af35',
    50: '#fdf8e7', 100: '#f9edbe', 200: '#f3dc8a',
    300: '#ecc84f', 400: '#d4af35', 500: '#b8941f',
    600: '#9a7a10', 700: '#7a5f0a', 800: '#5c4507', 900: '#3d2d04',
  },
  cream: {
    100: '#f8f7f4', 200: '#f2efe9', 300: '#e8e3d8',
    400: '#d9d1c2', 600: '#a89880', 700: '#8a7a64', 800: '#6b5e4c',
  },
  wellness: {
    positive: '#3fa060',
    negative: '#ef4444',
  },
  dark: { base: '#241e15', deep: '#181410', mid: '#3d2d04' },
}
fonts: { display: ['DM Serif Display', 'Georgia', 'serif'], sans: ['Manrope', 'system-ui', 'sans-serif'] }
```

### Component usage rules

- Use `shadcn/ui` primitives (Button, Card, Badge, Input, Tabs, Dialog) as the
  base — do not build these from scratch.
- Override with Kyochi tokens via `className` — never via inline `style`.
- All monetary values: store as **paise** (integer), display as **₹** divided
  by 100 with `toLocaleString('en-IN')`.
- Wellness delta display: green + "▲" for positive, red + "▼" for negative,
  muted for zero.

---

## 6. AI Insights — Claude API

Insights are generated server-side in `app/api/insights/route.ts`.

### Rules

- Model: always `claude-sonnet-4-20250514`
- Max tokens: `1000`
- Never stream to the client — generate fully server-side, store in
  `ai_insights`, return cached result.
- Regenerate only when: user clicks "Refresh insight" OR last insight is
  older than 24 hours.
- Never include raw patient PII (phone, email, DOB) in the Claude prompt.
  Use anonymised references (`patient_id` only).

### Prompt pattern (`lib/claude/insights.ts`)

```ts
const systemPrompt = `
You are a wellness intelligence assistant for Kyochi, a foot reflexology clinic.
You analyse patient feedback data and generate brief, clinically-aware, 
actionable insights for the clinic owner. 
Tone: warm, professional, concise.
Format: 2-3 sentences max. No bullet points. Plain text only.
Never diagnose. Never make medical claims.
Always suggest "consult a healthcare professional" for any medical concern.
`;

const userPrompt = `
Patient has completed ${sessionCount} sessions.
Therapy types: ${therapyNames.join(", ")}.
Average stress delta across sessions: ${avgStressDelta} (before minus after).
Average pain delta: ${avgPainDelta}.
Average wellness score trend: ${scoreTrend}.
Last session: ${daysSinceLastSession} days ago.

Generate a brief insight summary for the clinic owner.
`;
```

---

## 7. Coding Rules

### General

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- All async functions must handle errors with try/catch — never silent failures
- Use `zod` for all API input validation
- Prefer `const` over `let`; never `var`
- All components are React Server Components by default — add `'use client'`
  only when the component needs state, effects, or browser APIs

### Supabase

- Always use the server client in Server Components and API routes
- Use the browser client only in Client Components
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client — it stays server-only
- Always check for errors on Supabase calls:
  ```ts
  const { data, error } = await supabase.from("patients").select();
  if (error) throw new Error(error.message);
  ```

### Money

- Store: integer paise (`amountPaise: number`)
- Display: `(amountPaise / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })`
- Never use `parseFloat` or `toFixed` for currency — always integer arithmetic

### Dates

- Store: UTC ISO strings in Supabase
- Display: use `date-fns` with `'en-IN'` locale
- Timezone: assume `Asia/Kolkata` for display — use `date-fns-tz`

### Forms

- Use `react-hook-form` + `zod` resolver for all forms
- Multi-step feedback flow: store partial state in React state (not URL) —
  auto-save to Supabase draft every 30s

### Naming

- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions / variables: `camelCase`
- DB columns: `snake_case` (Supabase convention)
- Type interfaces: `PascalCase` with no `I` prefix

---

## 8. Environment Variables

```bash
# .env.local (never commit — use .env.local.example as template)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only — never expose to client

# Anthropic
ANTHROPIC_API_KEY=               # server-only — never expose to client

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OUTLET_ID=           # single outlet ID for v1
```

Agents must never hardcode these values. Always read from `process.env`.
If an env var is missing, throw a descriptive error at startup — do not
silently fall back.

---

## 9. Key Business Rules

These are non-negotiable — agents must never violate them.

1. **Appointment lifecycle**: `booked` → `in_session` → `completed`. Status
   can only move forward — never backwards. Cancellation is a separate flag.

2. **Feedback is locked after submission**: once a feedback record exists for
   an `appointment_id`, it cannot be updated — only read. Create a new record
   if a correction is needed (admin override only).

3. **Billing closes the appointment**: an appointment is only fully `completed`
   when its invoice status is `paid` or `waived`. Never mark `completed`
   without a corresponding invoice record.

4. **Wellness score update**: after each feedback submission, recompute the
   patient's `wellness_score` as the rolling average of their last 5
   `outcome_rating` values. Update `patients.wellness_score` in the same
   transaction as the feedback insert.

5. **AI insights are advisory only**: insight text must never appear in
   clinical records, invoices, or any document sent to patients. It is an
   internal tool for the owner only.

6. **Currency is always INR**: no multi-currency, no FX conversion, no USD.
   Display symbol is `₹` — not `Rs.` or `INR`.

7. **Phone is the patient identifier**: `patients.phone` is unique per outlet.
   Use it to detect returning patients at walk-in registration. If found,
   pre-fill the form — do not create a duplicate record.

---

## 10. What Agents Should NOT Do

- Do not modify files in `components/ui/` — these are shadcn/ui auto-generated
- Do not add new npm packages without noting the reason in the PR description
- Do not write raw SQL migrations inline in components — all schema changes go
  in `supabase/migrations/`
- Do not expose the Claude API key or Supabase service role key to the browser
- Do not implement payment gateway integration in v1 — billing is manual
  recording only (cash / UPI / card)
- Do not add patient-facing screens in v1 — patients are admin/therapist-entered
- Do not build multi-outlet features in v1 — `outlet_id` is fixed from env var
- Do not use `localStorage` for sensitive data — use Supabase session only

---

## 11. Current Build Status

| Screen                                     | Status                                  |
| ------------------------------------------ | --------------------------------------- |
| Design system (`globals.css`, theme guide) | ✅ Done                                 |
| Admin Analytics Dashboard (Screen 1)       | ✅ Done — `kyochi-admin-dashboard.html` |
| Therapist Dashboard (Screen 2)             | 🔲 Next                                 |
| Patient Profile (Screen 3)                 | 🔲 Pending                              |
| Feedback Flow (Screen 4)                   | 🔲 Pending                              |
| Appointment Management (Screen 5)          | 🔲 Pending                              |
| Billing (Screen 6)                         | 🔲 Pending                              |
| AI Insights Dashboard (Screen 7)           | 🔲 Pending                              |
| Next.js project scaffold                   | 🔲 Pending                              |
| Supabase schema + migrations               | 🔲 Pending                              |
| Claude API integration                     | 🔲 Pending                              |

---

_Last updated: March 2026 — Kyochi v1 single-outlet build_
