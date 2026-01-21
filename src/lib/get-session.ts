import { db } from './db'
import { sessions, users } from './db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { cookies } from 'next/headers'

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
 * Get session from Next.js API routes (App Router)
 * Replacement for getServerSession from next-auth
 */
export async function getServerSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('better-auth.session_token')?.value

    if (!sessionToken) {
      return null
    }

    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.sessionToken, sessionToken),
          gt(sessions.expires, new Date())
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
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        kycStatus: user.kycStatus,
      },
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
