# Kyochi UI Design Handoff (for Stitch AI)

## Product Context
Kyochi is a wellness/clinical operations dashboard.
The UI must feel:
- Warm clinical
- Premium but calm
- Data-focused
- Lightweight and readable

This project is built with Next.js + shadcn/ui + Tailwind v4 + Kyochi tokens.

## Primary Goal
Generate or modify screens **without changing the existing visual identity**.
Use shadcn primitives for structure, and Kyochi token classes for final look.

## Non-Negotiables
1. Keep current Kyochi look and feel (gold + cream + slate-blue text rhythm).
2. Do not switch to generic SaaS style (no purple gradients, no neon accents, no harsh black borders).
3. Use shadcn components as the base layer.
4. Preserve route shell pattern: sidebar + top header shared via layout.
5. Typography must stay Manrope-first with DM Serif only for selective brand/display usage.

## Tech + UI Stack
- Framework: Next.js App Router
- UI primitives: shadcn (`Button`, `Card`, `Badge`, `Table`, `Avatar`, `Input`, etc.)
- Icons: Lucide only
- Styling source: `src/app/globals.css` (Kyochi tokens + utility classes)

## Design Source of Truth
1. `src/app/globals.css` (active token/utility source)
2. `DESIGN.md` (this file)
3. `DesignArtifact/kyochi-theme-guide.html` (reference guide)

## Core Visual Tokens (Use These)
- Brand gold: `--kyochi-gold-400` (`#d4af35`)
- Deeper primary action gold: `--kyochi-gold-500`
- Surface: `--k-color-surface`
- Shell background: `--k-color-shell-bg`
- Soft border: `--k-color-border-soft`
- Strong text: `--k-color-text-strong`
- Body text: `--k-color-text-body`
- Subtle text: `--k-color-text-subtle`

### Required utility classes
Use these before adding raw Tailwind colors:
- Surfaces: `k-shell-bg`, `k-surface`, `k-surface-muted`
- Text: `k-text-strong`, `k-text-body`, `k-text-subtle`, `k-brand`, `k-brand-strong`
- Border: `k-border-soft`, `k-brand-border-soft`
- States: `k-status-completed`, `k-status-progress`, `k-status-waiting`
- Alert tones: `k-tone-amber`, `k-tone-red`, `k-tone-blue`, `k-tone-slate`
- Buttons/backgrounds: `k-brand-bg`, `k-brand-bg-hover`, `k-cta-bg`, `k-cta-bg:hover`

## Typography Rules
- H1: Manrope 800 / ~30px
- H2: Manrope 700 / ~24px
- H3: Manrope 700 / ~20px
- Body: Manrope 400 / ~16px
- Small: Manrope 600 / ~13px
- Label: Manrope 700 / ~11px uppercase
- Display brand text only: DM Serif

Use existing classes:
- `type-h1`, `type-h2`, `type-h3`, `type-body`, `type-small`, `type-label`, `display-heading`

## Layout Pattern
- Left fixed sidebar (`w-60` desktop) with grouped nav sections
- Top header strip (`h-[62px]`) aligned with sidebar brand row
- Main content in 3-part dashboard flow:
  1. KPI row
  2. Charts row
  3. Table + insight row

## Route Map
- `/` (currently dashboard)
- `/dashboard`
- `/patients`
- `/therapists`
- `/therapies`
- `/appointments`
- `/billing`
- `/ai-insights`
- `/analytics`

## Data Wiring Rules
Dashboard values are data-driven from local JSON:
- `data/patients.json`
- `data/therapists.json`
- `data/therapies.json`
- `data/appointments.json`
- `data/billing.json`
- `data/ai_insights.json`
- `data/analytics.json`

Do not hardcode KPI numbers if data mapping exists.

## Component Rules (Important)
- Compose with shadcn first, then apply Kyochi token classes.
- Avoid raw `text-slate-*`, `bg-white`, hardcoded hex unless absolutely necessary.
- Keep corner radii soft (mostly `rounded-xl`).
- Keep shadows subtle; no heavy drop shadows.
- Keep motion minimal and purposeful.

## Icon Rules
- Lucide only.
- Use centralized mapping pattern (`IconKey -> Lucide`) when icons are data-driven.
- Keep icon stroke clean and medium weight.

## Accessibility Baseline
- Maintain visible focus states.
- Ensure button text contrast remains readable on gold backgrounds.
- Provide meaningful labels for icon-only controls.

## “Do Not Do” List
- Do not replace Kyochi gold palette.
- Do not add new design system unrelated to existing tokens.
- Do not introduce random font stacks.
- Do not turn cards into sharp-corner enterprise style.
- Do not switch to dense tables without breathing space.

## Acceptance Checklist for Stitch Output
- Uses shadcn primitives
- Uses Kyochi token classes for color/text/surfaces
- Typography follows `type-*` classes
- Sidebar/header alignment preserved
- Lucide icons only
- No major visual drift from current dashboard
- Works on desktop and mobile

## Optional Prompt Snippet for Stitch AI
"Build this screen using shadcn primitives and Kyochi token classes from `globals.css`. Preserve the current Kyochi warm clinical style: cream surfaces, gold accents, soft borders, readable slate-blue text, rounded-xl cards, subtle shadows, and Manrope typography. Do not introduce new colors or visual language. Keep Lucide icons only and maintain existing shell structure (sidebar + top header)."
