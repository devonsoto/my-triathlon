# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## File Structure

```
my-triathlon/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, Header, pt-14 wrapper
│   ├── globals.css                   # Tailwind v4 @theme, CSS variables, dark mode
│   ├── page.tsx                      # Home (not yet customized)
│   ├── favicon.ico
│   ├── actions/
│   │   └── whoop.ts                  # Server actions: WHOOP weekly + monthly workout fetch
│   └── athlete/
│       ├── page.tsx                  # Athlete dashboard: countdown, WeekStrip, MonthView, discipline cards
│       └── journal/
│           └── page.tsx              # Training journal: list/detail/new-entry
├── components/
│   ├── Header.tsx                    # Fixed nav header with tri-color stripe
│   ├── MonthView.tsx                 # Read-only monthly calendar, WHOOP-backed discipline strips
│   ├── WeekStrip.tsx                 # Read-only 7-day schedule strip on athlete dashboard
│   └── ui/                           # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       └── textarea.tsx
├── hooks/
│   ├── useJournal.ts                 # Journal entry CRUD via server actions
│   ├── useWhoop.ts                   # Fetches today's WHOOP recovery/sleep summary
│   ├── useWhoopWorkouts.ts           # Fetches WHOOP workouts for a given week
│   └── useWhoopMonthWorkouts.ts      # Fetches WHOOP workouts for the current month
├── lib/
│   ├── constants.ts                  # DISCIPLINE_TAGS, MOODS, DISCIPLINE_ACCENT, DISCIPLINE_CONFIG
│   ├── schedule.ts                   # WEEKLY_SCHEDULE, Session type
│   ├── types.ts                      # JournalEntry
│   ├── utils.ts                      # cn() (clsx + tailwind-merge), localDateKeyInTz()
│   └── whoop/                        # WHOOP API client, service, types, sport mappings
├── public/                           # Static assets (default Next.js SVGs)
├── components.json                   # shadcn/ui config
├── eslint.config.mjs                 # Flat ESLint config (next core-web-vitals + TS)
├── postcss.config.mjs                # @tailwindcss/postcss
└── tsconfig.json
```

## Commands

```bash
pnpm dev        # Start development server at http://localhost:3000
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Architecture

This is a Next.js 16 app using the App Router with React 19 and Tailwind CSS v4.

- `app/layout.tsx` — Root layout; registers Geist (sans/mono) and Oswald fonts as CSS variables (`--font-geist-sans`, `--font-geist-mono`, `--font-oswald`)
- `app/globals.css` — Global styles; `@theme` block maps CSS variables to Tailwind utilities (e.g. `font-display` → Oswald)
- `app/athlete/page.tsx` — Athlete dashboard: live race countdown, `<WeekStrip />`, `<MonthView />`, discipline cards
- `app/athlete/journal/page.tsx` — Training journal: list/detail/new-entry views
- `app/page.tsx` — Default Next.js home page (not yet customized)
- `components/ui/` — shadcn/ui primitives: `card`, `button`, `input`, `textarea`, `badge`, `separator`
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge); `localDateKeyInTz(d, tz)` for TZ-safe YYYY-MM-DD keys
- `lib/schedule.ts` — `WEEKLY_SCHEDULE` (Mon–Sun training plan) and `Session` type; used by WeekStrip
- `lib/types.ts` — Shared TypeScript interfaces: `JournalEntry`
- `lib/constants.ts` — Shared constants: `DISCIPLINE_TAGS`, `MOODS`, `DISCIPLINE_ACCENT`, `DISCIPLINE_CONFIG`
- `hooks/useJournal.ts` — Journal entry CRUD via server actions
- `hooks/useWhoop.ts` — Fetches today's WHOOP recovery/sleep summary
- `hooks/useWhoopWorkouts.ts` — Fetches WHOOP workouts for a given week (used by WeekStrip)
- `hooks/useWhoopMonthWorkouts.ts` — Fetches WHOOP workouts for the current month (used by MonthView)

Styling uses Tailwind CSS v4 (configured via `@tailwindcss/postcss` in `postcss.config.mjs`). No separate `tailwind.config.*` — all theme customization lives in the `@theme` block in `globals.css`.

ESLint uses the flat config format (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals and TypeScript rules.

## Skills

The `frontend-design` skill is installed. Use `/frontend-design` when building new pages or UI components to get high-quality, distinctive designs that match the dark athletic aesthetic of this app.

## App Design

Sprint triathlon training app. Currently single-user (hardcoded athlete config at the top of each page). Auth and multi-user support are planned for later.

**Athlete data** is kept in a clearly marked `const ATHLETE` at the top of `app/athlete/page.tsx` — replace with dynamic data when auth is added.

**Fonts:** Oswald (`font-display`) for headings/numbers; Geist (`font-sans`) for body text.

**Discipline accent colors:** Swim `#00D4FF`, Bike `#FF6B2B`, Run `#7CFF4B`. Always use `DISCIPLINE_CONFIG` from `lib/constants.ts` for color lookups — it covers all 7 discipline types. Never hardcode colors.

**All 7 discipline types** (in `DISCIPLINE_CONFIG`): swim `#00D4FF`, bike `#FF6B2B`, run `#7CFF4B`, strength `#E535AB` 🏋️, accessory `#B366FF` 🎯, brick `#FFD700` 💪, soccer `#FFFFFF` ⚽.

**Data storage:** `useJournal` uses server actions. All WHOOP hooks (`useWhoop`, `useWhoopWorkouts`, `useWhoopMonthWorkouts`) call server actions in `app/actions/whoop.ts`, which cache responses via `unstable_cache` with a 5-minute revalidation.

**WEEKLY_SCHEDULE:** Lives in `lib/schedule.ts` (not in WeekStrip). Defines the Mon–Sun repeating training plan. WeekStrip imports it to show the planned week; it is not used for the MonthView (which shows actual WHOOP workouts instead).

**TZ safety:** Always use `localDateKeyInTz(date, tz)` from `lib/utils.ts` to produce YYYY-MM-DD keys — never use `toISOString()` or `toLocaleDateString()` for date bucketing, as they will mis-bucket entries around DST boundaries or midnight.
