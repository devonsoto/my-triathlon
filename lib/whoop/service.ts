import "server-only"
import type {
  WhoopRecovery,
  WhoopSleep,
  WhoopDailySummary,
  WhoopWorkout,
  WhoopWorkoutSummary,
} from "./types"

export function buildDailySummary(
  recovery: WhoopRecovery | null,
  sleep: WhoopSleep | null
): WhoopDailySummary {
  const date = recovery?.created_at?.slice(0, 10) ?? sleep?.created_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)

  return {
    date,
    recoveryScore: recovery?.score?.recovery_score ?? null,
    hrvRmssd: recovery?.score?.hrv_rmssd_milli ?? null,
    restingHr: recovery?.score?.resting_heart_rate ?? null,
    sleepPerformance: sleep?.score?.sleep_performance_percentage ?? null,
    sleepDurationMs:
      sleep?.score != null
        ? sleep.score.stage_summary.total_in_bed_time_milli - sleep.score.stage_summary.total_awake_time_milli
        : null,
    sleepEfficiency: sleep?.score?.sleep_efficiency_percentage ?? null,
    updatedAt: recovery?.updated_at ?? sleep?.updated_at ?? new Date().toISOString(),
  }
}

export function sportNameToSlug(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
}

function isoDateInTimeZone(isoInstant: string, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(isoInstant))
  const y = parts.find(p => p.type === "year")?.value ?? "0000"
  const m = parts.find(p => p.type === "month")?.value ?? "01"
  const d = parts.find(p => p.type === "day")?.value ?? "01"
  return `${y}-${m}-${d}`
}

/** Buckets workout into the caller's tz calendar day, by start time. */
export function buildWorkoutSummary(w: WhoopWorkout, tz: string): WhoopWorkoutSummary {
  const scored = w.score_state === "SCORED" && w.score != null ? w.score : null

  return {
    id: w.id,
    start: w.start,
    end: w.end,
    timezoneOffset: w.timezone_offset,
    localDateKey: isoDateInTimeZone(w.start, tz),
    sportName: w.sport_name,
    sportSlug: sportNameToSlug(w.sport_name),
    scoreState: w.score_state,
    strain: scored?.strain ?? null,
    distanceMeter: scored?.distance_meter ?? null,
    avgHeartRate: scored?.average_heart_rate ?? null,
    maxHeartRate: scored?.max_heart_rate ?? null,
    kilojoule: scored?.kilojoule ?? null,
  }
}

