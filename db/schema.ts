import { pgTable, uuid, text, smallint, date, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const journalEntries = pgTable("journal_entries", {
  id:          uuid("id").primaryKey().defaultRandom(),
  date:        date("date").notNull(),
  title:       text("title").notNull(),
  mood:        text("mood").notNull(),
  disciplines: text("disciplines").array().notNull().default(sql`'{}'`),
  content:     text("content").notNull().default(""),
  createdAt:   timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const confidenceEntries = pgTable("confidence_entries", {
  id:         uuid("id").primaryKey().defaultRandom(),
  discipline: text("discipline").notNull(),
  value:      smallint("value").notNull(),
  date:       date("date").notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const visualizationNotes = pgTable("visualization_notes", {
  sectionKey: text("section_key").primaryKey(),
  noteText:   text("note_text").notNull().default(""),
})

export const motivationalItems = pgTable("motivational_items", {
  id:        uuid("id").primaryKey().defaultRandom(),
  quote:     text("quote").notNull(),
  source:    text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
