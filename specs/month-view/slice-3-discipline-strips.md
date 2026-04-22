# Slice 3 — Discipline Strips

## What this slice delivers
Each day cell shows a thin horizontal color strip at the bottom for each unique discipline planned on that day, looked up from `WEEKLY_SCHEDULE` by day-of-week. Colors come from `DISCIPLINE_CONFIG` in `lib/constants.ts`. Days with no planned sessions remain plain. This covers all 7 discipline types: swim, bike, run, strength (pink `#E535AB`), brick, accessory, soccer.

## Tasks
- [ ] Import `WEEKLY_SCHEDULE` and `DISCIPLINE_CONFIG` into `MonthView.tsx`
- [ ] For each day cell, compute day-of-week (0=Mon … 6=Sun) and look up the matching `WEEKLY_SCHEDULE` entry
- [ ] Collect unique disciplines from the day's AM + PM sessions
- [ ] Render one `h-1.5` strip per unique discipline, pinned to the bottom of the cell, colored via `DISCIPLINE_CONFIG[discipline].color`
- [ ] Days with no sessions render no strips

## Files likely touched
- `components/MonthView.tsx`

## Acceptance criteria
- Mon/Wed/Fri cells show one strength strip (pink `#E535AB`)
- Tue cells show one swim strip (cyan `#00D4FF`)
- Wed cells show one bike strip (orange `#FF6B2B`)
- Sat cells show one run strip (green `#7CFF4B`)
- Sun cells show one bike strip
- Cells in padding rows (before day 1, after last day) show no strips
- Day number remains unaffected by strips
