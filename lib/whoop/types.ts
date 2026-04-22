// ── WHOOP API Response Types ──────────────────────────────────────────────────

export interface WhoopPaginatedResponse<T> {
  records: T[]
  next_token?: string
}

export interface WhoopRecovery {
  cycle_id: number
  sleep_id: number
  user_id: number
  created_at: string
  updated_at: string
  score_state: "SCORED" | "PENDING_SLOW" | "PENDING_FAST" | "UNSCORABLE"
  score: {
    user_calibrating: boolean
    recovery_score: number
    resting_heart_rate: number
    hrv_rmssd_milli: number
    spo2_percentage?: number
    skin_temp_celsius?: number
  } | null
}

export interface WhoopSleep {
  id: number
  user_id: number
  created_at: string
  updated_at: string
  start: string
  end: string
  timezone_offset: string
  nap: boolean
  score_state: "SCORED" | "PENDING_SLOW" | "PENDING_FAST" | "UNSCORABLE"
  score: {
    stage_summary: {
      total_in_bed_time_milli: number
      total_awake_time_milli: number
      total_light_sleep_time_milli: number
      total_slow_wave_sleep_time_milli: number
      total_rem_sleep_time_milli: number
      sleep_cycle_count: number
      disturbance_count: number
    }
    sleep_needed: {
      baseline_milli: number
      need_from_sleep_debt_milli: number
      need_from_recent_strain_milli: number
      need_from_recent_nap_milli: number
    }
    respiratory_rate?: number
    sleep_performance_percentage?: number
    sleep_consistency_percentage?: number
    sleep_efficiency_percentage?: number
  } | null
}

export interface WhoopWorkout {
  id: string
  user_id: number
  created_at: string
  updated_at: string
  start: string
  end: string
  timezone_offset: string
  sport_name: string
  score_state: "SCORED" | "PENDING_SLOW" | "PENDING_FAST" | "UNSCORABLE"
  score: {
    strain: number
    average_heart_rate: number
    max_heart_rate: number
    kilojoule: number
    distance_meter?: number
  } | null
}

// ── App Domain Types ──────────────────────────────────────────────────────────

export interface WhoopWorkoutSummary {
  id: string
  start: string
  end: string
  timezoneOffset: string
  localDateKey: string
  sportName: string
  sportSlug: string
  scoreState: WhoopWorkout["score_state"]
  strain: number | null
  distanceMeter: number | null
  avgHeartRate: number | null
  maxHeartRate: number | null
  kilojoule: number | null
}

export type WhoopWorkoutsResult =
  | { status: "ok"; data: WhoopWorkoutSummary[]; truncated: boolean }
  | { status: "not_configured" }
  | { status: "error" }

export interface WhoopDailySummary {
  date: string
  recoveryScore: number | null
  hrvRmssd: number | null
  restingHr: number | null
  sleepPerformance: number | null
  sleepDurationMs: number | null
  sleepEfficiency: number | null
  updatedAt: string
}

export type WhoopResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "unauthorized" | "rate_limited" | "network_error" | "no_token" }
