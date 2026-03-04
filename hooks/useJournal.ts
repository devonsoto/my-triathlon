"use client"

import { useEffect, useState } from "react"
import {
  getJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
} from "@/app/actions/journal"
import type { JournalEntry } from "@/lib/types"

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJournalEntries().then((data) => {
      setEntries(data)
      setLoading(false)
    })
  }, [])

  async function addEntry(
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">
  ) {
    const newEntry = await createJournalEntry(entry)
    setEntries((prev) => [newEntry, ...prev])
  }

  async function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    await deleteJournalEntry(id)
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return { entries: sorted, addEntry, deleteEntry, loading }
}
