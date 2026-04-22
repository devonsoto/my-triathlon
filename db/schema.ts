import { pgTable, uuid, text, date, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const journalEntries = pgTable("journal_entries", {
  id:          uuid("id").primaryKey().defaultRandom(),
  date:        date("date").notNull(),
  title:       text("title").notNull(),
  mood:        text("mood").notNull(),
  disciplines: text("disciplines").array().notNull().default(sql`'{}'`),
  content:     text("content").notNull().default(""),
  createdAt:   timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt:   timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
})

// Single-row table — one athlete, one WHOOP connection
export const whoopTokens = pgTable("whoop_tokens", {
  id:           uuid("id").primaryKey().defaultRandom(),
  accessToken:  text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt:    timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
  scope:        text("scope").notNull().default(""),
  createdAt:    timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt:    timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
})
