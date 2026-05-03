import type { DisciplineKey } from '@/lib/constants'

export type Session = { discipline: DisciplineKey; label: string } | null

export const WEEKLY_SCHEDULE: { day: string; am: Session; pm: Session }[] = [
  { day: 'Mon', am: { discipline: 'strength', label: 'Strength' }, pm: null },
  { day: 'Tue', am: { discipline: 'strength', label: 'Strength' }, pm: { discipline: 'swim', label: 'Swim' } },
  { day: 'Wed', am: { discipline: 'bike',     label: 'Cycle'    }, pm: null },
  {
    day: 'Thu',
    am: { discipline: 'strength', label: 'Strength' },
    pm: { discipline: 'swim',     label: 'Swim'     },
  },
  { day: 'Fri', am: { discipline: 'strength', label: 'Strength' }, pm: null },
  { day: 'Sat', am: { discipline: 'run',      label: 'Run'      }, pm: null },
  { day: 'Sun', am: { discipline: 'bike',     label: 'Long Bike'}, pm: null },
]
