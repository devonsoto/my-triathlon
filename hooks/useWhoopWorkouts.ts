'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getWeekWhoopWorkouts,
  refreshWhoopWorkouts,
} from '@/app/actions/whoop'
import type { WhoopWorkoutsResult } from '@/lib/whoop/types'

const VISIBILITY_DEBOUNCE_MS = 60_000

export function useWhoopWorkouts(weekStartDate: string, tz: string) {
  const [result, setResult] = useState<WhoopWorkoutsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const lastFetchedAt = useRef(0)

  const fetchNow = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getWeekWhoopWorkouts({ weekStartDate, tz })
      setResult(res)
    } catch {
      setResult({ status: 'error' })
    } finally {
      lastFetchedAt.current = Date.now()
      setLoading(false)
    }
  }, [weekStartDate, tz])

  const refresh = useCallback(async () => {
    try {
      await refreshWhoopWorkouts(weekStartDate, tz)
    } catch {
      // cache invalidation failures shouldn't block the refetch
    }
    await fetchNow()
  }, [weekStartDate, tz, fetchNow])

  useEffect(() => {
    fetchNow()
  }, [fetchNow])

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastFetchedAt.current < VISIBILITY_DEBOUNCE_MS) return
      fetchNow()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [fetchNow])

  return { result, loading, refresh }
}
