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

## 2026-03-19 13:27:11 IST (+0530)

- DateTime: `2026-03-19 13:27:11 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `408-411`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `51,73,93`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `63,92,101`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `37`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `18,25,28`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `11,37`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `21`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `14,17`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `20`
    - file: `CHANGELOG.md`
    - diff lines: `16-45`
- What changed:
    - Fixed token application regressions by replacing fragile `hsl(var(...))` arbitrary classes with stable token utility classes.
    - Added explicit token utility helpers for hover/background/border variants used by dashboard components.
    - Updated remaining hover/focus patterns (`hover:k-*`) to explicit token-based color classes so interactive states render correctly.
- Why changed:
    - Reported off-theme rendering where tokenized styles were not consistently applying in UI.

## 2026-03-19 13:21:07 IST (+0530)

- DateTime: `2026-03-19 13:21:07 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `188-204,234-240,354-369`
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `18,24`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `35-93`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `57-103`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `14-25`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `15-40`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `23-38`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `12-42`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `17-28`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `10-37`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `19`
    - file: `CHANGELOG.md`
    - diff lines: `16-55`
- What changed:
    - Added dashboard semantic design tokens in `globals.css` and reusable token utility classes (`k-shell-bg`, `k-surface`, `k-text-*`, `k-brand*`, `k-cta-*`, etc.).
    - Migrated active dashboard/shell components from hardcoded hex/slate utility colors to token-based color usage.
    - Preserved existing layout/behavior while centralizing visual control through token variables.
- Why changed:
    - Requested updating `globals.css` to match current components and move to token-based styling.

## 2026-03-19 13:11:20 IST (+0530)

- DateTime: `2026-03-19 13:11:20 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `24-26`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `31-95`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `57-105`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `23,26,42`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `9-26`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `14-42`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `22-40`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `11-45`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `17-30`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `10-38`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `33,48`
    - file: `CHANGELOG.md`
    - diff lines: `16-47`
- What changed:
    - Reduced overall dashboard and shell UI size by another ~10% through direct file-level adjustments.
    - Tightened sidebar width/padding, topbar height/search/action sizing, card spacing, chart heights, table density, and badge/icon sizing.
    - Kept functional behavior and data wiring unchanged.
- Why changed:
    - Requested an additional overall 10% size decrease.

## 2026-03-19 13:05:20 IST (+0530)

- DateTime: `2026-03-19 13:05:20 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `24-26`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `60-61`
    - file: `CHANGELOG.md`
    - diff lines: `16-27`
- What changed:
    - Reworked shell alignment by separating topbar row from content padding.
    - Set topbar to fixed row height (`68px`) and full-width structure to align cleanly with the sidebar logo row.
    - Removed prior negative-margin approach causing visual drift.
- Why changed:
    - Reported alignment issue in screenshot for top header/title positioning.

## 2026-03-19 13:03:13 IST (+0530)

- DateTime: `2026-03-19 13:03:13 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `24`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `60`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-130212`
    - diff lines: `1-116`
    - file: `src/components/kyochi/AppShell.tsx.bkp.20260319-130212`
    - diff lines: `1-28`
    - file: `CHANGELOG.md`
    - diff lines: `16-31`
- What changed:
    - Aligned topbar vertically with sidebar logo row by removing top padding from the main shell.
    - Set topbar to full-width white strip (same background as sidebar) across content area with matching divider.
- Why changed:
    - Requested same background color as sidebar and alignment at the same level as logo row.

## 2026-03-19 13:01:23 IST (+0530)

- DateTime: `2026-03-19 13:01:23 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `1,52-116`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-130008`
    - diff lines: `1-112`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Refactored top header to match the new reference structure: left page title, centered search/command input, and right actions.
    - Replaced dashboard greeting strip behavior with concise title-first topbar (`Dashboard`) on dashboard route.
    - Added primary CTA button (`Create Appointment`) and retained notifications/avatar controls.
- Why changed:
    - Provided an additional design reference and requested alignment with that header/topbar pattern.

## 2026-03-19 12:58:36 IST (+0530)

- DateTime: `2026-03-19 12:58:36 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `77-93`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-125820`
    - diff lines: `1-113`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Converted dashboard header to a strict single-row strip layout (greeting + right actions) without subtitle line.
    - Kept non-dashboard pages capable of showing subtitle while dashboard stays flat and aligned to target style.
- Why changed:
    - Reported mismatch where the highlighted top strip should match reference and not include the clipped secondary line.

## 2026-03-19 12:55:29 IST (+0530)

- DateTime: `2026-03-19 12:55:29 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `77`
    - file: `src/components/kyochi/DashboardHeader.tsx.bkp.20260319-125453`
    - diff lines: `1-113`
    - file: `CHANGELOG.md`
    - diff lines: `16-29`
- What changed:
    - Changed dashboard header from boxed card style to a flat strip style with only a bottom divider.
    - Removed card-like container treatment to match the target reference structure.
- Why changed:
    - Requested "like that, not like this" for the top dashboard header presentation.

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

## 2026-03-19 14:14:27 IST (+0530)

- DateTime: `2026-03-19 14:14:27 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `36-42`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `9,13,17,35-43`
    - file: `src/components/kyochi/KyochiDashboard.tsx`
    - diff lines: `25,41`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `1,17,26`
    - file: `src/components/kyochi/icons.tsx`
    - diff lines: `1-52`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `4-8,29,42,55,77,95`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `4,65,73,87,89,92,101`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `2,18`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `1-4,15`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `2,4,16,24`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `1,15`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `1-10,37,50-56`
    - file: `src/components/kyochi/index.ts`
    - diff lines: `13`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `176,186`
    - file: `src/types/index.ts`
    - diff lines: `1-20,24,48,58`
    - file: `src/app/globals.css`
    - diff lines: `1,10-31,188-209,273-294,440-456,825-899,834`
    - file: `src/app/layout.tsx`
    - diff lines: `30-36`
- What changed:
    - Fixed chart axis clipping by changing bottom labels to centered grids and adding safe left/right plot insets.
    - Aligned lower dashboard section by making insights card stretch and anchor actions consistently.
    - Migrated active Kyochi dashboard icon usage to Lucide components (sidebar, header, KPI, insights, alerts, appointments, banner).
    - Removed Material Symbols dependency and conflicting duplicate root theme block that was overriding Kyochi tokens.
- Why changed:
    - Requested chart/table/insight alignment fixes and full Lucide icon usage with consistent theme behavior.

## 2026-03-19 14:17:49 IST (+0530)

- DateTime: `2026-03-19 14:17:49 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `36`
    - file: `CHANGELOG.md`
    - diff lines: `+`
- What changed:
    - Locked sidebar brand row to fixed `62px` height with non-shrinking behavior so it aligns exactly with the header strip baseline.
- Why changed:
    - Requested tiny alignment fix between header and sidebar top rows.

## 2026-03-19 14:21:57 IST (+0530)

- DateTime: `2026-03-19 14:21:57 IST (+0530)`
- File changes:
    - file: `audit/design-audit-2026-03-19.md`
    - diff lines: `1-118`
    - file: `CHANGELOG.md`
    - diff lines: `+`
- What changed:
    - Added comprehensive design compliance audit comparing implemented project UI with `DesignArtifact/kyochi-theme-guide.html`.
    - Included quantified adherence score, section-wise matrix, followed vs pending lists, route snapshot, and prioritized remediation plan.
- Why changed:
    - Requested complete cross-check report and explicit list of how much is followed vs not followed.

## 2026-03-19 14:27:29 IST (+0530)

- DateTime: `2026-03-19 14:27:29 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `67,75,79,86`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `20,24-25`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `17,21,40`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `25-26,39`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `15-16,20,29-32,38-39,41-42`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `18,22-23,25,28`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `14,25-26,28,30,39`
    - file: `src/components/kyochi/FeaturePlaceholder.tsx`
    - diff lines: `8-12`
- What changed:
    - Applied first "design rhythm" pass by normalizing typography tiers (`type-h3`, `type-small`, `type-label`) across active dashboard cards, tables, insights, alerts, and header controls.
    - Replaced remaining placeholder card hardcoded slate/white styling with Kyochi token classes for consistent surface/border/text rhythm.
- Why changed:
    - Requested to execute the audit recommendations and improve UI rhythm consistency.

## 2026-03-19 14:32:44 IST (+0530)

- DateTime: `2026-03-19 14:32:44 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `13-16,21,27,31,34-35,39-40`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `12,15-16,20-21,23,26,31-32`
    - file: `src/app/globals.css`
    - diff lines: `458-478`
    - file: `audit/design-audit-2026-03-19.md`
    - diff lines: `117-129`
- What changed:
    - Applied design rhythm Pass 2 token-purity updates by replacing remaining hardcoded colors in `AppointmentsPanel` and `AiInsightBanner`.
    - Added reusable `k-ai-banner-*` utility classes in globals for consistent dark insight card theming.
    - Updated audit report with remediation progress and revised adherence estimate.
- Why changed:
    - Requested to continue from audit and fix rhythm/theme consistency gaps.

## 2026-03-19 14:39:12 IST (+0530)

- DateTime: `2026-03-19 14:39:12 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `4,71-84,87`
- What changed:
    - Removed header search input/shortcut block.
    - Updated "Create Appointment" button styling from blue CTA to Kyochi brand-gold token styling and aligned right action cluster spacing.
- Why changed:
    - Requested to remove search bar and align primary header action with project theme.

## 2026-03-19 14:41:34 IST (+0530)

- DateTime: `2026-03-19 14:41:34 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `25`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `72`
- What changed:
    - Tuned primary gold action buttons to a deeper gold background with warm cream text for better text/background harmony while keeping Kyochi palette.
- Why changed:
    - Requested improved visual matching of text and background in theme-consistent primary actions.

## 2026-03-19 14:43:30 IST (+0530)

- DateTime: `2026-03-19 14:43:30 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `73`
- What changed:
    - Removed the dropdown/toggle icon from the `Create Appointment` header button.
- Why changed:
    - Requested to remove the toggle from Create Appointment action.

## 2026-03-19 14:56:02 IST (+0530)

- DateTime: `2026-03-19 14:56:02 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `1-2,13-16,30-37`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `3-4,14-30`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `2,16-49`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `1-2,25-51`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `4-53`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `3-38`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `4-43`
    - file: `src/components/kyochi/FeaturePlaceholder.tsx`
    - diff lines: `1-20`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `5-51`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `6,62-91`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `9,52-60,98-100`
- What changed:
    - Migrated active Kyochi dashboard UI to shadcn-driven composition using `Card`, `Button`, `Badge`, `Table`, and `Avatar` primitives.
    - Preserved existing Kyochi look-and-feel by retaining semantic token classes (`k-*`, `type-*`) on top of shadcn primitives.
    - Kept route behavior, data wiring, and interactive behavior unchanged while swapping the UI composition layer.
- Why changed:
    - Requested to switch to shadcn-driven components without losing current UI feel.

## 2026-03-19 18:33:22 IST (+0530)

- DateTime: `2026-03-19 18:33:22 IST (+0530)`
- File changes:
    - file: `DESIGN.md`
    - diff lines: `1-141`
    - file: `CHANGELOG.md`
    - diff lines: `963-977`
    - file: `error.log`
    - diff lines: `154-157`
- What changed:
    - Added a new `DESIGN.md` handoff document tailored for Stitch AI with Kyochi theme constraints, token usage rules, typography, layout, route map, and acceptance checklist.
    - Logged the documentation update status in `error.log`.
- Why changed:
    - Requested to create a reusable design brief file that can be shared directly with Stitch AI.

## 2026-03-19 18:45:38 IST (+0530)

- DateTime: `2026-03-19 18:45:38 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `20-25`
    - file: `src/components/kyochi/AppointmentsPanel.tsx`
    - diff lines: `20-26`
    - file: `error.log`
    - diff lines: `154-157`
    - file: `CHANGELOG.md`
    - diff lines: `979-997`
- What changed:
    - Replaced Base UI Button `render={<Link .../>}` usage with semantic `Link` elements in appointment schedule actions.
    - Preserved the existing visual style while removing the native button semantics violation.
- Why changed:
    - Runtime console error reported that `nativeButton=true` expected a native `<button>` and flagged non-button rendering.

## 2026-03-19 18:48:32 IST (+0530)

- DateTime: `2026-03-19 18:48:32 IST (+0530)`
- File changes:
    - file: `DESIGN.md`
    - diff lines: `1-196`
    - file: `CHANGELOG.md`
    - diff lines: `997-1010`
    - file: `error.log`
    - diff lines: `158-161`
- What changed:
    - Reworked `DESIGN.md` into a complete design contract with full theme/token inventory, font/loading contract, shell/layout rules, route map, dataset contract, component composition rules, and explicit asset registry from `public/` and `DesignArtifact/`.
    - Added a ready-to-paste Stitch AI prompt aligned with current project tokens and design behavior.
- Why changed:
    - Requested that `DESIGN.md` fully define theme and assets for reliable Stitch AI handoff.

## 2026-03-19 20:08:43 IST (+0530)

- DateTime: `2026-03-19 20:08:43 IST (+0530)`
- File changes:
    - file: `src/types/index.ts`
    - diff lines: `22-31`
    - file: `src/components/kyochi/data.ts`
    - diff lines: `38-49,71-103`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `11-23`
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `24-29`
    - file: `src/components/kyochi/PatientInflow.tsx`
    - diff lines: `13-15,35-37`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `21-25`
    - file: `src/app/globals.css`
    - diff lines: `445-454`
    - file: `CHANGELOG.md`
    - diff lines: `1013-1040`
    - file: `error.log`
    - diff lines: `162-165`
- What changed:
    - Refactored status pill semantics to explicit healthcare SaaS colors: Completed green, Cancelled red, Pending amber, In Progress blue (white text).
    - Added KPI semantic border accents (left border): positive=green, alert=red, neutral=gold.
    - Changed `Pending Feedback` KPI urgency badge from gold warning to red/orange urgency style.
    - Updated Patient Inflow chart to trend-based color logic (downtrend red line + light red fill, uptrend green).
    - Restyled Clinical Insight card with soft blue intelligence accent (`#eff6ff` tone, blue icon, blue border).
    - Kept brand gold usage unchanged for sidebar active state, primary buttons, logo, and warm background system.
- Why changed:
    - Requested shift from monochrome brand-color usage to professional semantic information colors while preserving Kyochi brand identity.

## 2026-03-19 20:18:49 IST (+0530)

- DateTime: `2026-03-19 20:18:49 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/primitives.tsx`
    - diff lines: `25`
    - file: `CHANGELOG.md`
    - diff lines: `1045-1055`
    - file: `error.log`
    - diff lines: `166-169`
- What changed:
    - Forced `Completed` status pill text to explicit white using utility override (`!text-white`) to avoid style-layer conflicts.
- Why changed:
    - Requested to make the Completed text white.

## 2026-03-19 22:40:40 IST (+0530)

- DateTime: `2026-03-19 22:40:40 IST (+0530)`
- File changes:
    - file: `src/app/billing/page.tsx`
    - diff lines: `1-112`
    - file: `CHANGELOG.md`
    - diff lines: `1060-1072`
    - file: `error.log`
    - diff lines: `170-173`
- What changed:
    - Replaced the billing placeholder page with a real billing invoices table layout patterned after `DesignArtifact/DesignIdeas/billing-table-ui.html`.
    - Applied only the table layout structure (column rhythm, row hierarchy, actions alignment) while keeping Kyochi theme tokens and styling (`k-*`, warm surface palette, brand button styles).
    - Wired rows from local datasets (`billing.json`, `appointments.json`, `therapies.json`, `patients.json`) with status pills and contextual row metadata.
- Why changed:
    - Requested to use the billing table reference layout only, while preserving the existing project theme.

## 2026-03-19 22:43:29 IST (+0530)

- DateTime: `2026-03-19 22:43:29 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `17-24,65-168`
    - file: `src/app/patients/page.tsx`
    - diff lines: `25`
    - file: `src/app/therapists/page.tsx`
    - diff lines: `21`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `41`
    - file: `src/app/franchises/page.tsx`
    - diff lines: `19`
    - file: `src/app/billing/page.tsx`
    - diff lines: `56-58`
    - file: `CHANGELOG.md`
    - diff lines: `1077-1095`
    - file: `error.log`
    - diff lines: `174-177`
- What changed:
    - Refined shared management tables to match the requested layout style (compact uppercase headers, balanced row spacing, right-aligned actions, and footer pagination strip with "Showing 1-4 of N").
    - Removed subtitle/description lines from table cards/pages, including the patients text "Wellness profiles, contact details, and engagement status."
    - Removed billing table description line so table pages remain title-first and cleaner.
- Why changed:
    - Requested to apply the new table layout style and remove descriptive subtitle lines from every table screen.

## 2026-03-19 22:50:58 IST (+0530)

- DateTime: `2026-03-19 22:50:58 IST (+0530)`
- File changes:
    - file: `package.json`
    - diff lines: `dependencies`
    - file: `pnpm-lock.yaml`
    - diff lines: `dependency graph updated`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `1-190`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `1-120`
    - file: `src/app/patients/page.tsx`
    - diff lines: `1`
    - file: `src/app/therapists/page.tsx`
    - diff lines: `1`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `1`
    - file: `src/app/franchises/page.tsx`
    - diff lines: `1`
    - file: `src/app/billing/page.tsx`
    - diff lines: `1-100`
    - file: `CHANGELOG.md`
    - diff lines: `1104-1129`
    - file: `error.log`
    - diff lines: `178-181`
- What changed:
    - Introduced a real shadcn-style DataTable implementation powered by TanStack (`KyochiDataTable`) with core row model + pagination model.
    - Refactored `ManagementPageLayout` tables to use the new DataTable component instead of static table rendering.
    - Migrated `/billing` table to the same DataTable system.
    - Marked table pages as client components to support interactive DataTable behavior.
    - Added `@tanstack/react-table` dependency.
- Why changed:
    - Requested to use shadcn DataTable for these table views.
