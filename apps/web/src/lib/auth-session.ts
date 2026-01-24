import { db } from './db'
import { session as sessionTable, users } from './db/schema'
import { eq, and, gt } from 'drizzle-orm'

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
  id: string
  userId: string
  expires: Date
}

export interface AuthSession {
  session: Session | null
  user: SessionUser | null
}

/**
 * Get session from request cookies (for Vercel Functions / API routes)
 * Uses Better Auth session table with snake_case column names
 */
export async function getSession(cookies: Record<string, string> | undefined): Promise<AuthSession> {
  const sessionToken = cookies?.['better-auth.session_token']

  if (!sessionToken) {
    return { session: null, user: null }
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
    return { session: null, user: null }
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1)

  if (!user) {
    return { session: null, user: null }
  }

  return {
    session: {
      id: session.id,
      userId: session.userId,
      expires: session.expiresAt,
    },
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
}

/**
 * Validate session and return user if valid (for API route protection)
 */
export async function requireAuth(cookies: Record<string, string> | undefined): Promise<SessionUser> {
  const { user } = await getSession(cookies)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
