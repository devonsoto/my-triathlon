import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { whoopTokens } from "@/db/schema"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(new URL("/athlete?whoop=error", req.url))
  }

  // Exchange authorization code for tokens
  const body = new URLSearchParams({
    grant_type:    "authorization_code",
    code,
    redirect_uri:  process.env.WHOOP_REDIRECT_URI!,
    client_id:     process.env.WHOOP_CLIENT_ID!,
    client_secret: process.env.WHOOP_CLIENT_SECRET!,
  })

  const tokenRes = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    body.toString(),
  })

  if (!tokenRes.ok) {
    console.error("[whoop/callback] token exchange failed:", await tokenRes.text())
    return NextResponse.redirect(new URL("/athlete?whoop=error", req.url))
  }

  const tokens = await tokenRes.json()
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

  // Upsert — delete existing row then insert fresh (single-user, one row max)
  await db.delete(whoopTokens)
  await db.insert(whoopTokens).values({
    accessToken:  tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt,
    scope:        tokens.scope ?? "",
  })

  return NextResponse.redirect(new URL("/athlete?whoop=connected", req.url))
}
