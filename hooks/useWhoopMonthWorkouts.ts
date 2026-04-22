'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getMonthWhoopWorkouts } from '@/app/actions/whoop'
import type { WhoopWorkoutsResult } from '@/lib/whoop/types'

const VISIBILITY_DEBOUNCE_MS = 60_000

export function useWhoopMonthWorkouts(monthStartDate: string, tz: string) {
  const [result, setResult] = useState<WhoopWorkoutsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const lastFetchedAt = useRef(0)

  const fetchNow = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMonthWhoopWorkouts({ monthStartDate, tz })
      setResult(res)
    } catch {
      setResult({ status: 'error' })
    } finally {
      lastFetchedAt.current = Date.now()
      setLoading(false)
    }
  }, [monthStartDate, tz])

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

  return { result, loading }
}
