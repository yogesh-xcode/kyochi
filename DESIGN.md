# DESIGN.md

## Purpose
This file is the design contract for generating Kyochi UI in Stitch AI.
If there is a conflict, follow this precedence:
1. `src/app/globals.css`
2. `src/app/layout.tsx`
3. This file
4. `DesignArtifact/kyochi-theme-guide.html`

## Product Visual Identity
Kyochi is a wellness + clinical operations dashboard.
Required visual feel:
- Warm clinical
- Premium calm
- Data-first, not decorative-first
- Soft surfaces, subtle depth, clear typography

## Tech + UI Stack
- Framework: Next.js App Router
- Component base: shadcn/ui primitives
- Styling: Tailwind v4 + token utilities from `globals.css`
- Icons: Lucide only
- Fonts loaded in layout:
  - Manrope (`--font-manrope`) as primary sans
  - DM Serif Display (`--font-dm-serif`) for limited display/brand text

## Layout Contract
- Shared shell is handled by `AppShell` in root layout.
- Desktop:
  - Left fixed sidebar (`w-60`)
  - Right content area with top strip header (`h-[62px]`)
- Mobile/tablet:
  - Sidebar becomes drawer/off-canvas
  - Header remains shared (no per-page duplicate chrome)

## Route Map
- `/`
- `/dashboard`
- `/patients`
- `/therapists`
- `/therapies`
- `/appointments`
- `/billing`
- `/ai-insights`
- `/analytics`

## Asset Registry (Use These)
### Brand + Runtime Assets (`public/`)
- `public/logo.svg`
  - Primary Kyochi brand mark (preferred for sidebar/logo areas)
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

### Design Reference Assets (`DesignArtifact/`)
- `DesignArtifact/kyochi-theme-guide.html` (main visual guide)
- `DesignArtifact/kyochi-globals.css` (legacy reference tokens)
- `DesignArtifact/kyochi-admin-dashboard.html` (layout style reference)
- `DesignArtifact/DesignIdeas/header1.ascii` (header concept)

Use `public/logo.svg` for brand display. Use Lucide icons for UI controls/status/nav unless explicitly asked to use an SVG asset.

## Data Contract
Dashboard and pages should derive display content from local datasets:
- `data/patients.json`
- `data/therapists.json`
- `data/therapies.json`
- `data/appointments.json`
- `data/billing.json`
- `data/ai_insights.json`
- `data/analytics.json`

Do not hardcode KPIs when data mapping exists.

## Core Token Inventory (From globals.css)
### Brand Palette
- Gold:
  - `--kyochi-gold-50` to `--kyochi-gold-900`
  - primary emphasis: `--kyochi-gold-400`
  - primary CTA depth: `--kyochi-gold-500`, hover `--kyochi-gold-600`
- Cream:
  - `--kyochi-cream-50` to `--kyochi-cream-900`
- Green (wellness positive):
  - `--kyochi-green-50` to `--kyochi-green-900`
- Red (alert):
  - `--kyochi-red-50` to `--kyochi-red-600`

### Semantic Dashboard Color Tokens
- `--k-color-shell-bg`
- `--k-color-surface`
- `--k-color-surface-muted`
- `--k-color-border-soft`
- `--k-color-text-strong`
- `--k-color-text-body`
- `--k-color-text-subtle`
- `--k-color-brand`
- `--k-color-brand-strong`
- `--k-color-brand-soft`
- `--k-color-brand-border`
- `--k-color-brand-soft-tint`
- `--k-color-row-hover`
- `--k-color-notify`
- `--k-color-cta`
- `--k-color-cta-hover`
- `--k-color-avatar-bg`
- `--k-color-overlay`

### Status + Tone Tokens
- Status:
  - `--k-color-status-positive-bg`, `--k-color-status-positive-fg`
  - `--k-color-status-progress-bg`, `--k-color-status-progress-fg`
  - `--k-color-status-waiting-bg`, `--k-color-status-waiting-fg`
- Alert tones:
  - `--k-color-alert-amber-bg`, `--k-color-alert-amber-fg`
  - `--k-color-alert-red-bg`, `--k-color-alert-red-fg`
  - `--k-color-alert-blue-bg`, `--k-color-alert-blue-fg`
  - `--k-color-alert-slate-bg`, `--k-color-alert-slate-fg`

### Radius Tokens
- `--radius`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-full`

### Shadow Tokens
- `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- `--shadow-gold`, `--shadow-gold-lg`

### Typography Tokens
- Fonts:
  - `--font-sans` => Manrope
  - `--font-display` => DM Serif Display
- Font size tokens:
  - `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl`

## Required Utility Classes
Prefer these over raw Tailwind color literals.
- Surfaces: `k-shell-bg`, `k-surface`, `k-surface-muted`
- Text: `k-text-strong`, `k-text-body`, `k-text-subtle`, `k-brand`, `k-brand-strong`
- Borders: `k-border-soft`, `k-brand-border-soft`
- Background helpers: `k-brand-bg`, `k-brand-soft-bg`, `k-brand-soft-tint-bg`, `k-cta-bg`
- Interaction: `k-row-hover`, `k-brand-bg-hover`, `k-brand-soft-bg-hover`
- Status chips: `k-status-completed`, `k-status-progress`, `k-status-waiting`
- Alert chips: `k-tone-amber`, `k-tone-red`, `k-tone-blue`, `k-tone-slate`
- Other: `k-avatar-bg`, `k-overlay`

## Typography Contract (Exact Intent)
- Display / brand: DM Serif only when needed
- H1: Manrope 800, ~30px (`type-h1`)
- H2: Manrope 700, ~24px (`type-h2`)
- H3: Manrope 700, ~20px (`type-h3`)
- Body: Manrope 400, ~16px (`type-body`)
- Small: Manrope 600, ~13px (`type-small`)
- Label: Manrope 700, ~11px uppercase (`type-label`)

## Component Composition Rules
Use shadcn primitives first, then apply Kyochi classes.
- Cards: `Card`, `CardHeader`, `CardContent`, `rounded-xl`, `k-surface`, `k-border-soft`, soft shadow
- Buttons: `Button` variants, with token classes for color
- Tables: `Table` with spacious row rhythm and soft dividers
- Badges/Pills: status classes above
- Avatars: `Avatar` + `k-avatar-bg`

## Chart + Insight Rules
- Keep chart blocks and table/insight blocks aligned on shared card grid.
- Use soft cream/gold visual hierarchy.
- Avoid heavy axis lines and dark borders.
- Keep 3 most recent appointments on dashboard summary when capped by product rules.

## Interaction Rules
- Sidebar active state from pathname (no static hardcoded active flags).
- CTA styling must stay in gold family unless explicitly overridden.
- Keep hover/focus visible but subtle.
- Minimize motion; no flashy animation.

## Accessibility Baseline
- Preserve keyboard focus visibility.
- Maintain readable contrast on gold buttons and muted surfaces.
- Add labels for icon-only actions.
- Keep hit targets comfortable on mobile.

## Hard Do/Don’t
### Do
- Keep visual rhythm and spacing calm and consistent.
- Use existing tokens + utility classes.
- Keep header/sidebar alignment exact.
- Keep Lucide iconography uniform.

### Don’t
- Don’t introduce unrelated palettes (purple/neon/harsh black outlines).
- Don’t replace shell structure with per-page custom chrome.
- Don’t swap to other icon packs.
- Don’t hardcode hex colors when token class exists.

## Stitch AI Prompt (Ready to Paste)
Build UI using shadcn primitives and Kyochi token utilities from `src/app/globals.css`. Preserve Kyochi’s warm clinical style: cream surfaces, gold accents, slate-blue readable text, rounded-xl cards, and subtle shadows. Use Manrope as primary typography and DM Serif Display only for display/brand moments. Use Lucide icons only. Keep shared app shell (sidebar + top strip header), maintain route structure, and keep content data-driven from `data/*.json` where applicable. Do not introduce new color systems or visual language.
