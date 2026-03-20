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

## 2026-03-19 22:57:54 IST (+0530)

- DateTime: `2026-03-19 22:57:54 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `22-31,47-75,91-138`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `25,34-35,110`
    - file: `src/app/patients/page.tsx`
    - diff lines: `41`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `58`
    - file: `src/app/billing/page.tsx`
    - diff lines: `91`
    - file: `CHANGELOG.md`
    - diff lines: `1139-1156`
    - file: `error.log`
    - diff lines: `182-185`
- What changed:
    - Updated DataTable alignment system so all column headers are centered.
    - Set body alignment default to left for text/string cells.
    - Added per-page explicit centered-body column config for numeric/badge columns only.
    - Applied centered-body mapping on key pages (patients wellness score, appointments status, billing price + status).
- Why changed:
    - Requested centered headers with body-left default and center alignment only for number/badge columns.

## 2026-03-19 23:00:41 IST (+0530)

- DateTime: `2026-03-19 23:00:41 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `33-84,118-146`
    - file: `CHANGELOG.md`
    - diff lines: `1165-1176`
    - file: `error.log`
    - diff lines: `186-189`
- What changed:
    - Enforced fixed-width table layout via `table-fixed` + `colgroup` (stable select/actions widths and evenly distributed data columns).
    - Enabled proper text wrapping in both headers and body cells (`whitespace-normal` + `break-words`) for consistent multi-line behavior.
    - Applied controlled row hover expansion: row content min-height increases from `56px` to `84px` (~1.5x) on hover.
- Why changed:
    - Requested stronger visual alignment consistency across all columns and hover expansion to improve scan/readability.

## 2026-03-19 23:03:06 IST (+0530)

- DateTime: `2026-03-19 23:03:06 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `208-211,296-299,496-551`
    - file: `src/components/ui/button.tsx`
    - diff lines: `7-40`
    - file: `CHANGELOG.md`
    - diff lines: `1182-1196`
    - file: `error.log`
    - diff lines: `190-193`
- What changed:
    - Updated global Kyochi button utility classes (`.k-btn*`) to match the provided theme-guide specification (base, primary, secondary, ghost, dark, sm, lg, icon).
    - Added token aliases (`--gold`, `--text`, `--text-2`, `--surface`) in light/dark roots to support theme-guide button semantics.
    - Remapped shadcn `Button` variants/sizes in `src/components/ui/button.tsx` to consume Kyochi button classes while preserving shadcn API usage.
- Why changed:
    - Requested theme-guide button behavior but implemented through shadcn button primitives.

## 2026-03-19 23:04:57 IST (+0530)

- DateTime: `2026-03-19 23:04:57 IST (+0530)`
- File changes:
    - file: `src/app/patients/page.tsx`
    - diff lines: `42`
    - file: `src/app/therapists/page.tsx`
    - diff lines: `36`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `58`
    - file: `src/app/franchises/page.tsx`
    - diff lines: `33`
    - file: `CHANGELOG.md`
    - diff lines: `1201-1216`
    - file: `error.log`
    - diff lines: `194-197`
- What changed:
    - Expanded DataTable centered-body column mapping to include `ID` and `Phone` columns where present.
    - Updated page-specific center alignment configs:
      - patients: `ID`, `Phone`, `Wellness`
      - therapists: `ID`
      - appointments: `ID`, `Status`
      - franchises: `ID`, `Phone`
- Why changed:
    - Requested center alignment for phone number and id in table body.

## 2026-03-19 23:09:35 IST (+0530)

- DateTime: `2026-03-19 23:09:35 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `4,12,62-76`
    - file: `src/app/billing/page.tsx`
    - diff lines: `3,68-82`
    - file: `CHANGELOG.md`
    - diff lines: `1227-1239`
    - file: `error.log`
    - diff lines: `198-201`
- What changed:
    - Center-aligned `Actions` column body cells in shared DataTable.
    - Replaced default action text buttons (`Edit`, `Delete`) with icon-only shadcn buttons (Pencil, Trash).
    - Replaced billing table custom action text buttons with icon-only shadcn buttons (Eye, Bell).
- Why changed:
    - Requested actions column alignment and icon-based actions instead of text labels.

## 2026-03-19 23:12:41 IST (+0530)

- DateTime: `2026-03-19 23:12:41 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `33-80,124-132`
    - file: `CHANGELOG.md`
    - diff lines: `1246-1257`
    - file: `error.log`
    - diff lines: `202-205`
- What changed:
    - Switched row sizing behavior from min-height expansion to strict fixed-height row control.
    - Implemented exact hover scaling rule at row level: `56px` default → `84px` on hover (1.5x).
    - Kept wrap behavior with fixed layout while constraining cell content via overflow handling for consistency.
- Why changed:
    - Requested row size to remain fixed and grow to 1.5x specifically on hover.

## 2026-03-19 23:24:06 IST (+0530)

- DateTime: `2026-03-19 23:24:06 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/tableConfigs.ts`
    - diff lines: `1-41`
    - file: `src/app/billing/page.tsx`
    - diff lines: `11,85,95,98`
    - file: `CHANGELOG.md`
    - diff lines: `1259-1274`
    - file: `error.log`
    - diff lines: `210-213`
- What changed:
    - Added a centralized `tableViewConfigs` registry covering each management table with per-view `columns`, `centeredBodyColumns`, `includedDataFields`, and `excludedDataFields`.
    - Updated billing page table wiring to consume shared config (`tableViewConfigs.billing`) instead of hardcoded column/alignment arrays.
    - Ensured `franchises` config keeps `city` and `region` body columns centered via index mapping.
- Why changed:
    - Requested a single config that defines column alignment and include/exclude data scope per table, and to center city/region body cells.

## 2026-03-19 23:28:05 IST (+0530)

- DateTime: `2026-03-19 23:28:05 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `63-71,145-153`
    - file: `CHANGELOG.md`
    - diff lines: `1276-1288`
    - file: `error.log`
    - diff lines: `214-217`
- What changed:
    - Enforced strict row and cell height behavior in the shared DataTable (`56px` default, `84px` on hover).
    - Added content clamping inside data cells (`2` lines default, `3` lines on hover) so multiline text cannot force uncontrolled row expansion.
    - Kept existing wrap behavior while preventing variable-height overflow from long fields (for example franchise addresses).
- Why changed:
    - Requested strict fixed row height with exactly 1.5x hover height to prevent table layout issues.

## 2026-03-20 00:24:03 IST (+0530)

- DateTime: `2026-03-20 00:24:03 IST (+0530)`
- File changes:
    - file: `src/app/franchises/page.tsx`
    - diff lines: `36-41`
    - file: `src/app/billing/page.tsx`
    - diff lines: `50-58`
    - file: `CHANGELOG.md`
    - diff lines: `1290-1303`
    - file: `error.log`
    - diff lines: `218-221`
- What changed:
    - Standardized franchise table body cells to plain text rendering (removed per-cell bold/small/link styling overrides).
    - Standardized billing table text cells to plain body text (removed mixed bold/sub-label treatment in therapy and amount cells).
    - Kept semantic status badges intact while normalizing non-badge column typography.
- Why changed:
    - Requested consistent text style across table columns.

## 2026-03-20 00:36:53 IST (+0530)

- DateTime: `2026-03-20 00:36:53 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/data.ts`
    - diff lines: `245-344`
    - file: `src/app/layout.tsx`
    - diff lines: `4,30-35`
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `6-8,15,22`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `11-27,101`
    - file: `src/types/index.ts`
    - diff lines: `47`
    - file: `src/app/my-appointments/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/my-patients/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/add-feedback/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/my-ratings/page.tsx`
    - diff lines: `1-10`
    - file: `src/app/my-session-history/page.tsx`
    - diff lines: `1-10`
    - file: `CHANGELOG.md`
    - diff lines: `1305-1338`
    - file: `error.log`
    - diff lines: `222-225`
- What changed:
    - Replaced static sidebar nav with role-based navigation sets for `admin`, `franchisee`, and `therapist`, using the exact section structure and labels requested.
    - Added role resolver and env-driven role selection (`NEXT_PUBLIC_KYOCHI_ROLE`) in `layout.tsx`.
    - Passed role through app shell to sidebar and updated profile subtitle by role.
    - Added therapist route scaffolds: `/my-appointments`, `/my-patients`, `/add-feedback`, `/my-ratings`, `/my-session-history`.
    - Updated intelligence label to `AI Strategy` where specified.
- Why changed:
    - Requested role-specific sidebar menus and navigation structure for Admin, Franchisee, and Therapist.

## 2026-03-20 00:48:19 IST (+0530)

- DateTime: `2026-03-20 00:48:19 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/data.ts`
    - diff lines: `303-321`
    - file: `src/lib/roleScope.ts`
    - diff lines: `1-34`
    - file: `src/app/appointments/page.tsx`
    - diff lines: `9,13-16,41-48,56,61`
    - file: `src/app/patients/page.tsx`
    - diff lines: `8,22-35,43,47-51,56`
    - file: `src/app/add-feedback/page.tsx`
    - diff lines: `1-86`
    - file: `src/app/my-appointments/page.tsx`
    - diff lines: `deleted`
    - file: `src/app/my-patients/page.tsx`
    - diff lines: `deleted`
    - file: `src/app/my-ratings/page.tsx`
    - diff lines: `deleted`
    - file: `src/app/my-session-history/page.tsx`
    - diff lines: `deleted`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `4-16,21,28-59,125-140`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `3,76-116`
    - file: `CHANGELOG.md`
    - diff lines: `1340-1380`
    - file: `error.log`
    - diff lines: `226-229`
- What changed:
    - Removed therapist-only extra routes and switched therapist navigation to global pages (`/appointments`, `/patients`, `/add-feedback`) with role-based dataset filtering.
    - Added shared role scoping helper for therapist-specific appointment/patient visibility.
    - Implemented a fully data-backed `Add Feedback` page that respects role scope.
    - Added sortable column headers for all data columns in shared DataTable and removed toolbar `Sort` button.
    - Updated table toolbar layout: `Filter` moved next to search, export actions centered, and `Add` moved to the far-right as last action.
- Why changed:
    - Requested no extra role pages, role-filtered global pages, no `/my-ratings` and `/my-session-history`, plus per-column sorting and updated table toolbar arrangement.

## 2026-03-20 00:52:49 IST (+0530)

- DateTime: `2026-03-20 00:52:49 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `58`
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `28`
    - file: `CHANGELOG.md`
    - diff lines: `1382-1393`
    - file: `error.log`
    - diff lines: `230-233`
- What changed:
    - Made the shared dashboard header fixed to viewport top.
    - Added sidebar-aware left offset at desktop (`lg:left-60`) so fixed header aligns with the main canvas.
    - Added top spacing to page content container so all pages render below the fixed header.
- Why changed:
    - Requested header to stay fixed like the sidebar.

## 2026-03-20 00:54:27 IST (+0530)

- DateTime: `2026-03-20 00:54:27 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `28`
    - file: `CHANGELOG.md`
    - diff lines: `1395-1404`
    - file: `error.log`
    - diff lines: `234-237`
- What changed:
    - Adjusted main content top offset to exactly `62px` to match the fixed header row height.
- Why changed:
    - Requested header/content alignment to be on the same title row baseline.

## 2026-03-20 06:39:02 IST (+0530)

- DateTime: `2026-03-20 06:39:02 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/AppShell.tsx`
    - diff lines: `28-30`
    - file: `CHANGELOG.md`
    - diff lines: `1406-1416`
    - file: `error.log`
    - diff lines: `238-241`
- What changed:
    - Restored top breathing space above page content/KPI sections by adding inner top padding while preserving the fixed 62px header offset.
- Why changed:
    - Reported missing space above KPI cards after header row alignment update.

## 2026-03-20 06:42:00 IST (+0530)

- DateTime: `2026-03-20 06:42:00 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `73-80`
    - file: `CHANGELOG.md`
    - diff lines: `1418-1428`
    - file: `error.log`
    - diff lines: `242-245`
- What changed:
    - Tightened toolbar top spacing below section title.
    - Kept `Filters` on the same row next to the search input (no drop to next line on desktop).
- Why changed:
    - Reported extra gap and misalignment in toolbar row.

## 2026-03-20 06:43:45 IST (+0530)

- DateTime: `2026-03-20 06:43:45 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `70-109`
    - file: `CHANGELOG.md`
    - diff lines: `1430-1440`
    - file: `error.log`
    - diff lines: `246-249`
- What changed:
    - Moved search input and all table action buttons into the same row as the section title inside the card header.
    - Removed the separate toolbar row below the title.
- Why changed:
    - Requested search and action buttons to be on the title row.

## 2026-03-20 06:46:53 IST (+0530)

- DateTime: `2026-03-20 06:46:53 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `24-31,49-69,162-181,194`
    - file: `src/app/billing/page.tsx`
    - diff lines: `3,12,22-26,48-104,119-120`
    - file: `CHANGELOG.md`
    - diff lines: `1442-1454`
    - file: `error.log`
    - diff lines: `250-253`
- What changed:
    - Added DataTable theming controls (`tone`, `showSelection`) and implemented a softer table surface option with muted header/row styling.
    - Applied reference-style billing table treatment: stacked therapy cell, soft semantic status pills with dot indicators, and contextual action controls (`Generate Receipt` / `Accept Payment`, `Close Appointment`).
    - Hid selection checkbox column for billing table and enabled soft table tone.
- Why changed:
    - Requested table theme to match the provided billing reference style while preserving project theme.

## 2026-03-20 06:52:23 IST (+0530)

- DateTime: `2026-03-20 06:52:23 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/tableConfigs.ts`
    - diff lines: `25`
    - file: `CHANGELOG.md`
    - diff lines: `1456-1465`
    - file: `error.log`
    - diff lines: `254-257`
- What changed:
    - Updated appointments table centered-body mapping to include `Date` and `Time` columns.
- Why changed:
    - Requested date and time values to be centered in appointments table.

## 2026-03-20 07:41:14 IST (+0530)

- DateTime: `2026-03-20 07:41:14 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `111-116`
    - file: `CHANGELOG.md`
    - diff lines: `1467-1476`
    - file: `error.log`
    - diff lines: `258-261`
- What changed:
    - Applied shared `tone="soft"` table styling in management layout so all management tables inherit the same billing-style table theme.
- Why changed:
    - Requested all tables to follow the billing table theme.

## 2026-03-20 07:45:33 IST (+0530)

- DateTime: `2026-03-20 07:45:33 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `496-527`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `252`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `41`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `23`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `53-56,94-99`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `16-20`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `76`
    - file: `CHANGELOG.md`
    - diff lines: `1478-1496`
    - file: `error.log`
    - diff lines: `262-265`
- What changed:
    - Rebalanced UI color dominance from gold-heavy to neutral-first by making default primary buttons ink/dark and reducing gold hover-border emphasis on cards.
    - Shifted key actions toward neutral/CTA blue treatments and reduced gold-filled controls in header, management tables, alerts footer, AI banner CTA, and pagination active state.
    - Neutralized KPI card accents (borders/icon chips) in dashboard and management views while preserving selective gold accents in brand areas (logo, active nav, focused highlights).
- Why changed:
    - Requested better balance between gold, white, and black so gold remains an accent instead of the dominant UI color.

## 2026-03-20 07:50:53 IST (+0530)

- DateTime: `2026-03-20 07:50:53 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `496-527`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `53-56,86-99`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `16-20`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `76`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `21,30`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `252`
    - file: `CHANGELOG.md`
    - diff lines: `1498-1514`
    - file: `error.log`
    - diff lines: `266-269`
- What changed:
    - Re-aligned primary button and card-hover behavior with `kyochi-theme-guide.html` (gold primary CTA, guide-style gold hover emphasis).
    - Restored guide-consistent gold accent usage in header CTA, KPI accents, recommendation card chip/primary CTA, and active table pagination.
    - Kept surface/background neutrality while returning to theme-guide accent hierarchy.
- Why changed:
    - Requested balancing to match the theme set from `DesignArtifact/kyochi-theme-guide.html`.

## 2026-03-20 08:30:23 IST (+0530)

- DateTime: `2026-03-20 08:30:23 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `65-88,166-206,434-440`
    - file: `CHANGELOG.md`
    - diff lines: `1516-1525`
    - file: `error.log`
    - diff lines: `270-273`
- What changed:
    - Applied global gold-theme rebalance through root semantic tokens: warmer shell/surface/muted/border/text values to create consistent gold-tinted ambiance across all pages.
    - Updated dashboard semantic hex tokens to gold-forward values for shell, cards, borders, text, and row-hover states.
    - Added subtle multi-layer gold atmospheric background treatment to `.k-shell-bg` so theme reads throughout the full application.
- Why changed:
    - Requested application-wide gold theme treatment similar to provided reference mood.

## 2026-03-20 08:35:33 IST (+0530)

- DateTime: `2026-03-20 08:35:33 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `65-88,166-206,434`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `43-53,81`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `76`
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `16-20`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `53-56,86,94,98`
    - file: `src/components/kyochi/RevenueSnapshot.tsx`
    - diff lines: `25-28`
    - file: `CHANGELOG.md`
    - diff lines: `1527-1544`
    - file: `error.log`
    - diff lines: `274-277`
- What changed:
    - Refined app-wide gold theme toward the provided CRM reference feel: neutral shell + white surfaces with controlled gold accents.
    - Updated sidebar styling (logo treatment, active gradient pill, softer chrome) and compacted KPI/action card accents.
    - Retuned primary action buttons to lighter gold with dark text for better contrast balance and reference-like tone.
    - Added compact legend treatment in revenue chart header for a cleaner dashboard-analytics look.
- Why changed:
    - Requested trying the provided reference style across the application while keeping Kyochi branding.

## 2026-03-20 08:38:39 IST (+0530)

- DateTime: `2026-03-20 08:38:39 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `30-32,70-101`
    - file: `CHANGELOG.md`
    - diff lines: `1546-1556`
    - file: `error.log`
    - diff lines: `278-281`
- What changed:
    - Removed section title rendering from management table headers.
    - Kept only search and action controls in the header row, matching the provided layout direction.
    - Cleaned unused `title` destructuring to satisfy lint.
- Why changed:
    - Requested to remove title and keep the toolbar-only row style like the shared reference.

## 2026-03-20 08:43:24 IST (+0530)

- DateTime: `2026-03-20 08:43:24 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KpiGrid.tsx`
    - diff lines: `15-30`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `35-76`
    - file: `CHANGELOG.md`
    - diff lines: `1558-1569`
    - file: `error.log`
    - diff lines: `282-285`
- What changed:
    - Restyled dashboard and management KPI cards to match `kpi-card.html` structure: left gold accent border, compact icon tile, compact status pill, uppercase label, larger primary value, and tighter metadata rhythm.
    - Added KPI delta text-tone mapping for inline value-support text in management cards while preserving existing semantic behavior.
- Why changed:
    - Requested KPI cards to follow the provided reference design.

## 2026-03-20 08:46:41 IST (+0530)

- DateTime: `2026-03-20 08:46:41 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `3,68-103`
    - file: `CHANGELOG.md`
    - diff lines: `1571-1580`
    - file: `error.log`
    - diff lines: `286-289`
- What changed:
    - Applied toolbar style from `kyochi_toolbar.html` to shared management toolbar: compact 36px controls, search field with leading icon, grouped action buttons, and separator before export/print controls.
    - Updated Add CTA to compact gold button treatment consistent with reference rhythm.
- Why changed:
    - Requested trying toolbar layout/style from provided design artifact.

## 2026-03-20 08:56:12 IST (+0530)

- DateTime: `2026-03-20 08:56:12 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `72,77,94-98,113,205,212`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `39-45`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Centered table row content on the Y-axis using full-height flex alignment in shared table cells and action/select columns.
    - Reduced the shared table row system by 25% (`56/84` to `42/63`) and aligned recent appointments row cells vertically.
- Why changed:
    - Requested all rows to be Y-axis centered and row height reduced by one-fourth.

## 2026-03-20 08:58:15 IST (+0530)

- DateTime: `2026-03-20 08:58:15 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `98`
    - file: `src/components/kyochi/RecentAppointmentsTable.tsx`
    - diff lines: `40,43-44`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Reduced table body text size for shared data tables and recent appointments rows to a smaller, denser scale (`12px` with tightened line-height).
- Why changed:
    - Requested decreasing table column body text size.

## 2026-03-20 09:00:13 IST (+0530)

- DateTime: `2026-03-20 09:00:13 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `171,206-208`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Updated soft table theme to align with `kyochi_appointments_table.html` aesthetics (warm muted header tone and refined row treatment).
    - Added explicit odd/even zebra striping for table body rows with gentle hover state on top.
- Why changed:
    - Requested applying the appointments table reference style and differentiating even/odd rows.

## 2026-03-20 09:02:49 IST (+0530)

- DateTime: `2026-03-20 09:02:49 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `7,80-81,117-118,125-126`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `158`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Removed boxed container styling around management toolbar and table area.
    - Removed outer table wrapper border/rounded box in soft table mode.
- Why changed:
    - Requested removing the box around table and toolbar.

## 2026-03-20 09:08:33 IST (+0530)

- DateTime: `2026-03-20 09:08:33 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `513,515,522-523,527-528,531-532,537-538,546-547,555-557,559-561`
    - file: `src/components/ui/button.tsx`
    - diff lines: `17`
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `176-181,193,238-274`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `2,24-29`
    - file: `src/app/billing/page.tsx`
    - diff lines: `12,74-98`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Standardized shared button tokens to match `kyochi_button_system.html` (primary/secondary/ghost/icon sizing and colors).
    - Updated destructive variant styling in shared `Button` component to match the reference destructive tone.
    - Replaced remaining raw `<button>` usage with shared `Button` component in data table, AI banner, and billing actions.
- Why changed:
    - Requested using the button system from `kyochi_button_system.html` across the project.

## 2026-03-20 09:26:11 IST (+0530)

- DateTime: `2026-03-20 09:26:11 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `521,538-540,546-548,553-563,587-589`
    - file: `src/components/ui/button.tsx`
    - diff lines: `17`
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `66,76,80,86,89`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `63,105`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `91,96,103,107,112`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `30,33`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `32,41`
    - file: `src/components/kyochi/AiInsightBanner.tsx`
    - diff lines: `27`
    - file: `src/app/billing/page.tsx`
    - diff lines: `74,77,85,87,93,95`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Promoted `globals.css` as the authoritative button design source by expanding shared button states (`secondary/ghost/dark/destructive/icon` hover behavior and typography rhythm).
    - Mapped `destructive` variant in shared `Button` to global class token (`k-btn-destructive`).
    - Removed component-level button color overrides and migrated active UI buttons to shared variants/sizes with only layout-related class overrides.
- Why changed:
    - Requested project-wide adoption of the unified button system with `globals.css` as the single design truth.

## 2026-03-20 09:31:19 IST (+0530)

- DateTime: `2026-03-20 09:31:19 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `82-113`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Reordered the shared management toolbar into two functional groups: discovery (`search`, `filters`, `export`, `print`) and creation (`upload`, `add`).
    - Updated toolbar layout to use left/right grouped alignment while preserving responsive wrapping.
- Why changed:
    - Requested toolbar reordering into discovery and creation.

## 2026-03-20 09:36:30 IST (+0530)

- DateTime: `2026-03-20 09:36:30 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/DashboardHeader.tsx`
    - diff lines: `66,76,80,86,89`
    - file: `src/components/kyochi/ManagementPageLayout.tsx`
    - diff lines: `92,97,101,108,113`
    - file: `src/components/kyochi/Sidebar.tsx`
    - diff lines: `63`
    - file: `src/components/kyochi/InsightRecommendationCard.tsx`
    - diff lines: `30,33`
    - file: `src/components/kyochi/AlertsPanel.tsx`
    - diff lines: `41`
    - file: `src/app/billing/page.tsx`
    - diff lines: `86,93`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Removed remaining button shape/style overrides (`rounded-full`, `rounded-xl`, extra radius styles) from active UI screens.
    - Kept only structural/layout classes on buttons so final appearance consistently comes from the shared global button system.
- Why changed:
    - Reported that multiple buttons still did not match the global pattern.

## 2026-03-20 09:38:56 IST (+0530)

- DateTime: `2026-03-20 09:38:56 IST (+0530)`
- File changes:
    - file: `src/components/kyochi/KyochiDataTable.tsx`
    - diff lines: `115-119`
    - file: `src/app/billing/page.tsx`
    - diff lines: `77`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Standardized row action buttons to compact outline icon controls (`icon-xs`) for consistent table action styling.
    - Updated billing row action overflow button to use the same outline icon action style.
- Why changed:
    - Requested fixing row actions to follow the shared button pattern.

## 2026-03-20 09:42:12 IST (+0530)

- DateTime: `2026-03-20 09:42:12 IST (+0530)`
- File changes:
    - file: `src/app/globals.css`
    - diff lines: `570-575,596-612`
    - file: `src/components/ui/button.tsx`
    - diff lines: `17,19,26-27,30-31`
    - file: `CHANGELOG.md`
    - diff lines: `end`
    - file: `error.log`
    - diff lines: `end`
- What changed:
    - Rewrote the shared shadcn `Button` system to match `kyochi_button_system.html` standards for size scale and variant coverage.
    - Added medium button size token (`36px`), icon size tokens (`40/36/30`), and destructive-outline variant in global button styles.
    - Extended shared `Button` API with `tertiary`, `destructive-outline`, and normalized size mapping (`default=40`, `sm/md=36`, `xs=30`).
- Why changed:
    - Requested making the Kyochi button system reference the standard for the shared shadcn button component.
