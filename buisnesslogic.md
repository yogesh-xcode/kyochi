# Kyochi Business Logic (Simple View)

This document explains what the dashboard currently calculates and how data flows from `data/*.json`.

## 1) Main Data Sources

- `data/patients.json`
- `data/therapists.json`
- `data/therapies.json`
- `data/appointments.json`
- `data/billing.json`
- `data/feedback.json`
- `data/franchises.json`

These files are treated as the temporary local database.

## 2) KPI Card Logic

The KPI cards are computed in `src/components/kyochi/data.ts`.

- New Patients:
  - Formula: `unique(appointments.patient_id in active_month)`
- Monthly Revenue:
  - Formula: `sum(billing.amount where status = paid and due_date in active_month)`
- Success Rate:
  - Formula: `(completed_appointments_in_month / total_appointments_in_month) * 100`
  - Display: one decimal place (example `94.8%`)
- Pending Feedback:
  - Formula: `count(completed_appointments_in_month without submitted feedback row)`
  - Display badge:
    - `High` if pending count > 0
    - `Low` if pending count = 0

## 3) Appointment List Logic

Appointments shown on dashboard are built from joined data:

- Base: `appointments.json`
- Join with:
  - patient name from `patients.json`
  - therapist name from `therapists.json`
  - therapy name from `therapies.json`

Rules:

- Sort by `starts_at` ascending
- Convert time to 12-hour format (`09:00 AM`)
- Map status values:
  - `completed` -> `Completed`
  - `in_progress` -> `In Progress`
  - anything else -> `Waiting`
- Avatar initials are generated from patient full name

## 4) Revenue Snapshot Bar Chart Logic

Revenue bars are generated from billing records.

- Group invoices by weekday using `due_date`
- For each day (`Mon..Sun`):
  - `value = sum(invoice.amount)`
- Height percentage:
  - `pct = round((day_value / max_day_value) * 100)`
  - minimum enforced = `12` so bars stay visible
- Tooltip/label value is formatted as USD currency

## 5) Patient Inflow Chart Logic

Patient inflow uses appointment counts by time bucket.

- Buckets: `08:00`, `12:00`, `16:00`, `20:00`
- Count appointments per bucket based on `starts_at` hour
- Normalize counts to chart points (8..100 range)
- `Today:+N` uses total appointments count

## 6) Alerts Panel Logic

Alerts are composed from multiple sources:

- Feedback Pending alert:
  - Uses completed appointments that do not yet have submitted feedback
- Unpaid Invoices alert:
  - Uses first overdue invoice from `billing.json` (if any)
- AI alerts:
  - Derived from formula-based operational signals (collection, utilization, risk) computed from the 7 core datasets
- System Update alert:
  - Static informational item

## 7) Bottom AI Insight Banner Logic

Banner content is derived from operational formulas.

- Priority order:
  - Pending feedback backlog
  - Overdue invoice risk
  - Throughput/capacity optimization
- Uses the highest-priority signal to generate:
  - banner title
  - banner body
- Action labels are currently static text:
  - `Apply Recommendation`
  - `View Full Analysis`

## 8) Sidebar and Routing Logic

Sidebar items are configured in `navSections` with real routes.

Routes:

- `/dashboard`
- `/patients`
- `/therapists`
- `/therapies`
- `/appointments`
- `/billing`
- `/ai-insights`
- `/analytics`

Active state rules:

- Dashboard is active for both `/` and `/dashboard`
- Other items are active only on exact route match

## 9) Header Logic by Route

The top header title/subtitle changes based on current route.

Example:

- `/dashboard` -> `Admin Intelligence Dashboard`
- `/patients` -> `Patient Dashboard`
- `/appointments` -> `Appointment Details`

## 10) Current Known Simplifications

- `Pending Feedback` is inferred from completed appointments (not a true survey table yet)
- Revenue uses invoice due-date grouping, not payment-date grouping
- AI banner action buttons are display-only
- Search and notification controls are UI-only for now

## 11) Migration Note (Supabase)

When moving to Supabase later, keep the same logical mapping:

- each JSON file -> a table
- cross-reference keys stay:
  - `appointments.patient_id`
  - `appointments.therapist_id`
  - `appointments.therapy_id`
  - `billing.appointment_id`
