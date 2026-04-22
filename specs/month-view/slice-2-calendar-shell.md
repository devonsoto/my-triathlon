# Slice 2 — Calendar Shell

## What this slice delivers
A `MonthView` component that renders a full calendar grid for the current month. Header shows "April 2026" style formatting using Oswald (`font-display`). Grid is 7 columns, Monday-start (matching WeekStrip). Day numbers sit in the top-left of each cell. No strip data yet — just the structural grid mounted in `app/athlete/page.tsx` below `<WeekStrip />`.

## Tasks
- [ ] Create `components/MonthView.tsx`
- [ ] Detect current month/year using `localDateKeyInTz` from `lib/utils.ts`
- [ ] Compute grid: first-day-of-month weekday offset (Mon=0), total days, trailing padding — fixed at 6 rows
- [ ] Render day-of-week header row: Mon Tue Wed Thu Fri Sat Sun
- [ ] Render day cells: day number top-left, fixed height, subtle border, dark background
- [ ] Render month/year title above the grid
- [ ] Mount `<MonthView />` in `app/athlete/page.tsx` below `<WeekStrip />`

## Files likely touched
- `components/MonthView.tsx` (new)
- `app/athlete/page.tsx`

## Acceptance criteria
- Month and year appear correctly in the header
- Grid is always 6 rows × 7 columns (fixed height, no layout jump month-to-month)
- Day 1 lands on the correct Monday-anchored column
- Padding cells before day 1 and after the last day are blank
- Component renders below WeekStrip on the athlete dashboard
- Empty journal / zero planned sessions renders without errors
