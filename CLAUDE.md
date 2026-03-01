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
│   └── athlete/
│       ├── page.tsx                  # Athlete dashboard: countdown, discipline cards
│       ├── journal/
│       │   └── page.tsx              # Training journal: list/detail/new-entry
│       └── mental/
│           └── page.tsx              # Mental game: confidence, visualization, quotes
├── components/
│   ├── Header.tsx                    # Fixed nav header with tri-color stripe
│   └── ui/                           # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── separator.tsx
│       └── textarea.tsx
├── hooks/
│   ├── useJournal.ts                 # localStorage CRUD — key: tri-journal
│   ├── useConfidence.ts              # localStorage confidence + history — key: tri-confidence
│   ├── useVisualization.ts           # localStorage visualization notes — key: tri-visualization
│   └── useMotivationalWall.ts        # localStorage motivational quotes — key: tri-motivation
├── lib/
│   ├── constants.ts                  # DISCIPLINES, DISCIPLINE_TAGS, MOODS, VISUALIZATION_SECTIONS, DISCIPLINE_ACCENT
│   ├── types.ts                      # JournalEntry, ConfidenceEntry, MotivationalItem
│   └── utils.ts                      # cn() (clsx + tailwind-merge)
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
- `app/athlete/page.tsx` — Athlete dashboard: live race countdown, discipline cards
- `app/athlete/journal/page.tsx` — Training journal: list/detail/new-entry views, localStorage-backed
- `app/athlete/mental/page.tsx` — Mental game: confidence meter with sparklines, race day visualization, motivational wall
- `app/page.tsx` — Default Next.js home page (not yet customized)
- `features/` — Feature-scoped components organized by domain (reserved for future use)
- `components/ui/` — shadcn/ui primitives: `card`, `button`, `input`, `textarea`, `badge`, `separator`
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `lib/types.ts` — Shared TypeScript interfaces: `JournalEntry`, `ConfidenceEntry`, `MotivationalItem`
- `lib/constants.ts` — Shared constants: `DISCIPLINES`, `DISCIPLINE_TAGS`, `MOODS`, `VISUALIZATION_SECTIONS`, `DISCIPLINE_ACCENT`
- `hooks/useJournal.ts` — localStorage CRUD for journal entries (seeded with 3 example entries on first load)
- `hooks/useConfidence.ts` — localStorage for per-discipline confidence ratings + sparkline history
- `hooks/useVisualization.ts` — localStorage for race day visualization notes (keyed by section)
- `hooks/useMotivationalWall.ts` — localStorage CRUD for motivational quotes

Styling uses Tailwind CSS v4 (configured via `@tailwindcss/postcss` in `postcss.config.mjs`). No separate `tailwind.config.*` — all theme customization lives in the `@theme` block in `globals.css`.

ESLint uses the flat config format (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals and TypeScript rules.

## Skills

The `frontend-design` skill is installed. Use `/frontend-design` when building new pages or UI components to get high-quality, distinctive designs that match the dark athletic aesthetic of this app.

## App Design

Sprint triathlon training app. Currently single-user (hardcoded athlete config at the top of each page). Auth and multi-user support are planned for later.

**Athlete data** is kept in a clearly marked `const ATHLETE` at the top of `app/athlete/page.tsx` — replace with dynamic data when auth is added.

**Fonts:** Oswald (`font-display`) for headings/numbers; Geist (`font-sans`) for body text.

**Discipline accent colors:** Swim `#00D4FF`, Bike `#FF6B2B`, Run `#7CFF4B`. Always import from `lib/constants.ts` (`DISCIPLINES`, `DISCIPLINE_ACCENT`) — never hardcode them again.

**Data storage:** All user data lives in localStorage behind custom hooks in `hooks/`. The hooks abstract the storage layer so swapping to a backend later only requires changing the hook internals. Storage keys: `tri-journal`, `tri-confidence`, `tri-visualization`, `tri-motivation`.
