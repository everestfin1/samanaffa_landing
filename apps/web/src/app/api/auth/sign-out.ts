import { createFileRoute } from '@tanstack/react-router'
import { getDb } from '@/lib/db'
import { session as sessionTable } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {}

  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const eqIndex = part.indexOf('=')
      if (eqIndex === -1) return acc
      const key = part.slice(0, eqIndex).trim()
      const value = part.slice(eqIndex + 1).trim()
      acc[key] = decodeURIComponent(value)
      return acc
    }, {})
}

export const Route = createFileRoute('/api/auth/sign-out')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const db = getDb()
          const cookies = parseCookieHeader(request.headers.get('cookie'))
          const sessionToken = cookies['better-auth.session_token']

          if (sessionToken) {
            await db.delete(sessionTable).where(eq(sessionTable.token, sessionToken))
          }
        } catch (error) {
          console.error('[api/auth/sign-out] Error:', error)
        }

        const response = Response.json({ success: true })
        response.headers.append(
          'Set-Cookie',
          'better-auth.session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        )
        return response
      },
    },
  },
})
