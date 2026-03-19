# Kyochi Design Audit
Date: 2026-03-19
Reference: `DesignArtifact/kyochi-theme-guide.html`
Scope: Active app shell + active dashboard/route components (excluding `.bkp`, `.old` backups)

## Executive Summary
- Overall adherence: **78%**
- Fully aligned areas: **tokens/foundations, route shell structure, Lucide icon adoption, dataset-driven dashboard**
- Partially aligned areas: **typography application consistency, component primitive usage, visual polish consistency**
- Not aligned areas: **some active components still use hardcoded colors instead of token classes; several guide components exist in CSS but are not yet wired into real screens**

## Scoring Matrix
| Area | Weight | Score | Notes |
|---|---:|---:|---|
| Color Tokens & Semantics | 20 | 18 | Core palette and semantic Kyochi tokens are implemented in globals. |
| Typography System | 15 | 10 | Manrope + DM Serif loaded, but several active screens still use ad-hoc text classes instead of `type-*` utilities. |
| Layout & Shell | 15 | 13 | Shared shell/header/sidebar and route-level consistency implemented. |
| Component System Usage | 15 | 10 | Guide utilities exist, but not all active views consume `k-*` primitives uniformly. |
| Iconography | 10 | 10 | Active dashboard shell/components now use Lucide mappings. |
| Interaction/States | 10 | 7 | Basic hover/focus/status states exist; consistency is partial. |
| Responsiveness | 10 | 7 | Mobile sidebar drawer + responsive grids exist; some dense sections still need tighter mobile ergonomics. |
| Accessibility Basics | 5 | 3 | Basic labels and contrast mostly okay; no systematic a11y pass (focus order/ARIA coverage). |
| **Total** | **100** | **78** | **Good progress, but not fully theme-guide complete yet.** |

## What We Follow (Implemented)
1. **Brand token foundations are present**
- Gold/Cream/Green/Red scales and semantic tokens are defined.
- Evidence: [globals.css](/home/rael/build/movicloud/Main/kyochi/src/app/globals.css)

2. **Typography fonts are configured at layout level**
- Manrope + DM Serif are loaded via Next font and exposed as CSS vars.
- Evidence: [layout.tsx](/home/rael/build/movicloud/Main/kyochi/src/app/layout.tsx)

3. **Shared app shell pattern is implemented**
- Sidebar + header are centralized and reused across routes.
- Evidence: [AppShell.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/AppShell.tsx), [layout.tsx](/home/rael/build/movicloud/Main/kyochi/src/app/layout.tsx)

4. **Dashboard is dataset-driven**
- KPIs/charts/appointments/alerts derive from `data/*.json` through mapping logic.
- Evidence: [data.ts](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/data.ts)

5. **Sidebar routing and active-state logic follow app route model**
- Active nav is pathname-derived; route wiring exists for top-level pages.
- Evidence: [Sidebar.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/Sidebar.tsx), [src/app](/home/rael/build/movicloud/Main/kyochi/src/app)

6. **Lucide icon migration for active Kyochi UI is done**
- Typed icon map (`IconKey -> Lucide`) and active usage across header/sidebar/KPI/alerts.
- Evidence: [icons.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/icons.tsx), [DashboardHeader.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/DashboardHeader.tsx), [Sidebar.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/Sidebar.tsx)

7. **Theme override conflict removed**
- Duplicate bottom `:root/.dark` block no longer overrides Kyochi tokens.
- Evidence: [globals.css](/home/rael/build/movicloud/Main/kyochi/src/app/globals.css)

## What We Don’t Fully Follow Yet (Gaps)
1. **Typography utility usage is inconsistent in active UI**
- Guide defines explicit text tiers (`type-h1/h2/h3/body/small/label`), but many active components still use ad-hoc `text-[..]` classes.
- Impact: subtle visual drift from guide rhythm.
- Evidence: [DashboardHeader.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/DashboardHeader.tsx), [KpiGrid.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/KpiGrid.tsx)

2. **Some active components still use hardcoded colors**
- Not all active screens are token-pure yet.
- Examples include `bg-white`, `text-slate-*`, and hex literals in feature/banner/legacy components.
- Evidence: [FeaturePlaceholder.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/FeaturePlaceholder.tsx), [AiInsightBanner.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/AiInsightBanner.tsx), [AppointmentsPanel.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/AppointmentsPanel.tsx)

3. **Guide component catalog exists but is not comprehensively consumed**
- CSS includes robust `k-btn/k-badge/k-chip/k-input/k-tabs/k-progress/k-metric` primitives, but active pages still rely on local one-off class stacks in multiple places.
- Impact: maintainability and consistency debt.
- Evidence: [globals.css](/home/rael/build/movicloud/Main/kyochi/src/app/globals.css), active component files under [src/components/kyochi](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi)

4. **AI Insight visual style differs from guide’s flagship treatment**
- Guide shows dark gradient premium card; active dashboard uses light `InsightRecommendationCard` (with dark `AiInsightBanner` component present but not primary in dashboard).
- Evidence: [InsightRecommendationCard.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/InsightRecommendationCard.tsx), [AiInsightBanner.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/AiInsightBanner.tsx), [KyochiDashboard.tsx](/home/rael/build/movicloud/Main/kyochi/src/components/kyochi/KyochiDashboard.tsx)

5. **Accessibility is not yet audited against guide-level quality**
- No dedicated a11y checklist evidence (contrast matrix, keyboard nav coverage, aria relationships) beyond basic labels.

## Route-Level Snapshot (Active Screens)
- `/dashboard`: **Mostly aligned** (shell, tokens, data wiring, iconography) with partial typography and primitive-consistency gaps.
- `/ai-insights`: **Partially aligned** (alerts panel uses token style; placeholder block still legacy slate/white classes).
- `/patients`, `/therapists`, `/therapies`, `/appointments`, `/billing`, `/analytics`: **Partially aligned scaffolds** (functional placeholders, not full theme-guide component depth).

## Followed vs Not-Followed Checklist
### Followed
- Global tokenized palette and semantic layers.
- Shared app layout shell and route wiring.
- Dashboard data wiring from JSON datasets.
- Lucide icons in active Kyochi dashboard shell/components.
- Recent alignment fixes for charts/table/insights.

### Not Fully Followed
- Full token-only styling across every active component.
- Consistent use of typography utility classes everywhere.
- Full adoption of guide primitive components (`k-btn`, `k-badge`, `k-chip`, etc.) in active screens.
- Guide premium AI insight style as primary active pattern.
- Formal accessibility audit and remediation pass.

## Recommended Next Steps (Priority Order)
1. **Token-purity pass**
- Replace remaining hardcoded classes in active components with `k-*` semantic classes.

2. **Typography normalization pass**
- Apply `type-h1/h2/h3/body/small/label` classes consistently in active pages/components.

3. **Primitive adoption pass**
- Refactor action buttons, pills, badges, input/search, and chips to use shared `k-*` primitives instead of per-component ad-hoc utility stacks.

4. **AI insight style decision**
- Choose one canonical pattern (dark premium vs light clinical) and align both dashboard + AI page to that single standard.

5. **A11y pass**
- Add keyboard/ARIA/focus/contrast checks and fix issues.

## Audit Method
- Compared guide definitions (palette, typography, spacing/radius, component catalog) with active implementation files.
- Excluded backup files (`*.bkp*`, `*.old*`) from compliance scoring.
- Checked route wiring, data binding, and active component usage.

## Remediation Progress Update (2026-03-19 14:32 IST)
- Completed Pass 1:
  - Typography tier normalization on active dashboard surfaces (`type-h3`, `type-small`, `type-label`).
  - Tokenized placeholder route card styling.
- Completed Pass 2:
  - Token-purity conversion for `AppointmentsPanel` (removed hardcoded slate/hex classes).
  - Token-purity conversion for `AiInsightBanner` with reusable banner token utility classes in globals.
- Current estimated adherence after remediation passes: **84%**.
- Remaining highest-impact gaps:
  - Expand token-purity pass to any remaining non-token utility usage in active UI edge cases.
  - Broader primitive adoption (`k-btn`, `k-badge`, `k-chip`) in all route pages and future feature screens.
  - Dedicated accessibility pass (keyboard/ARIA/contrast).
