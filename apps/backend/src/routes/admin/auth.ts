import { Hono } from 'hono'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, eq } from '../../lib/db.js'
import { adminUsers, adminAuditLogs } from '../../lib/schema.js'
import { requireAdmin, getClientIP, type AdminVariables } from '../../middleware/auth.js'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

type Env = { Variables: AdminVariables }

function createAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, ADMIN_JWT_SECRET, { expiresIn: '24h' })
}

function createAdminRefreshToken(adminId: string): string {
  return jwt.sign({ adminId, type: 'refresh' }, ADMIN_JWT_SECRET, { expiresIn: '7d' })
}

const app = new Hono<Env>()

// POST /admin/auth/login
app.post('/login', async (c) => {
  console.log('[AUTH] Login request received')
  try {
    const { email, password } = await c.req.json()
    console.log('[AUTH] Parsed request body, email:', email)

    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, 400)
    }

    console.log('[AUTH] Querying database for admin user...')
    const results = await db.select().from(adminUsers).where(eq(adminUsers.email, email.toLowerCase())).limit(1)
    console.log('[AUTH] Database query completed, found:', results.length, 'results')
    const admin = results[0]

    if (!admin) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401)
    }

    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const lockTimeRemaining = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000)
      return c.json({ success: false, error: `Account is locked. Try again in ${lockTimeRemaining} minutes.` }, 423)
    }

    if (!admin.isActive) {
      return c.json({ success: false, error: 'Account is disabled' }, 403)
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)

    if (!isValidPassword) {
      const failedAttempts = admin.failedAttempts + 1
      const maxAttempts = 5
      let lockedUntil: Date | null = null
      
      if (failedAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + 60 * 60 * 1000)
      }

      await db.update(adminUsers)
        .set({ failedAttempts, lockedUntil, updatedAt: new Date() })
        .where(eq(adminUsers.id, admin.id))

      return c.json({ success: false, error: 'Invalid credentials' }, 401)
    }

    await db.update(adminUsers)
      .set({ failedAttempts: 0, lockedUntil: null, lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(adminUsers.id, admin.id))

    const ipAddress = getClientIP(c)
    const userAgent = c.req.header('user-agent') || null

    await db.insert(adminAuditLogs).values({
      id: crypto.randomUUID(),
      adminId: admin.id,
      action: 'ADMIN_LOGIN',
      resourceType: 'admin_session',
      details: { adminId: admin.id },
      ipAddress,
      userAgent,
    }).catch(err => console.error('Failed to log admin login:', err))

    const token = createAdminToken(admin.id)
    const refreshToken = createAdminRefreshToken(admin.id)

    return c.json({
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
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// POST /admin/auth/refresh
app.post('/refresh', async (c) => {
  try {
    const { refreshToken } = await c.req.json()

    if (!refreshToken) {
      return c.json({ success: false, error: 'Refresh token required' }, 400)
    }

    const decoded = jwt.verify(refreshToken, ADMIN_JWT_SECRET) as { adminId: string; type?: string }

    if (decoded.type !== 'refresh') {
      return c.json({ success: false, error: 'Invalid token type' }, 400)
    }

    const results = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.adminId)).limit(1)
    const admin = results[0]

    if (!admin || !admin.isActive) {
      return c.json({ success: false, error: 'Invalid or inactive admin' }, 401)
    }

    const newToken = createAdminToken(admin.id)

    return c.json({ success: true, token: newToken })
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return c.json({ success: false, error: 'Refresh token expired' }, 401)
    }
    console.error('Token refresh error:', error)
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// POST /admin/auth/logout
app.post('/logout', requireAdmin, async (c) => {
  const adminId = c.get('adminId')
  const ipAddress = getClientIP(c)
  const userAgent = c.req.header('user-agent') || null

  await db.insert(adminAuditLogs).values({
    id: crypto.randomUUID(),
    adminId,
    action: 'ADMIN_LOGOUT',
    resourceType: 'admin_session',
    ipAddress,
    userAgent,
  }).catch(err => console.error('Failed to log admin logout:', err))

  return c.json({ success: true, message: 'Logged out successfully' })
})

// GET /admin/auth/me
app.get('/me', requireAdmin, async (c) => {
  const admin = c.get('admin')
  return c.json({
    success: true,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  })
})

export default app
