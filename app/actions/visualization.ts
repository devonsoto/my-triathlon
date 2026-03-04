"use server"

import { db } from "@/db"
import { visualizationNotes } from "@/db/schema"

export async function getVisualizationNotes(): Promise<Record<string, string>> {
  const rows = await db.select().from(visualizationNotes)
  return Object.fromEntries(rows.map((r) => [r.sectionKey, r.noteText]))
}

export async function upsertVisualizationNote(
  key: string,
  value: string
): Promise<void> {
  await db
    .insert(visualizationNotes)
    .values({ sectionKey: key, noteText: value })
    .onConflictDoUpdate({
      target: visualizationNotes.sectionKey,
      set: { noteText: value },
    })
}
