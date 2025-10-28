import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createAuthResponse, createErrorResponse } from '@/lib/admin-auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit'
import { logAdminLogin } from '@/lib/audit-logger'

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimit = checkRateLimit(request, 'admin')
    
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: rateLimit.blocked 
          ? `Too many failed attempts. Try again in ${Math.ceil((rateLimit.resetTime - Date.now()) / 60000)} minutes.`
          : 'Too many login attempts. Please try again later.',
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: rateLimit.resetTime,
          blocked: rateLimit.blocked
        }
      }, { status: 429 })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400)
    }

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!admin) {
      return createErrorResponse('Invalid credentials', 401)
    }

    // Check if account is locked
    if (admin.lockedUntil && new Date() < admin.lockedUntil) {
      const lockTimeRemaining = Math.ceil((admin.lockedUntil.getTime() - Date.now()) / 60000)
      return createErrorResponse(`Account is locked. Try again in ${lockTimeRemaining} minutes.`, 423)
    }

    // Check if account is active
    if (!admin.isActive) {
      return createErrorResponse('Account is disabled', 403)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = admin.failedAttempts + 1
      const maxAttempts = 5
      
      let lockedUntil = null
      if (failedAttempts >= maxAttempts) {
        lockedUntil = new Date(Date.now() + 60 * 60 * 1000) // Lock for 1 hour
      }

      await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          failedAttempts,
          lockedUntil
        }
      })

      return createErrorResponse('Invalid credentials', 401)
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

    // Reset rate limit on successful login
    resetRateLimit(request, 'admin')

    // Log admin login
    await logAdminLogin(admin.id, request)

    // Create auth response
    return createAuthResponse({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive
    }, 'Login successful')

  } catch (error) {
    console.error('Admin login error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
