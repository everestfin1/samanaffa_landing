import { db } from './db'
import { session as sessionTable, users } from './db/schema'
import { eq, and, gt } from 'drizzle-orm'

const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) return {}

  return cookieHeader.split(';').reduce<Record<string, string>>((acc, cookie) => {
    const [rawKey, ...rawValue] = cookie.trim().split('=')
    if (!rawKey) return acc
    acc[rawKey] = decodeURIComponent(rawValue.join('='))
    return acc
  }, {})
}

export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  firstName: string
  lastName: string
  kycStatus: string | null
}

export interface Session {
  user: SessionUser | null
}

/**
 * Get session from request headers (API routes/server calls)
 * Uses Better Auth session table with snake_case column names
 */
export async function getServerSession(
  request?: Request | { headers: Headers }
): Promise<Session | null> {
  try {
    const cookieHeader = request?.headers?.get('cookie') ?? null
    const cookieStore = parseCookies(cookieHeader)
    const sessionToken = cookieStore['better-auth.session_token']

    if (!sessionToken) {
      return null
    }

    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.token, sessionToken),
          gt(sessionTable.expiresAt, new Date())
        )
      )
      .limit(1)

    if (!session) {
      return null
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: user.phone || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        kycStatus: user.kycStatus,
      },
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
