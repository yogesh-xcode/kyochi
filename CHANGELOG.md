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

## 2026-03-19 12:52:38 IST (+0530)

- DateTime: `2026-03-19 12:52:38 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `77`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-125229`
    - diff lines: `1-113`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Updated dashboard top header container to a non-rounded rectangular bar style to match the highlighted reference area.
    - Preserved existing header content and actions while changing only the outer shape treatment.
- Why changed:
    - Requested dashboard top section to follow provided design and avoid rounded fit.

## 2026-03-19 12:49:06 IST (+0530)

- DateTime: `2026-03-19 12:49:06 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `7,13,45-55`
    - file: `src/app/ai-insights/page.tsx`
    - diff lines: `1-14`
    - file: `src/components/kyochi/KyochiDashboard.tsx.bkp.20260319-124825`
    - diff lines: `1-60`
    - file: `src/app/ai-insights/page.tsx.bkp`
    - diff lines: `1-9`
    - file: `CHANGELOG.md`
    - diff lines: `16-33`
- What changed:
    - Reduced dashboard recent appointments table to maximum 3 rows.
    - Removed Intelligence Alerts panel from dashboard.
    - Moved Intelligence Alerts rendering to `/ai-insights` page below the existing AI placeholder section.
    - Created backups for modified files before editing.
- Why changed:
    - Requested max three appointments on dashboard and relocation of Intelligence Alerts to AI Insights page.

## 2026-03-19 12:47:12 IST (+0530)

- DateTime: `2026-03-19 12:47:12 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `258,355-367`
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `18,24`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `31-91`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `77-112`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `9-25`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `14-42`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `22-40`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `12-45`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `10-38`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `17-29`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `33,48`
    - file: `CHANGELOG.md`
    - diff lines: `16-47`
- What changed:
    - Removed global scaling hacks (`zoom`, transform fallback wrapper, and app-scale class usage).
    - Applied direct 10%-ish reductions file-by-file across shell and dashboard components (widths, paddings, gaps, text, icon, and card sizes).
    - Kept layout structure and data wiring unchanged while making UI density visibly smaller.
- Why changed:
    - Requested explicit file-by-file size reduction instead of `html font-size` or `zoom`-based scaling.

## 2026-03-19 12:38:00 IST (+0530)

- DateTime: `2026-03-19 12:38:00 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `248,356-367`
    - file: `src/app/globals.css.bkp.20260319-123644`
    - diff lines: `1-1035`
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `17`
    - file: `src/components/kyochi/AppShell.tsx.bkp.20260319-123644`
    - diff lines: `1-33`
    - file: `CHANGELOG.md`
    - diff lines: `16-33`
- What changed:
    - Replaced ineffective root font-size approach with true app-wide scale using `zoom: 0.9`.
    - Added fallback transform scaling for environments without `zoom` support.
    - Added `kyochi-ui-scale` wrapper class in app shell for fallback behavior.
    - Created timestamped backups for modified files before edit.
- Why changed:
    - Reported that prior 10% reduction did not visibly shrink all UI elements.

## 2026-03-19 12:34:27 IST (+0530)

- DateTime: `2026-03-19 12:34:27 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `248`
    - file: `src/app/globals.css.bkp`
    - diff lines: `1-1034`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Applied a global 10% UI downscale by setting root `html` font-size to `90%`.
    - Created a backup of global stylesheet before modification.
- Why changed:
    - Requested to decrease the size of everything by approximately 10%.

## 2026-03-19 12:32:44 IST (+0530)

- DateTime: `2026-03-19 12:32:44 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `47-108`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-123219`
    - diff lines: `1-108`
    - file: `CHANGELOG.md`
    - diff lines: `16-30`
- What changed:
    - Restyled header to match the provided compact reference pattern.
    - Updated dashboard header to show greeting + subtitle on the left and date/notification/profile controls on the right.
    - Kept non-dashboard routes title/subtitle behavior intact with the same chrome.
    - Created timestamped backup copy before editing because `.bkp` already existed.
- Why changed:
    - Requested header structure to follow the supplied design screenshot.

## 2026-03-19 12:28:45 IST (+0530)

- DateTime: `2026-03-19 12:28:45 IST (+0530)`
- File changes:
    - file: `src/app/layout.tsx.bkp`
    - diff lines: `1-43`
    - file: `src/components/kyochi/Sidebar.tsx.bkp`
    - diff lines: `1-91`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp`
    - diff lines: `1-106`
    - file: `src/components/kyochi/KyochiDashboard.tsx.bkp`
    - diff lines: `1-56`
- What changed:
    - Created backup copies for all files touched in this redesign pass using `.bkp` suffix in-place.
- Why changed:
    - Requested mandatory backup preservation before redesign edits.

## 2026-03-19 12:28:45 IST (+0530)

- DateTime: `2026-03-19 12:28:45 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `1-31`
    - file: `src/app/layout.tsx`
    - diff lines: `3-5,35-40`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `9-90`
- What changed:
    - Added responsive shared app shell with mobile off-canvas sidebar behavior.
    - Updated root layout to render `AppShell` as shared chrome container.
    - Refreshed sidebar spacing/active styling and added mobile overlay + close interactions.
- Why changed:
    - Requested shell redesign with route continuity and mobile drawer navigation.

## 2026-03-19 12:28:45 IST (+0530)

- DateTime: `2026-03-19 12:28:45 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `1-130`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `4-56`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `1-57`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `1-36`
- What changed:
    - Rebuilt header into a theme-consistent greeting/date/action strip with mobile menu trigger.
    - Reordered dashboard to analytics-first composition (KPI row, analytics panels, appointments table, side insight/alerts).
    - Added dedicated table component for recent appointments and a recommendation side card wired to insight data.
- Why changed:
    - Requested redesign aligned to provided reference while keeping Kyochi theme and healthcare data model.

## 2026-03-19 11:42:55 IST (+0530)

- DateTime: `2026-03-19 11:42:55 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `30`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Limited dashboard appointment panel to show a maximum of 3 records.
- Why changed:
    - Requested max appointments visible on dashboard to be 3.

## 2026-03-19 11:37:48 IST (+0530)

- DateTime: `2026-03-19 11:37:48 IST (+0530)`
- File changes:
    - file: `src/types/index.ts`
    - diff lines: `14`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `104`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `31`
    - file: `CHANGELOG.md`
    - diff lines: `16-31`
- What changed:
    - Added stable `id` to dashboard appointment view-model and switched appointment list React key from patient name to appointment id.
- Why changed:
    - Console warning reported duplicate React keys for repeated patient names in appointment rows.

## 2026-03-19 11:28:36 IST (+0530)

- DateTime: `2026-03-19 11:28:36 IST (+0530)`
- File changes:
    - file: `data/patients.json`
    - diff lines: `1-11`
    - file: `data/therapists.json`
    - diff lines: `1-7`
    - file: `data/therapies.json`
    - diff lines: `1-7`
    - file: `data/appointments.json`
    - diff lines: `1-17`
    - file: `data/billing.json`
    - diff lines: `1-11`
    - file: `data/ai_insights.json`
    - diff lines: `1-6`
    - file: `data/analytics.json`
    - diff lines: `1-8`
    - file: `CHANGELOG.md`
    - diff lines: `16-35`
- What changed:
    - Repopulated all `data/*.json` with a larger seed dataset (46 records total) and varied values.
    - Spread timeline-based records across the last 30 days (`2026-02-18` to `2026-03-19`) for appointments, billing, and insights.
    - Kept relational integrity between patient/therapist/therapy/appointment/billing references.
- Why changed:
    - Requested around 40 records with variety across the last 30-day timeline.

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
