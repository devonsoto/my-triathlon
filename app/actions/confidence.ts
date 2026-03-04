"use server"

import { db } from "@/db"
import { confidenceEntries } from "@/db/schema"
import { asc } from "drizzle-orm"
import type { ConfidenceEntry } from "@/lib/types"

function toConfidenceEntry(
  row: typeof confidenceEntries.$inferSelect
): ConfidenceEntry {
  return {
    discipline: row.discipline as ConfidenceEntry["discipline"],
    value: row.value,
    date: row.date,
  }
}

export async function getConfidenceEntries(): Promise<ConfidenceEntry[]> {
  const rows = await db
    .select()
    .from(confidenceEntries)
    .orderBy(asc(confidenceEntries.createdAt))
  return rows.map(toConfidenceEntry)
}

export async function logConfidenceRating(
  discipline: ConfidenceEntry["discipline"],
  value: number
): Promise<ConfidenceEntry> {
  const date = new Date().toISOString().slice(0, 10)
  const [row] = await db
    .insert(confidenceEntries)
    .values({ discipline, value, date })
    .returning()
  return toConfidenceEntry(row)
}
