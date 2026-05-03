'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import MonthView from '@/components/MonthView'
import WeekStrip from '@/components/WeekStrip'
import RecoveryCard from '@/components/whoop/RecoveryCard'
import { useWhoop } from '@/hooks/useWhoop'

// ─── Athlete config — swap these values for dynamic data later ───────────────
const ATHLETE = {
  name: 'Devon Soto',
  raceDate: new Date('2026-05-17T07:00:00'),
  raceLabel: 'Sprint Triathlon · May 17, 2026 · Fort Worth, TX',
}

// ─────────────────────────────────────────────────────────────────────────────

function getDaysLeft(target: Date): number {
  const diff = target.getTime() - Date.now()
  return diff <= 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function AthletePage() {
  const [days, setDays] = useState(() => getDaysLeft(ATHLETE.raceDate))
  const whoop = useWhoop()

  useEffect(() => {
    const id = setInterval(() => {
      setDays(getDaysLeft(ATHLETE.raceDate))
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <main className='min-h-screen bg-page-bg text-text-primary px-6 py-16 md:px-16 lg:px-24'>
      {/* ── Hero ── */}
      <section className='mb-16 text-center'>
        <h1 className='font-display text-6xl font-bold uppercase tracking-widest text-text-primary md:text-8xl lg:text-9xl'>
          {ATHLETE.name}
        </h1>
        <p className='mt-3 font-sans text-sm uppercase tracking-[0.3em] text-text-secondary md:text-base'>
          {ATHLETE.raceLabel}
        </p>
      </section>

      {/* ── Countdown ── */}
      <section className='mb-20 flex justify-center'>
        <Card className='items-center border-[0.5px] border-card-border bg-card-bg rounded-[12px] px-10 py-8 text-center'>
          <CardContent className='p-0'>
            <span className='font-display text-8xl font-bold leading-none text-text-primary md:text-9xl'>
              {days}
            </span>
          </CardContent>
          <CardDescription className='mt-2 font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary'>
            Days to Race Day
          </CardDescription>
        </Card>
      </section>

      {/* ── WHOOP Insights ── */}
      {(whoop.loading || whoop.data) && (
        <section className='mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <RecoveryCard
            data={whoop.data}
            loading={whoop.loading}
            error={whoop.error}
            onRefresh={whoop.refresh}
          />
          {/* Commenting this out for now */}
          {/* <SleepCard
            data={whoop.data}
            loading={whoop.loading}
            error={whoop.error}
          /> */}
        </section>
      )}

      {/* ── Week strip ── */}
      <WeekStrip />

      {/* ── Month view ── */}
      <MonthView />

    </main>
  )
}
