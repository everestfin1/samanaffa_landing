import { NextRequest } from 'next/server'

interface RateLimitAttempt {
  count: number
  lastAttempt: number
  blockedUntil?: number
}

const loginAttempts = new Map<string, RateLimitAttempt>()
const ADMIN_RATE_LIMIT_MAX_ATTEMPTS = parseInt(process.env.ADMIN_RATE_LIMIT_MAX_ATTEMPTS || '5')
const ADMIN_RATE_LIMIT_WINDOW_MS = parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
const ADMIN_RATE_LIMIT_BLOCK_MS = parseInt(process.env.ADMIN_RATE_LIMIT_BLOCK_MS || '3600000') // 1 hour

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked: boolean
}

export function checkRateLimit(request: NextRequest): RateLimitResult {
  const ip = getClientIP(request)
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  // Clean up expired entries
  if (attempts && now - attempts.lastAttempt > ADMIN_RATE_LIMIT_WINDOW_MS) {
    loginAttempts.delete(ip)
  }
  
  // Check if IP is currently blocked
  if (attempts?.blockedUntil && now < attempts.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: attempts.blockedUntil,
      blocked: true
    }
  }
  
  // If blocked time has passed, reset the attempts
  if (attempts?.blockedUntil && now >= attempts.blockedUntil) {
    loginAttempts.delete(ip)
  }
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return {
      allowed: true,
      remaining: ADMIN_RATE_LIMIT_MAX_ATTEMPTS - 1,
      resetTime: now + ADMIN_RATE_LIMIT_WINDOW_MS,
      blocked: false
    }
  }
  
  // Check if within rate limit window
  if (now - attempts.lastAttempt > ADMIN_RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return {
      allowed: true,
      remaining: ADMIN_RATE_LIMIT_MAX_ATTEMPTS - 1,
      resetTime: now + ADMIN_RATE_LIMIT_WINDOW_MS,
      blocked: false
    }
  }
  
  // Check if exceeded max attempts
  if (attempts.count >= ADMIN_RATE_LIMIT_MAX_ATTEMPTS) {
    // Block the IP for the specified duration
    attempts.blockedUntil = now + ADMIN_RATE_LIMIT_BLOCK_MS
    attempts.count++
    attempts.lastAttempt = now
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: attempts.blockedUntil,
      blocked: true
    }
  }
  
  // Increment attempt count
  attempts.count++
  attempts.lastAttempt = now
  
  return {
    allowed: true,
    remaining: ADMIN_RATE_LIMIT_MAX_ATTEMPTS - attempts.count,
    resetTime: now + ADMIN_RATE_LIMIT_WINDOW_MS,
    blocked: false
  }
}

export function resetRateLimit(request: NextRequest): void {
  const ip = getClientIP(request)
  loginAttempts.delete(ip)
}

export function getRateLimitStatus(request: NextRequest): RateLimitResult {
  const ip = getClientIP(request)
  const now = Date.now()
  const attempts = loginAttempts.get(ip)
  
  if (!attempts) {
    return {
      allowed: true,
      remaining: ADMIN_RATE_LIMIT_MAX_ATTEMPTS,
      resetTime: now + ADMIN_RATE_LIMIT_WINDOW_MS,
      blocked: false
    }
  }
  
  if (attempts.blockedUntil && now < attempts.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: attempts.blockedUntil,
      blocked: true
    }
  }
  
  if (now - attempts.lastAttempt > ADMIN_RATE_LIMIT_WINDOW_MS) {
    return {
      allowed: true,
      remaining: ADMIN_RATE_LIMIT_MAX_ATTEMPTS,
      resetTime: now + ADMIN_RATE_LIMIT_WINDOW_MS,
      blocked: false
    }
  }
  
  return {
    allowed: attempts.count < ADMIN_RATE_LIMIT_MAX_ATTEMPTS,
    remaining: Math.max(0, ADMIN_RATE_LIMIT_MAX_ATTEMPTS - attempts.count),
    resetTime: attempts.lastAttempt + ADMIN_RATE_LIMIT_WINDOW_MS,
    blocked: false
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return 'unknown'
}

// Cleanup function to run periodically
export function cleanupExpiredAttempts(): void {
  const now = Date.now()
  for (const [ip, attempts] of loginAttempts.entries()) {
    if (now - attempts.lastAttempt > ADMIN_RATE_LIMIT_WINDOW_MS && 
        (!attempts.blockedUntil || now >= attempts.blockedUntil)) {
      loginAttempts.delete(ip)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredAttempts, 5 * 60 * 1000)
