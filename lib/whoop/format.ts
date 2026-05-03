export function formatSleepDuration(ms: number): { hours: number; minutes: number } {
  const totalMinutes = Math.floor(ms / 60_000)
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}

export function recoveryColor(score: number | null): string {
  if (score === null) return "var(--color-text-muted)"
  if (score >= 67) return "var(--color-recovery)"
  if (score >= 34) return "#FFD700"
  return "#E8002D"
}
