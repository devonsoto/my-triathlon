import "server-only"
import { db } from "@/db"
import { whoopTokens } from "@/db/schema"
import type { WhoopResult } from "./types"

const BASE = "https://api.prod.whoop.com/developer/v2"

async function getValidToken(): Promise<string | null> {
  const rows = await db.select().from(whoopTokens).limit(1)
  const row = rows[0]
  if (!row) return null

  // Refresh if expiring within 5 minutes
  if (row.expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
    return refreshToken(row.refreshToken, row.id)
  }

  return row.accessToken
}

async function refreshToken(refreshTok: string, rowId: string): Promise<string | null> {
  const body = new URLSearchParams({
    grant_type:    "refresh_token",
    refresh_token: refreshTok,
    client_id:     process.env.WHOOP_CLIENT_ID!,
    client_secret: process.env.WHOOP_CLIENT_SECRET!,
    scope:         "offline",
  })

  const res = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  })

  if (!res.ok) {
    console.error("[whoop] token refresh failed:", await res.text())
    return null
  }

  const tokens = await res.json()
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  const { eq } = await import("drizzle-orm")
  await db
    .update(whoopTokens)
    .set({
      accessToken:  tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      updatedAt:    new Date(),
    })
    .where(eq(whoopTokens.id, rowId))

  return tokens.access_token
}

export async function whoopFetch<T>(path: string): Promise<WhoopResult<T>> {
  const token = await getValidToken()
  if (!token) return { ok: false, error: "no_token" }

  const url = `${BASE}${path}`
  console.log("[whoop] fetching:", url)

  let res: Response
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    })
  } catch (err) {
    console.error("[whoop] fetch threw:", err)
    return { ok: false, error: "network_error" }
  }

  if (res.status === 401) return { ok: false, error: "unauthorized" }
  if (res.status === 429) return { ok: false, error: "rate_limited" }
  if (!res.ok) {
    console.error("[whoop] non-ok response:", res.status, await res.text())
    return { ok: false, error: "network_error" }
  }

  return { ok: true, data: (await res.json()) as T }
}
