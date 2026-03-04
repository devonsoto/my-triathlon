"use client"

import { useEffect, useState } from "react"
import {
  getConfidenceEntries,
  logConfidenceRating,
} from "@/app/actions/confidence"
import type { ConfidenceEntry } from "@/lib/types"

export function useConfidence() {
  const [history, setHistory] = useState<ConfidenceEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConfidenceEntries().then((data) => {
      setHistory(data)
      setLoading(false)
    })
  }, [])

  async function logRating(
    discipline: ConfidenceEntry["discipline"],
    value: number
  ) {
    const entry = await logConfidenceRating(discipline, value)
    setHistory((prev) => [...prev, entry])
  }

  function sparklineFor(discipline: ConfidenceEntry["discipline"]): number[] {
    return history
      .filter((e) => e.discipline === discipline)
      .slice(-5)
      .map((e) => e.value)
  }

  function currentFor(
    discipline: ConfidenceEntry["discipline"]
  ): number | undefined {
    const filtered = history.filter((e) => e.discipline === discipline)
    return filtered.length > 0 ? filtered[filtered.length - 1].value : undefined
  }

  return { history, logRating, sparklineFor, currentFor, loading }
}
