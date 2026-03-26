<h1 align="center">Kyochi Wellness Intelligence Platform</h1>
<p align="center">🌿 A premium Next.js dashboard for wellness operations and clinical intelligence</p>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?style=flat-square&logo=supabase" />
  <img src="https://img.shields.io/badge/Font-Manrope-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/License-Internal-orange?style=flat-square" />
</p>

---

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Data Model Mapping](#data-model-mapping)
8. [Application Routes](#application-routes)
9. [Available Scripts](#available-scripts)
10. [Design Philosophy](#design-philosophy)
11. [Deployment](#deployment)
12. [License and Contribution](#license-and-contribution)

---

## Introduction

Kyochi is a sophisticated wellness and clinical operations platform built with Next.js 15 and Supabase. It provides a "Warm Clinical" dashboard experience designed to manage patient care, therapist scheduling, and franchise performance with integrated AI-driven insights.

---

## Features

- ✅ **Wellness Intelligence**: AI-powered dashboard with real-time business signals, top 3 therapy demand tracking, and franchise footprint visualization.
- ✅ **Role-Based Access**: Specialized views for Admins, Franchisees, Therapists, and Patients via Supabase RLS.
- ✅ **Access Manager**: Dedicated workflow for reviewing and approving role-based access requests.
- ✅ **Clinical Management**: Comprehensive CRUD operations for:
  - Patients & Wellness Scoring
  - Therapists & Specializations
  - Therapy Plans & Categories
  - Appointment Lifecycle (Scheduled → In Progress → Completed)
- ✅ **Financial Ops**: Billing, invoicing, and uncollected revenue tracking.
- ✅ **Premium UI**: Custom "Warm Clinical" design system using Manrope typography and a gold/cream palette.

---

## Tech Stack

| Tool | Description |
| ---- | ----------- |
| [Next.js 15](https://nextjs.org/) | App Router framework with Turbopack |
| [React 19](https://react.dev/) | UI library with concurrent rendering |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS v4](https://tailwindcss.com/) | Next-generation utility-first styling |
| [Supabase](https://supabase.com/) | Postgres DB, Auth, and Row Level Security |
| [Lucide React](https://lucide.dev/) | Consistent iconography system |
| [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions and animations |
| [Shadcn/UI](https://ui.shadcn.com/) | Accessible component primitives |

---

## Getting Started

### Clone the Repository

```bash
git clone <your-repo-url>
cd kyochi
```

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Database Setup

Apply migrations and seed data using the Supabase CLI:

```bash
supabase migration up
supabase db seed
```

### Run the Development Server

```bash
pnpm dev
```

Open `http://localhost:3000`.

---

## Project Structure

```bash
.
├── src/
│   ├── app/                    # App Router (Pages & API)
│   │   ├── wellness-intelligence/ # AI Verdict & Business Signals
│   │   ├── access-manager/     # Role Approval Workflow
│   │   ├── patients/           # Patient Management
│   │   ├── therapists/         # Therapist Management
│   │   └── api/                # Supabase-backed API Routes
│   ├── components/
│   │   ├── kyochi/             # Brand-specific dashboard components
│   │   └── ui/                 # Shadcn/UI primitives
│   ├── lib/
│   │   ├── supabase/           # Client & Server DB logic
│   │   ├── data/               # Bootstrap & Fetching hooks
│   │   └── metrics.ts          # KPI & Formula calculations
│   └── types/                  # Shared TypeScript interfaces
├── supabase/
│   ├── migrations/             # SQL schema & RLS policies
│   └── seed.sql                # Initial development data
├── public/                     # Brand assets (logo, icons)
├── DESIGN.md                   # Visual Identity & Token guide
└── README.md
```

---

## Configuration

### Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Data Model Mapping

| Service | Table | Key Metric |
| ------- | ----- | ---------- |
| Patients | `patients` | Wellness Score (0-100) |
| Therapists | `therapists` | Utilization Rate |
| Appointments | `appointments` | Success Rate |
| Billing | `billing` | Collection Rate |
| Franchises | `franchises` | Footprint Density |

---

## Application Routes

| Route | Description |
| ----- | ----------- |
| `/dashboard` | Primary operations overview |
| `/wellness-intelligence` | AI strategy & deep business signals |
| `/access-manager` | Admin tool for role approvals |
| `/patients` | Patient profiles & health tracking |
| `/therapists` | Staff management & scheduling |
| `/appointments` | Session lifecycle management |
| `/billing` | Revenue and invoice tracking |

---

## Available Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Build for production
pnpm start    # Run production build
pnpm lint     # Linting check
pnpm test     # Run Vitest suite
```

---

## Design Philosophy

Kyochi follows a **"Warm Clinical"** aesthetic:
- **Typography**: Manrope (800 for display, 400-600 for UI/Body).
- **Palette**: Cream surfaces (`#fdfcfa`), Gold accents (`#d4af35`), and clinical Slate-blue text.
- **Rhythm**: Rounded-xl (16px) cards, soft shadows, and spacious data tables.

---

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel.
2. Configure Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
3. Vercel will automatically detect Next.js and deploy.

---

## License and Contribution

Internal project for Kyochi Wellness.

## 🤝 Contribution Guidelines

- Follow the **Research → Strategy → Execution** lifecycle.
- Maintain consistent use of design tokens from `globals.css`.
- All database changes must be submitted via `supabase/migrations`.

---
