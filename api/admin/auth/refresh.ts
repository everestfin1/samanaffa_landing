import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import { prisma } from '../../_db'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

function createAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, ADMIN_JWT_SECRET, { expiresIn: '24h' })
}

function createAdminRefreshToken(adminId: string): string {
  return jwt.sign({ adminId, type: 'refresh' }, ADMIN_JWT_SECRET, { expiresIn: '7d' })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token is required' })
    }

    // Verify refresh token
    let decoded: { adminId: string; type: string }
    try {
      decoded = jwt.verify(refreshToken, ADMIN_JWT_SECRET) as { adminId: string; type: string }
    } catch {
      return res.status(401).json({ success: false, error: 'Invalid or expired refresh token' })
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, error: 'Invalid token type' })
    }

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Admin not found' })
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: 'Admin account is disabled' })
    }

    // Create new tokens
    const newToken = createAdminToken(admin.id)
    const newRefreshToken = createAdminRefreshToken(admin.id)

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
      refreshToken: newRefreshToken,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Admin token refresh error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
