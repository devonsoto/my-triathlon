"use server"

import { db } from "@/db"
import { motivationalItems } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { MotivationalItem } from "@/lib/types"

function toMotivationalItem(
  row: typeof motivationalItems.$inferSelect
): MotivationalItem {
  return {
    id: row.id,
    quote: row.quote,
    source: row.source ?? undefined,
    createdAt: (row.createdAt as Date).toISOString(),
  }
}

export async function getMotivationalItems(): Promise<MotivationalItem[]> {
  const rows = await db
    .select()
    .from(motivationalItems)
    .orderBy(desc(motivationalItems.createdAt))
  return rows.map(toMotivationalItem)
}

export async function createMotivationalItem(
  quote: string,
  source?: string
): Promise<MotivationalItem> {
  const [row] = await db
    .insert(motivationalItems)
    .values({ quote, source: source ?? null })
    .returning()
  return toMotivationalItem(row)
}

export async function deleteMotivationalItem(id: string): Promise<void> {
  await db.delete(motivationalItems).where(eq(motivationalItems.id, id))
}
