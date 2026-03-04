"use client"

import { useEffect, useState } from "react"
import {
  getVisualizationNotes,
  upsertVisualizationNote,
} from "@/app/actions/visualization"
import { VISUALIZATION_SECTIONS } from "@/lib/constants"

function defaultNotes(): Record<string, string> {
  return Object.fromEntries(VISUALIZATION_SECTIONS.map(({ key }) => [key, ""]))
}

export function useVisualization() {
  const [notes, setNotes] = useState<Record<string, string>>(defaultNotes())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVisualizationNotes().then((data) => {
      setNotes({ ...defaultNotes(), ...data })
      setLoading(false)
    })
  }, [])

  async function updateSection(key: string, value: string) {
    setNotes((prev) => ({ ...prev, [key]: value }))
    await upsertVisualizationNote(key, value)
  }

  return { notes, updateSection, loading }
}
