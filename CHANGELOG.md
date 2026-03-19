# Project Changelog

This file is maintained for every code change.

## Entry Format

- DateTime: `YYYY-MM-DD HH:MM:SS TZ`
- File changes:
    - `file: <path>`
    - `diff lines: <line>` or `<start-end>`
- What changed: concise summary
- Why changed: reason/request

---

## 2026-03-19 11:19:59 IST (+0530)

- DateTime: `2026-03-19 11:19:59 IST (+0530)`
- File changes:
    - file: `buisnesslogic.md`
    - diff lines: `1-141`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Added a business logic reference doc in simple terms covering KPI formulas, chart logic, alerts, routing behavior, and data relationships.
- Why changed:
    - Requested a clear business-logic document for all dashboard calculations and rules.

## 2026-03-19 11:14:45 IST (+0530)

- DateTime: `2026-03-19 11:14:45 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `1,15-26`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Replaced the appointments panel `Live Status` indicator with a top-right navigation arrow.
    - Wired the arrow action to open `/appointments`.
- Why changed:
    - Requested replacing live status with a directional arrow action that navigates to the appointments page.

## 2026-03-19 11:11:16 IST (+0530)

- DateTime: `2026-03-19 11:11:16 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/data.ts`
    - diff lines: `2,58-100`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Removed KPI dependency on `analytics.json` and switched KPI values to formula-based computation from core datasets.
    - `New Patients` now uses patient count, `Monthly Revenue` uses billing sum, and `Success Rate` uses completed/total appointments.
- Why changed:
    - Requested KPI cards to use formulas instead of analytics seed values.

## 2026-03-19 11:08:46 IST (+0530)

- DateTime: `2026-03-19 11:08:46 IST (+0530)`
- File changes:
    - file: `src/types/index.ts`
    - diff lines: `51-63`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `9-234`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `1-43`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `3-32`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `5-51`
    - file: `CHANGELOG.md`
    - diff lines: `16-33`
- What changed:
    - Wired Patient Inflow chart to dataset-derived time-bucket points and today-count.
    - Wired bottom AI Insight banner title/body/actions from `ai_insights` recommendation data.
    - Added typed contracts for these two dashboard data blocks and passed them through dashboard composition.
- Why changed:
    - Requested dashboard to reflect dataset values fully, including previously static sections.

## 2026-03-19 10:57:23 IST (+0530)

- DateTime: `2026-03-19 10:57:23 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/data.ts`
    - diff lines: `1-210`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Replaced hardcoded dashboard constants with computed values derived from `data/*.json`.
    - Wired KPI cards, appointments list, revenue bars, and alerts to local dataset records and cross-references.
- Why changed:
    - Requested dashboard to reflect the dataset in `data/` directly.

## 2026-03-19 10:46:41 IST (+0530)

- DateTime: `2026-03-19 10:46:41 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/types/index.ts`
    - diff lines: `1-49` (moved to root)
    - file: `src/types/index.ts`
    - diff lines: `1-49`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `7`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `7`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `2`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `2`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `12`
    - file: `src/components/kyochi/index.ts`
    - diff lines: `25`
    - file: `CHANGELOG.md`
    - diff lines: `16-47`
- What changed:
    - Moved Kyochi shared type module from `src/components/kyochi/types` to root `src/types`.
    - Rewired all kyochi imports to consume `@/types`.
- Why changed:
    - Requested type definitions to live in the root-level types location.

## 2026-03-19 10:20:22 IST (+0530)

- DateTime: `2026-03-19 10:20:22 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/types/index.ts`
    - diff lines: `33-38`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `114-136`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `1-56`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `1-53`
    - file: `src/components/kyochi/FeaturePlaceholder.tsx`
    - diff lines: `1-19`
    - file: `src/app/patients/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/therapists/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/therapies/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/billing/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/ai-insights/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/analytics/page.tsx`
    - diff lines: `1-10`
    - file: `data/patients.json`
    - diff lines: `1-29`
    - file: `data/therapists.json`
    - diff lines: `1-18`
    - file: `data/therapies.json`
    - diff lines: `1-18`
    - file: `data/appointments.json`
    - diff lines: `1-29`
    - file: `data/billing.json`
    - diff lines: `1-20`
    - file: `data/ai_insights.json`
    - diff lines: `1-20`
    - file: `data/analytics.json`
    - diff lines: `1-23`
    - file: `CHANGELOG.md`
    - diff lines: `16-61`
- What changed:
    - Wired sidebar links to real top-level routes and computed active state from pathname.
    - Added top-level route pages for patients, therapists, therapies, appointments, billing, AI insights, and analytics.
    - Added `data/` with table-ready flat JSON datasets and cross-reference ids for future Supabase migration.
- Why changed:
    - Requested real route wiring and a flat local dataset structure to serve as migration-ready seed data.

## 2026-03-19 09:54:32 IST (+0530)

- DateTime: `2026-03-19 09:54:32 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/types.ts`
    - diff lines: `1-49` (moved)
    - file: `src/components/kyochi/types/index.ts`
    - diff lines: `1-49`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `7`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `2`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `2`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `2`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `12`
    - file: `src/components/kyochi/index.ts`
    - diff lines: `25`
    - file: `CHANGELOG.md`
    - diff lines: `16-45`
- What changed:
    - Moved `components/kyochi/types.ts` to `components/kyochi/types/index.ts`.
    - Updated all kyochi imports to use the new `types/index` path.
- Why changed:
    - Requested canonical type module path as `components/kyochi/types/index.ts`.

## 2026-03-19 09:50:51 IST (+0530)

- DateTime: `2026-03-19 09:50:51 IST (+0530)`
- File changes:
    - file: `src/app/layout.tsx`
    - diff lines: `37`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `6-8`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `17-20`
    - file: `CHANGELOG.md`
    - diff lines: `16-31`
- What changed:
    - Forced Manrope application at root using `manrope.className` in body class.
    - Bound dashboard hero text to explicit typography scale classes (`type-h1`, `type-body`).
    - Applied DM Serif display style to sidebar brand subtitle and updated text to `Wellness Intelligence`.
- Why changed:
    - Font appearance still looked incorrect; requested typography needed stronger explicit application in visible UI areas.

## 2026-03-19 09:45:46 IST (+0530)

- DateTime: `2026-03-19 09:45:46 IST (+0530)`
- File changes:
    - file: `src/app/layout.tsx`
    - diff lines: `2,13-17,37`
    - file: `src/app/globals.css`
    - diff lines: `257,267-321`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Reintroduced DM Serif font variable in layout for display typography.
    - Applied exact typography mapping for Manrope-based `H1/H2/H3/Body/Small/Label`.
    - Added utility classes (`type-h1`, `type-h2`, `type-h3`, `type-body`, `type-small`, `type-label`) for explicit usage.
- Why changed:
    - Requested typography system: Display/DM Serif and specific Manrope weights/sizes for heading and text tiers.

## 2026-03-19 09:31:34 IST (+0530)

- DateTime: `2026-03-19 09:31:34 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `748`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Fixed `@theme inline` font token mapping by replacing self-reference with a concrete Manrope chain.
- Why changed:
    - Font was not applying in UI due to `--font-sans: var(--font-sans)` recursive token resolution.

## 2026-03-19 08:51:05 IST (+0530)

- DateTime: `2026-03-19 08:51:05 IST (+0530)`
- File changes:
    - file: `src/app/layout.tsx`
    - diff lines: `30-36`
    - file: `src/app/globals.css`
    - diff lines: `1`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Removed inline font `<link>` injection from root layout.
    - Moved Material Symbols font loading into global stylesheet import.
    - Kept shared layout shell (sidebar + header) in `layout.tsx` and retained Next font usage there.
- Why changed:
    - Requested layout-driven common structure with proper font handling based on project needs.

## 2026-03-19 08:49:42 IST (+0530)

- DateTime: `2026-03-19 08:49:42 IST (+0530)`
- File changes:
    - file: `src/app/layout.tsx`
    - diff lines: `3-5,31-44`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `5,17-41`
    - file: `CHANGELOG.md`
    - diff lines: `16-31`
- What changed:
    - Moved common dashboard chrome into the root layout: sidebar and top header now render from `layout.tsx`.
    - Moved material symbols font link from page component into `layout.tsx`.
    - Simplified `KyochiDashboard` to render only page-specific content sections.
- Why changed:
    - Requested to use `layout.tsx` for common elements shared across pages (header, sidebar, and related shell UI).

## 2026-03-19 08:44:19 IST (+0530)

- DateTime: `2026-03-19 08:44:19 IST (+0530)`
- File changes:
    - file: `CHANGELOG.md`
    - diff lines: `1-69`
- What changed:
    - Replaced prior changelog style with the required project changelog schema.
    - Added structured entries with explicit timestamp, file list, diff line ranges, change summary, and reason.
- Why changed:
    - Requested to follow the provided changelog format example.

## 2026-03-19 08:33:33 IST (+0530)

- DateTime: `2026-03-19 08:33:33 IST (+0530)`
- File changes:
    - file: `CHANGELOG.md`
    - diff lines: `1-20`
    - file: `src/app/dashboard/page.tsx`
    - diff lines: `1-5`
    - file: `src/components/KyochiDashboard.tsx`
    - diff lines: `1`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `1-32`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `1-43`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `1-44`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `1-26`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `1-30`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `1-66`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `1-35`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `1-47`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `1-66`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `1-140`
    - file: `src/components/kyochi/index.ts`
    - diff lines: `1-25`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `1-58`
    - file: `src/components/kyochi/types.ts`
    - diff lines: `1-49`
- What changed:
    - Split the monolithic dashboard into section-level components under `src/components/kyochi`.
    - Added shared primitives/types/data modules.
    - Added route page at `/dashboard` and kept root page behavior unchanged by preserving `src/components/KyochiDashboard.tsx` import compatibility.
- Why changed:
    - Requested to convert dashboard into reusable `components/kyochi` modules and use it in `dashboard/page.tsx`.
