import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-secret-change-in-production'

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
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { error: 'No token provided', user: null }
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string }
    
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId }
    })
    
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
  return jwt.sign({ adminId }, ADMIN_JWT_SECRET, { expiresIn: '24h' })
}

export function createAdminRefreshToken(adminId: string): string {
  return jwt.sign({ adminId, type: 'refresh' }, ADMIN_JWT_SECRET, { expiresIn: '7d' })
}

export async function verifyAdminRefreshToken(token: string): Promise<AuthResult> {
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string; type: string }
    
    if (decoded.type !== 'refresh') {
      return { error: 'Invalid token type', user: null }
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId }
    })
    
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
  
  return NextResponse.json({
    success: true,
    message,
    token,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  })
}

export function createErrorResponse(error: string, status: number = 401) {
  return NextResponse.json({ 
    success: false, 
    error 
  }, { status })
}
