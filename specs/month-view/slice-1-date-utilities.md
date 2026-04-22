# Slice 1 — Date Utilities

## What this slice delivers
Two shared primitives extracted before any calendar rendering begins: (1) `localDateKeyInTz` moved from `WeekStrip.tsx` into `lib/utils.ts` so both WeekStrip and MonthView use the same TZ-safe date key logic; (2) `WEEKLY_SCHEDULE` exported from `WeekStrip.tsx` (or moved to `lib/schedule.ts`) so MonthView can import the plan without duplicating the constant.

## Tasks
- [ ] Move `localDateKeyInTz` from `components/WeekStrip.tsx` into `lib/utils.ts` and export it
- [ ] Update `WeekStrip.tsx` to import `localDateKeyInTz` from `lib/utils.ts`
- [ ] Export `WEEKLY_SCHEDULE` (and its `Session` / day types) from `WeekStrip.tsx`, or move to `lib/schedule.ts`
- [ ] Verify WeekStrip still works correctly after the refactor

## Files likely touched
- `lib/utils.ts`
- `components/WeekStrip.tsx`
- `lib/schedule.ts` (new, if WEEKLY_SCHEDULE is moved)

## Acceptance criteria
- `localDateKeyInTz` is importable from `lib/utils.ts`
- `WeekStrip.tsx` passes all existing visual checks (no regression)
- `WEEKLY_SCHEDULE` is importable by files outside `WeekStrip.tsx`
- No duplicate TZ helper code exists in the codebase
