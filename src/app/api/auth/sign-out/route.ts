import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Clear better-auth session cookie
  response.headers.append(
    'Set-Cookie',
    'better-auth.session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
  )

  return response
}
