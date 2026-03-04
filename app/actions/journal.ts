"use server"

import { db } from "@/db"
import { journalEntries } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { JournalEntry } from "@/lib/types"

type NewEntry = Omit<JournalEntry, "id" | "createdAt" | "updatedAt">

function toJournalEntry(row: typeof journalEntries.$inferSelect): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    mood: row.mood,
    disciplines: row.disciplines ?? [],
    content: row.content,
    createdAt: (row.createdAt as Date).toISOString(),
    updatedAt: (row.updatedAt as Date).toISOString(),
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const rows = await db
    .select()
    .from(journalEntries)
    .orderBy(desc(journalEntries.date))
  return rows.map(toJournalEntry)
}

export async function createJournalEntry(entry: NewEntry): Promise<JournalEntry> {
  const now = new Date()
  const [row] = await db
    .insert(journalEntries)
    .values({
      date: entry.date,
      title: entry.title,
      mood: entry.mood,
      disciplines: entry.disciplines,
      content: entry.content,
      createdAt: now,
      updatedAt: now,
    })
    .returning()
  return toJournalEntry(row)
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await db.delete(journalEntries).where(eq(journalEntries.id, id))
}
