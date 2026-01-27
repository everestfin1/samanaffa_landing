import { createFileRoute } from '@tanstack/react-router'
import { getSession } from '@/lib/auth-session'

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

export const Route = createFileRoute('/api/auth/get-session')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const cookies = parseCookieHeader(request.headers.get('cookie'))
          const { user, session } = await getSession(cookies)

          if (!user || !session) {
            return Response.json({ user: null, session: null })
          }

          return Response.json({
            user,
            session: {
              id: session.id,
              userId: session.userId,
              expires: session.expires.toISOString(),
            },
          })
        } catch (error) {
          console.error('[api/auth/get-session] Error:', error)
          return Response.json({ user: null, session: null }, { status: 200 })
        }
      },
    },
  },
})
