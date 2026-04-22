"use client"

import { RefreshCw } from "lucide-react"
import { recoveryColor } from "@/lib/whoop/format"
import type { WhoopDailySummary } from "@/lib/whoop/types"

interface RecoveryCardProps {
  data: WhoopDailySummary | null
  loading: boolean
  error: boolean
  onRefresh: () => void
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export function RecoveryCard({ data, loading, error, onRefresh }: RecoveryCardProps) {
  if (!loading && (error || !data)) return null

  const color = recoveryColor(data?.recoveryScore ?? null)

  return (
    <div
      className="relative rounded-lg bg-[#111] p-8 border-l-4"
      style={{ borderLeftColor: color }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Recovery
        </span>
        <button
          onClick={onRefresh}
          className="rounded-full p-1.5 text-zinc-600 hover:text-zinc-300 transition-colors"
          aria-label="Refresh WHOOP data"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-16 w-32 rounded bg-zinc-800 animate-pulse" />
          <div className="h-4 w-24 rounded bg-zinc-800 animate-pulse" />
          <div className="mt-6 flex gap-8">
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-10 rounded bg-zinc-800 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-16 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-14 rounded bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Recovery score */}
          <div className="mb-6">
            <div className="flex items-end gap-1 leading-none">
              <span
                className="font-display text-7xl font-bold"
                style={{ color }}
              >
                {data!.recoveryScore ?? "—"}
              </span>
              {data!.recoveryScore !== null && (
                <span className="font-display text-3xl text-zinc-400 mb-2">%</span>
              )}
            </div>
          </div>

          {/* Secondary stats */}
          <div className="flex gap-8">
            {data!.hrvRmssd !== null && (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-white">
                    {Math.round(data!.hrvRmssd)}
                  </span>
                  <span className="font-sans text-xs text-zinc-500">ms</span>
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  HRV
                </span>
              </div>
            )}
            {data!.restingHr !== null && (
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-2xl font-bold text-white">
                    {data!.restingHr}
                  </span>
                  <span className="font-sans text-xs text-zinc-500">bpm</span>
                </div>
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Resting HR
                </span>
              </div>
            )}
          </div>

          {/* Timestamp */}
          <p className="mt-6 font-sans text-[10px] text-zinc-600">
            Updated {formatTimestamp(data!.updatedAt)}
          </p>
        </>
      )}
    </div>
  )
}

export default RecoveryCard
