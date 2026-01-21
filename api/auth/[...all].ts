import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyCredentials } from '../../src/lib/better-auth'
import { db } from '../../src/lib/db'
import { sessions, users } from '../../src/lib/db/schema'
import { eq, and, gt } from 'drizzle-orm'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req
  const path = url?.split('/api/auth')[1]?.split('?')[0] || ''

  try {
    // Custom credentials sign-in endpoint (preserves existing flow)
    if (path === '/sign-in/credentials' && method === 'POST') {
      const { email, phone, password, otp, type } = req.body

      const user = await verifyCredentials({ email, phone, password, otp, type })

      // Create session
      const sessionToken = crypto.randomUUID()
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

      await db.insert(sessions).values({
        id: crypto.randomUUID(),
        sessionToken,
        userId: user.id,
        expires,
      })

      // Set session cookie
      res.setHeader('Set-Cookie', `better-auth.session_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`)

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          kycStatus: user.kycStatus,
        },
      })
    }

    // Sign out endpoint
    if (path === '/sign-out' && method === 'POST') {
      const sessionToken = req.cookies?.['better-auth.session_token']

      if (sessionToken) {
        await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
      }

      res.setHeader('Set-Cookie', 'better-auth.session_token=; Path=/; HttpOnly; Max-Age=0')
      return res.status(200).json({ success: true })
    }

    // Get session endpoint
    if (path === '/session' && method === 'GET') {
      const sessionToken = req.cookies?.['better-auth.session_token']

      if (!sessionToken) {
        return res.status(200).json({ session: null, user: null })
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
        return res.status(200).json({ session: null, user: null })
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .limit(1)

      if (!user) {
        return res.status(200).json({ session: null, user: null })
      }

      return res.status(200).json({
        session: {
          id: session.id,
          userId: session.userId,
          expires: session.expires,
        },
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          kycStatus: user.kycStatus,
        },
      })
    }

    // Send OTP endpoint (preserves existing flow)
    if (path === '/send-otp' && method === 'POST') {
      const { email, phone, type, preferredMethod } = req.body

      // Use the sendOTP function from otp.ts which handles all the logic
      const { sendOTP } = await import('../../src/lib/otp')
      const result = await sendOTP(email, phone, type || 'login', preferredMethod)

      if (!result.success) {
        return res.status(400).json({ error: result.message })
      }

      return res.status(200).json({
        success: true,
        message: result.message,
      })
    }

    // Default: method not allowed
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    console.error('Auth error:', error)
    return res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed',
    })
  }
}
