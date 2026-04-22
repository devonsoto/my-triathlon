"use client"

import { formatSleepDuration } from "@/lib/whoop/format"
import type { WhoopDailySummary } from "@/lib/whoop/types"

interface SleepCardProps {
  data: WhoopDailySummary | null
  loading: boolean
  error: boolean
}

export function SleepCard({ data, loading, error }: SleepCardProps) {
  if (!loading && (error || !data)) return null

  const duration = data?.sleepDurationMs != null
    ? formatSleepDuration(data.sleepDurationMs)
    : null

  return (
    <div className="rounded-lg bg-[#111] p-8 border border-white/5">
      {/* Header */}
      <div className="mb-6">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Sleep
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-16 w-40 rounded bg-zinc-800 animate-pulse" />
          <div className="mt-6 flex gap-8">
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-20 rounded bg-zinc-800 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Sleep duration */}
          <div className="mb-6 leading-none">
            {duration ? (
              <div className="flex items-end gap-1">
                <span className="font-display text-7xl font-bold text-white">
                  {duration.hours}
                </span>
                <span className="font-display text-3xl text-zinc-400 mb-2">h</span>
                <span className="font-display text-7xl font-bold text-white ml-1">
                  {String(duration.minutes).padStart(2, "0")}
                </span>
                <span className="font-display text-3xl text-zinc-400 mb-2">m</span>
              </div>
            ) : (
              <span className="font-display text-7xl font-bold text-zinc-700">—</span>
            )}
          </div>

          {/* Secondary stats */}
          <div className="flex gap-8">
            {data!.sleepPerformance !== null && (
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display text-2xl font-bold text-white">
                    {Math.round(data!.sleepPerformance)}
                  </span>
                  <span className="font-sans text-xs text-zinc-500">%</span>
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Performance
                </span>
              </div>
            )}
            {data!.sleepEfficiency !== null && (
              <div>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-display text-2xl font-bold text-white">
                    {Math.round(data!.sleepEfficiency)}
                  </span>
                  <span className="font-sans text-xs text-zinc-500">%</span>
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Efficiency
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SleepCard
