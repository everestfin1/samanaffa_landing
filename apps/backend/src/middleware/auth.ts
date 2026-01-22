import type { Context, Next } from 'hono'
import jwt from 'jsonwebtoken'
import { db, eq } from '../lib/db.js'
import { adminUsers } from '../lib/schema.js'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

export interface AdminPayload {
  adminId: string
}

export type AdminUser = typeof adminUsers.$inferSelect

export type AdminVariables = {
  admin: AdminUser
  adminId: string
}

export async function requireAdmin(c: Context<{ Variables: AdminVariables }>, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Authorization required' }, 401)
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as AdminPayload

    const results = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.adminId)).limit(1)
    const admin = results[0]

    if (!admin || !admin.isActive) {
      return c.json({ success: false, error: 'Invalid or inactive admin' }, 401)
    }

    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      return c.json({ success: false, error: 'Account is locked' }, 423)
    }

    c.set('admin', admin)
    c.set('adminId', admin.id)
    
    await next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return c.json({ success: false, error: 'Token expired' }, 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ success: false, error: 'Invalid token' }, 401)
    }
    console.error('Auth middleware error:', error)
    return c.json({ success: false, error: 'Authentication failed' }, 401)
  }
}

export function getClientIP(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for')
  const realIP = c.req.header('x-real-ip')
  const cfConnectingIP = c.req.header('cf-connecting-ip')

  if (cfConnectingIP) return String(cfConnectingIP)
  if (realIP) return String(realIP)
  if (forwarded) return String(forwarded).split(',')[0].trim()

  return 'unknown'
}
