import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { adminUsers } from '@/lib/db/schema'

const ADMIN_TOKEN_COOKIE = 'admin_token'

function isProductionEnv(): boolean {
  return (
    process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production'
  )
}

/** AUTH-014: fail fast in production when admin JWT secret is missing. */
export function getAdminJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET
  if (secret) return secret
  if (isProductionEnv()) {
    throw new Error('ADMIN_JWT_SECRET must be set in production')
  }
  return 'dev-admin-secret-not-for-production'
}

export function verifyAdminToken(token: string): { adminId: string } | null {
  try {
    const decoded = jwt.verify(token, getAdminJwtSecret()) as {
      adminId?: string
      type?: string
    }
    if (!decoded.adminId || decoded.type === 'refresh') {
      return null
    }
    return { adminId: decoded.adminId }
  } catch {
    return null
  }
}

export function getAdminTokenFromRequest(request: NextRequest): string | null {
  return (
    request.cookies.get(ADMIN_TOKEN_COOKIE)?.value ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null
  )
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

export interface AuthResult {
  error: string | null
  user: AdminUser | null
}

export async function verifyAdminAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const token = getAdminTokenFromRequest(request)

    if (!token) {
      return { error: 'No token provided', user: null }
    }

    const decoded = verifyAdminToken(token)
    if (!decoded) {
      return { error: 'Invalid or expired token', user: null }
    }
    
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, decoded.adminId))
      .limit(1)
    
    if (!admin) {
      return { error: 'Admin not found', user: null }
    }

    if (!admin.isActive) {
      return { error: 'Admin account is disabled', user: null }
    }

    return { 
      error: null, 
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
      }
    }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return { error: 'Invalid or expired token', user: null }
  }
}

export function createAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, getAdminJwtSecret(), { expiresIn: '24h' })
}

export function createAdminRefreshToken(adminId: string): string {
  return jwt.sign({ adminId, type: 'refresh' }, getAdminJwtSecret(), { expiresIn: '7d' })
}

export async function verifyAdminRefreshToken(token: string): Promise<AuthResult> {
  try {
    const decoded = jwt.verify(token, getAdminJwtSecret()) as { adminId: string; type: string }
    
    if (decoded.type !== 'refresh') {
      return { error: 'Invalid token type', user: null }
    }

    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, decoded.adminId))
      .limit(1)
    
    if (!admin || !admin.isActive) {
      return { error: 'Admin not found or inactive', user: null }
    }

    return { 
      error: null, 
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive
      }
    }
  } catch (error) {
    return { error: 'Invalid refresh token', user: null }
  }
}

export function createAuthResponse(user: AdminUser, message: string = 'Authentication successful') {
  const token = createAdminToken(user.id)
  const refreshToken = createAdminRefreshToken(user.id)

  const response = NextResponse.json({
    success: true,
    message,
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })

  const secure = isProductionEnv()
  response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60,
  })

  return response
}

export function createErrorResponse(error: string, status: number = 401) {
  return NextResponse.json({ 
    success: false, 
    error 
  }, { status })
}
