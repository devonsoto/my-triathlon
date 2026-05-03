'use client'

import { AlertTriangle } from 'lucide-react'
import { useWhoopWorkouts } from '@/hooks/useWhoopWorkouts'
import { DISCIPLINE_CONFIG, type DisciplineKey } from '@/lib/constants'
import { WEEKLY_SCHEDULE, type Session } from '@/lib/schedule'
import { localDateKeyInTz } from '@/lib/utils'
import { OTHER_SPORT_STYLE, SPORT_TO_DISCIPLINE } from '@/lib/whoop/sports'
import type { WhoopWorkoutSummary } from '@/lib/whoop/types'

function titleCase(raw: string): string {
  return raw
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

function workoutStyle(w: WhoopWorkoutSummary): {
  emoji: string
  color: string
  label: string
} {
  const discipline = SPORT_TO_DISCIPLINE[w.sportSlug]
  if (discipline) {
    const cfg = DISCIPLINE_CONFIG[discipline]
    return {
      emoji: cfg.emoji,
      color: cfg.color,
      label: discipline.toUpperCase(),
    }
  }
  return {
    emoji: OTHER_SPORT_STYLE.emoji,
    color: OTHER_SPORT_STYLE.color,
    label: titleCase(w.sportName).toUpperCase(),
  }
}

function formatDuration(startIso: string, endIso: string): string {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime()
  if (!Number.isFinite(ms) || ms <= 0) return '—'
  const totalMin = Math.round(ms / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatDistance(meters: number | null): string | null {
  if (meters == null || meters <= 0) return null
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`
  return `${Math.round(meters)} m`
}

function formatCalories(kj: number | null): string | null {
  if (kj == null || kj <= 0) return null
  return `${Math.round(kj / 4.184)} cal`
}

function formatClock(iso: string, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}


function getCurrentWeekDates(tz: string): Date[] {
  const todayKey = localDateKeyInTz(new Date(), tz)
  const [y, m, d] = todayKey.split('-').map(Number)
  const todayNoonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const daysFromMonday = (todayNoonUtc.getUTCDay() + 6) % 7
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(todayNoonUtc)
    day.setUTCDate(todayNoonUtc.getUTCDate() - daysFromMonday + i)
    return day
  })
}

function PlanPill({ session, slot }: { session: Session; slot: 'AM' | 'PM' }) {
  if (!session) {
    return (
      <div className='flex items-center gap-2 rounded border border-card-border px-3 py-2'>
        <span className='font-mono text-xs text-text-muted'>{slot}</span>
        <span className='font-sans text-xs text-text-muted'>—</span>
      </div>
    )
  }
  const cfg = DISCIPLINE_CONFIG[session.discipline]
  return (
    <div
      className='flex items-center gap-2 rounded border-l-2 bg-gray-50 px-3 py-2'
      style={{ borderColor: cfg.color }}
    >
      <span className='font-mono text-xs' style={{ color: cfg.color }}>
        {slot}
      </span>
      <span className='text-sm'>{cfg.emoji}</span>
      <span
        className='font-display text-sm font-semibold uppercase leading-none tracking-wide'
        style={{ color: cfg.color }}
      >
        {session.label}
      </span>
    </div>
  )
}

function WorkoutRow({
  workout,
  tz,
  matchedPlan,
}: {
  workout: WhoopWorkoutSummary
  tz: string
  matchedPlan: boolean
}) {
  const style = workoutStyle(workout)
  const scored = workout.scoreState === 'SCORED'
  const duration = formatDuration(workout.start, workout.end)
  const distance = formatDistance(workout.distanceMeter)
  const calories = formatCalories(workout.kilojoule)
  const start = formatClock(workout.start, tz)

  return (
    <div
      className='flex flex-wrap items-center gap-x-4 gap-y-2 rounded border-l-2 bg-gray-50 px-3 py-2.5'
      style={{ borderColor: style.color }}
    >
      <div className='flex items-center gap-2'>
        <span className='text-base'>{style.emoji}</span>
        <span
          className='font-display text-sm font-semibold uppercase leading-none tracking-wide'
          style={{ color: style.color }}
        >
          {style.label}
        </span>
        {matchedPlan && (
          <span
            className='text-sm font-bold leading-none'
            style={{ color: style.color }}
            aria-label='Matches plan'
            title='Matches planned session'
          >
            ✓
          </span>
        )}
      </div>
      <span className='font-mono text-xs text-text-secondary'>{start}</span>
      <Stat label='Dur' value={duration} />
      {scored && workout.strain != null && (
        <Stat label='Strain' value={workout.strain.toFixed(1)} />
      )}
      {scored && workout.avgHeartRate != null && (
        <Stat label='Avg HR' value={`${workout.avgHeartRate}`} unit='bpm' />
      )}
      {scored && workout.maxHeartRate != null && (
        <Stat label='Max' value={`${workout.maxHeartRate}`} unit='bpm' />
      )}
      {distance && <Stat label='Dist' value={distance} />}
      {calories && <Stat label='Cal' value={calories} />}
      {!scored && (
        <span className='inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary'>
          <span className='inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted' />
          pending
        </span>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit?: string
}) {
  return (
    <div className='flex items-baseline gap-1.5 leading-none'>
      <span className='font-mono text-[10px] uppercase tracking-wider text-text-secondary'>
        {label}
      </span>
      <span className='font-display text-sm font-semibold text-text-primary'>
        {value}
      </span>
      {unit && (
        <span className='font-sans text-[10px] text-text-secondary'>{unit}</span>
      )}
    </div>
  )
}

export default function WeekStrip() {
  const tz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC'
  const weekDates = getCurrentWeekDates(tz)
  const weekStartDate = localDateKeyInTz(weekDates[0], tz)

  const { result } = useWhoopWorkouts(weekStartDate, tz)

  const todayKey = localDateKeyInTz(new Date(), tz)

  const workoutsByDay: Record<string, WhoopWorkoutSummary[]> = {}
  if (result && result.status === 'ok') {
    for (const w of result.data) {
      ;(workoutsByDay[w.localDateKey] ??= []).push(w)
    }
  }

  const notConfigured = result?.status === 'not_configured'
  const errored = result?.status === 'error'
  const truncated = result?.status === 'ok' && result.truncated

  return (
    <section className='mb-16'>
      <p className='mb-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-text-secondary'>
        This Week
      </p>

      {notConfigured && (
        <p className='mb-4 text-center font-sans text-[10px] uppercase tracking-widest text-text-muted'>
          Connect WHOOP to see logged workouts
        </p>
      )}
      {!notConfigured && <div className='mb-4' />}

      <div className='flex flex-col gap-3'>
        {WEEKLY_SCHEDULE.map(({ day, am, pm }, i) => {
          const date = weekDates[i]
          const dayKey = localDateKeyInTz(date, tz)
          const isToday = dayKey === todayKey
          const isPast = dayKey < todayKey

          const monthLabel = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            month: 'short',
          }).format(date)
          const dateNum = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            day: 'numeric',
          }).format(date)

          const dayWorkouts = workoutsByDay[dayKey] ?? []
          const plannedDisciplines = new Set<DisciplineKey>()
          if (am) plannedDisciplines.add(am.discipline)
          if (pm) plannedDisciplines.add(pm.discipline)

          return (
            <div
              key={day}
              className={[
                'flex flex-col gap-4 rounded-lg border p-5 transition-opacity sm:flex-row sm:items-start sm:gap-6',
                isToday
                  ? 'border-swim bg-[#EEF2FF]'
                  : isPast
                    ? 'border-card-border bg-card-bg opacity-50'
                    : 'border-card-border bg-card-bg',
              ].join(' ')}
              style={
                isToday
                  ? {
                      boxShadow:
                        '0 0 0 1px rgba(59,130,246,0.25), 0 0 16px rgba(59,130,246,0.08)',
                    }
                  : {}
              }
            >
              {/* Day header */}
              <div className='flex items-baseline gap-3 sm:w-28 sm:shrink-0 sm:flex-col sm:items-start sm:gap-1'>
                <span
                  className={[
                    'font-display text-xl font-bold uppercase tracking-widest',
                    isToday ? 'text-text-primary' : 'text-text-secondary',
                  ].join(' ')}
                >
                  {day}
                </span>
                <span className='font-sans text-xs uppercase tracking-wider text-text-muted'>
                  {monthLabel} {dateNum}
                </span>
              </div>

              {/* Plan pills */}
              <div className='flex flex-wrap items-center gap-2 sm:w-72 sm:shrink-0'>
                <PlanPill session={am} slot='AM' />
                <PlanPill session={pm} slot='PM' />
              </div>

              {/* Workouts column */}
              <div className='flex flex-1 flex-col gap-2'>
                {dayWorkouts.length > 0 ? (
                  dayWorkouts.map((w) => {
                    const d = SPORT_TO_DISCIPLINE[w.sportSlug]
                    const matched = !!d && plannedDisciplines.has(d)
                    return (
                      <WorkoutRow
                        key={w.id}
                        workout={w}
                        tz={tz}
                        matchedPlan={matched}
                      />
                    )
                  })
                ) : errored ? (
                  <div className='flex items-center gap-2 text-text-secondary'>
                    <AlertTriangle size={14} />
                    <span className='font-sans text-xs uppercase tracking-wider'>
                      WHOOP error
                    </span>
                  </div>
                ) : notConfigured ? null : isPast || isToday ? (
                  <span className='font-sans text-xs uppercase tracking-wider text-text-muted'>
                    — no workouts logged
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {truncated && (
        <p className='mt-2 text-center font-sans text-[10px] uppercase tracking-widest text-text-muted'>
          +more
        </p>
      )}
    </section>
  )
}
