# Changelog

All notable changes to this project are documented in this file.

## 2026-03-19

### Added
- New route `/dashboard` via `src/app/dashboard/page.tsx`.
- Modular dashboard component system under `src/components/kyochi`:
  - `KyochiDashboard`, `Sidebar`, `DashboardHeader`, `KpiGrid`, `AppointmentsPanel`
  - `RevenueSnapshot`, `PatientInflow`, `AlertsPanel`, `AiInsightBanner`
  - Shared `primitives.tsx`, `types.ts`, `data.ts`, and `index.ts` exports.

### Changed
- `src/components/KyochiDashboard.tsx` now re-exports the modular implementation from `src/components/kyochi/KyochiDashboard`.

### Validation
- Type check passes: `pnpm -s tsc --noEmit`
- Lint passes with warnings: `pnpm -s lint`
- Production build passes: `pnpm -s build`
