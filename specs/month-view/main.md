# month-view

## Goal
Add a read-only monthly calendar to the athlete dashboard, rendered below the WeekStrip. The header shows the current month and year. Each day cell shows a thin color strip at the bottom for each discipline planned that day, based on the repeating `WEEKLY_SCHEDULE` — one strip per unique discipline. Strips use `DISCIPLINE_CONFIG` colors from `lib/constants.ts`. Days with no planned sessions show no strips. Week starts Monday (matching WeekStrip).

## Data source
`WEEKLY_SCHEDULE` from `components/WeekStrip.tsx` — the same 7-day repeating plan used by WeekStrip. The month view projects this pattern across every week of the current month. Journal entries are not used here (that integration is a future feature).

## Resolved decisions
- **Strip per unique discipline** — if a day has two strength sessions, one strip. Thu has strength + swim → two strips.
- **Week start: Monday** — matches WeekStrip's `getCurrentWeekDates` convention.
- **Strength label** — all strength sessions use label "Strength" (no Lower/Upper/Full Body).
- **Non-triathlon disciplines** — strength (`#E535AB`), brick (`#FFD700`), accessory (`#B366FF`), soccer (`#FFFFFF`) all come from `DISCIPLINE_CONFIG`.
- **No async loading** — `WEEKLY_SCHEDULE` is a static constant; no fetch, no loading state.

## Slices
- [ ] Slice 1 — date-utilities: Extract `localDateKeyInTz` and `WEEKLY_SCHEDULE` to shared modules so MonthView can consume them without duplicating TZ logic
- [ ] Slice 2 — calendar-shell: Render the month grid with correct Mon-start alignment, day numbers, and month/year header
- [ ] Slice 3 — discipline-strips: Map each day to its `WEEKLY_SCHEDULE` entry, render unique discipline strips at the bottom of each cell
- [ ] Slice 4 — multi-discipline-days: Handle days with 2+ disciplines (e.g. Thu: strength + swim) — stack strips cleanly

## Out of scope
- Navigating to previous/next months
- Clicking a day to see detail
- Showing actual completed workouts (journal entries) — future feature
- Today highlight (can be added later)
- Accessibility / aria labels

## Open questions
- Should `WEEKLY_SCHEDULE` move to `lib/schedule.ts` or stay in `WeekStrip.tsx` and be exported? (Affects how MonthView imports it)
- Should past days in the current month appear dimmed, or identical to future days?
