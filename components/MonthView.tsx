'use client'

import { useWhoopMonthWorkouts } from '@/hooks/useWhoopMonthWorkouts'
import { DISCIPLINE_CONFIG, type DisciplineKey } from '@/lib/constants'
import { SPORT_TO_DISCIPLINE } from '@/lib/whoop/sports'
import type { WhoopWorkoutSummary } from '@/lib/whoop/types'
import { localDateKeyInTz } from '@/lib/utils'

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MAX_STRIPS = 3

function getMonthGrid(tz: string) {
  const todayKey = localDateKeyInTz(new Date(), tz)
  const [year, month] = todayKey.split('-').map(Number)

  const firstDay = new Date(Date.UTC(year, month - 1, 1, 12))
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const firstDayOfWeek = (firstDay.getUTCDay() + 6) % 7

  const pad = (n: number) => String(n).padStart(2, '0')
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

  return { year, month, monthLabel, monthStartDate, cells }
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

  const { year, month, monthLabel, monthStartDate, cells } = getMonthGrid(tz)
  const { result } = useWhoopMonthWorkouts(monthStartDate, tz)

  const workoutsByDate =
    result?.status === 'ok' ? groupByDate(result.data) : {}

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className='mb-16'>
      <p className='mb-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500'>
        This Month
      </p>
      <p className='mb-4 text-center font-display text-xl font-bold uppercase tracking-widest text-white'>
        {monthLabel}
      </p>

      {/* Day-of-week header */}
      <div className='mb-1 grid grid-cols-7 gap-1'>
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className='text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600'
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
              className='relative h-14 rounded border border-white/5 bg-[#111]'
            >
              {day !== null && (
                <span className='absolute left-2 top-1.5 font-mono text-[11px] text-zinc-500'>
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
                    <span className='text-center font-mono text-[9px] text-zinc-600'>
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
