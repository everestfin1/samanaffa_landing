import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { prisma } from '../../_db'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const realIP = req.headers['x-real-ip']
  const cfConnectingIP = req.headers['cf-connecting-ip']
  
  if (cfConnectingIP) return String(cfConnectingIP)
  if (realIP) return String(realIP)
  if (forwarded) return String(forwarded).split(',')[0].trim()
  
  return 'unknown'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.status(200).json({ success: true, message: 'Logged out' })
    }

    // Try to decode token to log the logout action
    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string }
      
      // Log admin logout
      const ipAddress = getClientIP(req)
      const userAgent = req.headers['user-agent'] || null
      
      await prisma.adminAuditLog.create({
        data: {
          adminId: decoded.adminId,
          action: 'ADMIN_LOGOUT',
          resourceType: 'admin_session',
          details: { adminId: decoded.adminId },
          ipAddress,
          userAgent,
        }
      }).catch(err => console.error('Failed to log admin logout:', err))
    } catch {
      // Token invalid or expired, still return success
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' })

  } catch (error) {
    console.error('Admin logout error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
