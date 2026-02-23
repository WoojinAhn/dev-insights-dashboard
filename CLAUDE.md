# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered developer portfolio dashboard that visualizes GitHub activity for [WoojinAhn](https://github.com/WoojinAhn). Deployed at [woojinahn-dev.vercel.app](https://woojinahn-dev.vercel.app).

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # ESLint
```

### Data Pipeline (runs in GitHub Actions, can run locally)

```bash
./refresh-data.sh          # Fetch GitHub data via gh CLI + run AI analysis
python3 analyze-portfolio.py  # AI analysis only (requires GEMINI_API_KEY or GH_TOKEN)
```

Requires `gh` CLI authenticated, plus env vars: `GEMINI_API_KEY`, `GH_TOKEN` (PAT for GitHub Models fallback).

## Architecture

### Two-Phase System: Data Pipeline → Static Frontend

1. **Data Pipeline** (Python + shell, runs in CI or manually):
   - `refresh-data.sh` fetches GitHub data (user profile, repos, pinned, forks) via `gh` CLI → writes JSON to `public/data/`
   - `analyze-portfolio.py` sends repo data to Gemini 2.0 Flash (fallback: GitHub Models GPT-4o-mini) → writes `public/data/analysis.json`
   - Analysis produces bilingual (en/ko) content: summary, strengths, AI capabilities, research interests

2. **Frontend** (Next.js App Router, single-page client component):
   - `app/page.tsx` — the entire dashboard UI as a single `'use client'` component. Fetches all JSON from `public/data/` at runtime with cache-busting query params.
   - `lib/data.ts` — server-side data loading utilities with TypeScript interfaces (used during build, not by the client page)
   - `lib/translations.ts` — i18n strings for en/ko toggle

### Data Flow

```
GitHub API → refresh-data.sh → public/data/*.json → analyze-portfolio.py → public/data/analysis.json
                                                   ↓
                                        app/page.tsx (client-side fetch)
```

All data files in `public/data/` are committed to git and auto-updated by the `daily-insight.yml` GitHub Actions workflow (daily at 00:00 KST + on push to main). The workflow force-pushes data changes and triggers a Vercel deploy hook.

### Key Data Files

- `public/data/user.json` — GitHub user profile
- `public/data/repos.json` — public source repositories
- `public/data/pinned.json` — pinned repositories
- `public/data/forks.json` — forked repositories (with parent stats)
- `public/data/analysis.json` — AI-generated bilingual analysis (en/ko sections, ai_capabilities, interests)
- `public/data/history/` — archived raw AI responses

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Lucide React
- **Data Pipeline:** Python 3 (google-generativeai SDK), Bash (gh CLI)
- **Deployment:** Vercel (auto-deploy via webhook), GitHub Actions

## Conventions

- The dashboard is a single-page app — all UI lives in `app/page.tsx`
- Glassmorphism design with `bg-slate-900/40 backdrop-blur-xl border border-white/5` pattern
- Rounded corners use large values: `rounded-[2rem]`, `rounded-[2.5rem]`
- Color scheme: cyan for primary accents, violet for AI capabilities, indigo for research/interests
- Featured projects priority: pinned repos first, then AI-recommended, then by star count
