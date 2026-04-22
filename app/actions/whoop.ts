"use server"

import { unstable_cache, updateTag } from "next/cache"
import { whoopFetch } from "@/lib/whoop/client"
import { buildDailySummary, buildWorkoutSummary } from "@/lib/whoop/service"
import type {
  WhoopRecovery,
  WhoopSleep,
  WhoopPaginatedResponse,
  WhoopDailySummary,
  WhoopWorkout,
  WhoopWorkoutsResult,
} from "@/lib/whoop/types"

export async function getTodayWhoopData(): Promise<WhoopDailySummary | null> {
  const [recoveryResult, sleepResult] = await Promise.all([
    whoopFetch<WhoopPaginatedResponse<WhoopRecovery>>("/recovery?limit=1"),
    whoopFetch<WhoopPaginatedResponse<WhoopSleep>>("/activity/sleep?limit=1"),
  ])

  // If token is missing, signal "not configured" rather than an error
  if (!recoveryResult.ok && recoveryResult.error === "no_token") return null

  const recovery = recoveryResult.ok ? (recoveryResult.data.records[0] ?? null) : null
  const sleep    = sleepResult.ok    ? (sleepResult.data.records[0] ?? null)    : null

  // Both failed for non-token reasons
  if (!recovery && !sleep) return null

  return buildDailySummary(recovery, sleep)
}

// Converts a local wall-clock moment ("YYYY-MM-DDTHH:mm:ss" in `tz`) to a UTC
// instant by round-tripping through `Intl.DateTimeFormat` to discover the
// zone's offset at that moment. Handles DST transitions correctly.
function localWallTimeToUtc(localIso: string, tz: string): Date {
  const parts = localIso.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/,
  )
  if (!parts) throw new Error(`invalid local iso: ${localIso}`)
  const [, y, mo, d, h, mi, s] = parts
  const asUtc = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const read = (t: number) => {
    const p = fmt.formatToParts(new Date(t))
    const g = (k: string) => +(p.find(x => x.type === k)?.value ?? "0")
    return Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"))
  }
  // Two-pass correction: first pass estimates the offset, second pass refines
  // across a DST boundary if the first pass landed on the wrong side.
  const offset1 = read(asUtc) - asUtc
  const candidate1 = asUtc - offset1
  const offset2 = read(candidate1) - asUtc
  return new Date(asUtc - offset2)
}

async function fetchWeekWorkouts(
  weekStartDate: string,
  tz: string,
): Promise<WhoopWorkoutsResult> {
  const weekStart = localWallTimeToUtc(`${weekStartDate}T00:00:00`, tz)
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
  const startParam = encodeURIComponent(weekStart.toISOString())
  const endParam = encodeURIComponent(weekEnd.toISOString())

  const MAX_PAGES = 5
  const records: WhoopWorkout[] = []
  let nextToken: string | undefined
  let truncated = false

  for (let page = 0; page < MAX_PAGES; page++) {
    const tokenParam = nextToken ? `&nextToken=${encodeURIComponent(nextToken)}` : ""
    const path = `/activity/workout?start=${startParam}&end=${endParam}&limit=25${tokenParam}`
    const result = await whoopFetch<WhoopPaginatedResponse<WhoopWorkout>>(path)

    if (!result.ok) {
      if (result.error === "no_token") return { status: "not_configured" }
      console.error(
        "[whoop] getWeekWhoopWorkouts failed:",
        result.error,
        "page",
        page,
        "records_so_far",
        records.length,
      )
      return { status: "error" }
    }

    records.push(...result.data.records)
    nextToken = result.data.next_token
    if (!nextToken) break
  }

  // Probe one page past the cap: if there's still data, we truncated.
  if (nextToken) {
    const probe = await whoopFetch<WhoopPaginatedResponse<WhoopWorkout>>(
      `/activity/workout?start=${startParam}&end=${endParam}&limit=25&nextToken=${encodeURIComponent(nextToken)}`,
    )
    if (probe.ok && probe.data.records.length > 0) {
      truncated = true
    }
  }

  const data = records.map(w => buildWorkoutSummary(w, tz))
  return { status: "ok", data, truncated }
}

export async function getWeekWhoopWorkouts(args: {
  weekStartDate: string
  tz: string
}): Promise<WhoopWorkoutsResult> {
  const { weekStartDate, tz } = args
  const cached = unstable_cache(
    () => fetchWeekWorkouts(weekStartDate, tz),
    ["whoop-workouts", weekStartDate, tz],
    { tags: [`whoop-workouts:${weekStartDate}:${tz}`], revalidate: 300 },
  )
  return cached()
}

export async function refreshWhoopWorkouts(weekStartDate: string, tz: string): Promise<void> {
  updateTag(`whoop-workouts:${weekStartDate}:${tz}`)
}

async function fetchMonthWorkouts(
  monthStartDate: string,
  tz: string,
): Promise<WhoopWorkoutsResult> {
  const [y, m] = monthStartDate.split('-').map(Number)
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const pad = (n: number) => String(n).padStart(2, '0')
  const lastDayStr = `${y}-${pad(m)}-${pad(lastDay)}`

  const monthStart = localWallTimeToUtc(`${monthStartDate}T00:00:00`, tz)
  const monthEnd   = localWallTimeToUtc(`${lastDayStr}T23:59:59`, tz)

  const startParam = encodeURIComponent(monthStart.toISOString())
  const endParam   = encodeURIComponent(monthEnd.toISOString())

  const MAX_PAGES = 10
  const records: WhoopWorkout[] = []
  let nextToken: string | undefined

  for (let page = 0; page < MAX_PAGES; page++) {
    const tokenParam = nextToken ? `&nextToken=${encodeURIComponent(nextToken)}` : ''
    const path = `/activity/workout?start=${startParam}&end=${endParam}&limit=25${tokenParam}`
    const result = await whoopFetch<WhoopPaginatedResponse<WhoopWorkout>>(path)

    if (!result.ok) {
      if (result.error === 'no_token') return { status: 'not_configured' }
      return { status: 'error' }
    }

    records.push(...result.data.records)
    nextToken = result.data.next_token
    if (!nextToken) break
  }

  const truncated = !!nextToken
  const data = records.map(w => buildWorkoutSummary(w, tz))
  return { status: 'ok', data, truncated }
}

export async function getMonthWhoopWorkouts(args: {
  monthStartDate: string
  tz: string
}): Promise<WhoopWorkoutsResult> {
  const { monthStartDate, tz } = args
  const cached = unstable_cache(
    () => fetchMonthWorkouts(monthStartDate, tz),
    ['whoop-workouts-month', monthStartDate, tz],
    { tags: [`whoop-workouts-month:${monthStartDate}:${tz}`], revalidate: 300 },
  )
  return cached()
}

