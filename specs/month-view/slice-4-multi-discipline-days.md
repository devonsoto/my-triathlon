# Slice 4 — Multi-Discipline Days

## What this slice delivers
Days with 2+ disciplines (Thursday: strength AM + swim PM) render multiple strips stacked at the bottom of the cell. Each strip is a distinct discipline color. A cap of 3 visible strips is enforced; if somehow a day had more than 3, a small "+N" overflow indicator appears. Strips remain visually clean and cell height stays fixed.

## Tasks
- [ ] Update strip rendering to stack multiple strips vertically, bottom-anchored, 1px gap between strips
- [ ] Cap visible strips at 3; for 4+ show 2 strips + "+N" overflow indicator in muted text
- [ ] Verify Thursday renders exactly 2 strips: strength (pink) on top, swim (cyan) below
- [ ] Ensure cell height is consistent across all days regardless of strip count

## Files likely touched
- `components/MonthView.tsx`

## Acceptance criteria
- Thursday cells show 2 stacked strips: strength `#E535AB` and swim `#00D4FF`
- All other single-discipline days are unaffected
- Cell height does not vary between single-strip and multi-strip days
- No overflow or clipping of day numbers
