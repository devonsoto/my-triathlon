'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTodayWhoopData } from '@/app/actions/whoop'
import type { WhoopDailySummary } from '@/lib/whoop/types'

export function useWhoop() {
  const [data, setData] = useState<WhoopDailySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await getTodayWhoopData()
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refresh: load }
}
