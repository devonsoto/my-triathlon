'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWhoopMonthWorkouts } from '@/hooks/useWhoopMonthWorkouts'
import { DISCIPLINE_CONFIG, type DisciplineKey } from '@/lib/constants'
import { SPORT_TO_DISCIPLINE } from '@/lib/whoop/sports'
import type { WhoopWorkoutSummary } from '@/lib/whoop/types'
import { localDateKeyInTz } from '@/lib/utils'

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_STRIPS = 3
const EARLIEST = { year: 2026, month: 1 }
const pad = (n: number) => String(n).padStart(2, '0')

function getMonthGrid(tz: string, offset: number) {
  const todayKey = localDateKeyInTz(new Date(), tz)
  const [todayYear, todayMonth] = todayKey.split('-').map(Number)
  const maxOffset = (todayYear - EARLIEST.year) * 12 + (todayMonth - EARLIEST.month)

  let year = todayYear
  let month = todayMonth - offset
  while (month <= 0) { month += 12; year -= 1 }

  const firstDay = new Date(Date.UTC(year, month - 1, 1, 12))
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const firstDayOfWeek = (firstDay.getUTCDay() + 6) % 7

  const monthStartDate = `${year}-${pad(month)}-01`

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: tz,
  }).format(firstDay)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length < 42) cells.push(null)

  return { year, month, monthLabel, monthStartDate, cells, maxOffset }
}

function groupByDate(workouts: WhoopWorkoutSummary[]): Record<string, DisciplineKey[]> {
  const map: Record<string, Set<DisciplineKey>> = {}
  for (const w of workouts) {
    const discipline = SPORT_TO_DISCIPLINE[w.sportSlug]
    if (!discipline) continue
    if (!map[w.localDateKey]) map[w.localDateKey] = new Set()
    map[w.localDateKey].add(discipline)
  }
  return Object.fromEntries(
    Object.entries(map).map(([k, v]) => [k, [...v]])
  )
}

export default function MonthView() {
  const tz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC'

  const [monthOffset, setMonthOffset] = useState(0)

  const { year, month, monthLabel, monthStartDate, cells, maxOffset } = getMonthGrid(tz, monthOffset)
  const { result } = useWhoopMonthWorkouts(monthStartDate, tz)

  const workoutsByDate =
    result?.status === 'ok' ? groupByDate(result.data) : {}

  return (
    <section className='mb-16'>
      <p className='mb-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-text-secondary'>
        {monthOffset === 0 ? 'This Month' : 'Past Month'}
      </p>
      <div className='mb-4 flex items-center justify-center gap-4'>
        <button
          onClick={() => setMonthOffset(o => Math.min(o + 1, maxOffset))}
          disabled={monthOffset >= maxOffset}
          className='rounded p-1 text-text-muted transition-colors hover:text-text-primary disabled:opacity-30'
          aria-label='Previous month'
        >
          <ChevronLeft size={18} />
        </button>
        <p className='font-display text-xl font-bold uppercase tracking-widest text-text-primary'>
          {monthLabel}
        </p>
        <button
          onClick={() => setMonthOffset(o => Math.max(o - 1, 0))}
          disabled={monthOffset === 0}
          className='rounded p-1 text-text-muted transition-colors hover:text-text-primary disabled:opacity-30'
          aria-label='Next month'
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div className='mb-1 grid grid-cols-7 gap-1'>
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className='text-center font-mono text-[10px] uppercase tracking-widest text-text-muted'
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className='grid grid-cols-7 gap-1'>
        {cells.map((day, i) => {
          const dateKey = day !== null
            ? `${year}-${pad(month)}-${pad(day)}`
            : null
          const disciplines = dateKey ? (workoutsByDate[dateKey] ?? []) : []
          const visible = disciplines.length > MAX_STRIPS
            ? disciplines.slice(0, MAX_STRIPS - 1)
            : disciplines
          const overflow = disciplines.length > MAX_STRIPS
            ? disciplines.length - (MAX_STRIPS - 1)
            : 0

          return (
            <div
              key={i}
              className='relative h-14 rounded border border-card-border bg-card-bg'
            >
              {day !== null && (
                <span className='absolute left-2 top-1.5 font-mono text-[11px] text-text-secondary'>
                  {day}
                </span>
              )}
              {disciplines.length > 0 && (
                <div className='absolute bottom-1.5 left-1 right-1 flex flex-col gap-px'>
                  {visible.map((d) => (
                    <div
                      key={d}
                      className='h-1.5 w-full rounded-sm'
                      style={{ backgroundColor: DISCIPLINE_CONFIG[d].color }}
                    />
                  ))}
                  {overflow > 0 && (
                    <span className='text-center font-mono text-[9px] text-text-muted'>
                      +{overflow}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
