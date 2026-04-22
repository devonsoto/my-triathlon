import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import crypto from "crypto"

const SCOPES = ["read:recovery", "read:sleep", "read:workout", "read:profile", "offline"].join(" ")

export async function GET(_req: NextRequest) {
  const state = crypto.randomBytes(4).toString("hex") // 8 chars as required by WHOOP

  const params = new URLSearchParams({
    response_type: "code",
    client_id:     process.env.WHOOP_CLIENT_ID!,
    redirect_uri:  process.env.WHOOP_REDIRECT_URI!,
    scope:         SCOPES,
    state,
  })

  redirect(`https://api.prod.whoop.com/oauth/oauth2/auth?${params.toString()}`)
}
