import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
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
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' })
    }

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    // Check if account is locked
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const lockTimeRemaining = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000)
      return res.status(423).json({ 
        success: false, 
        error: `Account is locked. Try again in ${lockTimeRemaining} minutes.` 
      })
    }

    // Check if account is active
    if (!admin.isActive) {
      return res.status(403).json({ success: false, error: 'Account is disabled' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = admin.failedAttempts + 1
      const maxAttempts = 5
      
      let lockedUntil: Date | null = null
      if (failedAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + 60 * 60 * 1000) // Lock for 1 hour
      }

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { failedAttempts, lockedUntil }
      })

      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }

    // Reset failed attempts and update last login
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date()
      }
    })

    // Log admin login
    const ipAddress = getClientIP(req)
    const userAgent = req.headers['user-agent'] || null
    
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        action: 'ADMIN_LOGIN',
        resourceType: 'admin_session',
        details: { adminId: admin.id },
        ipAddress,
        userAgent,
      }
    }).catch(err => console.error('Failed to log admin login:', err))

    // Create tokens
    const token = createAdminToken(admin.id)
    const refreshToken = createAdminRefreshToken(admin.id)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
