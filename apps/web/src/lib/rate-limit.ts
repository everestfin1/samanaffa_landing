import { NextRequest } from 'next/server'

interface RateLimitAttempt {
  count: number
  lastAttempt: number
  blockedUntil?: number
}

// Rate limit configurations
const RATE_LIMITS = {
  admin: {
    maxAttempts: parseInt(process.env.ADMIN_RATE_LIMIT_MAX_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.ADMIN_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    blockMs: parseInt(process.env.ADMIN_RATE_LIMIT_BLOCK_MS || '3600000'), // 1 hour
  },
  login: {
    maxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    blockMs: parseInt(process.env.LOGIN_RATE_LIMIT_BLOCK_MS || '1800000'), // 30 minutes
  },
  otp: {
    maxAttempts: parseInt(process.env.OTP_RATE_LIMIT_MAX_ATTEMPTS || '3'),
    windowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
    blockMs: parseInt(process.env.OTP_RATE_LIMIT_BLOCK_MS || '3600000'), // 1 hour
  },
  transaction: {
    maxAttempts: parseInt(process.env.TRANSACTION_RATE_LIMIT_MAX_ATTEMPTS || '10'),
    windowMs: parseInt(process.env.TRANSACTION_RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
    blockMs: parseInt(process.env.TRANSACTION_RATE_LIMIT_BLOCK_MS || '300000'), // 5 minutes
  },
  kyc: {
    maxAttempts: parseInt(process.env.KYC_RATE_LIMIT_MAX_ATTEMPTS || '5'),
    windowMs: parseInt(process.env.KYC_RATE_LIMIT_WINDOW_MS || '3600000'), // 1 hour
    blockMs: parseInt(process.env.KYC_RATE_LIMIT_BLOCK_MS || '3600000'), // 1 hour
  }
}

// Store attempts by type and identifier
const rateLimitAttempts = new Map<string, Map<string, RateLimitAttempt>>()

// Initialize maps for each rate limit type
Object.keys(RATE_LIMITS).forEach(type => {
  rateLimitAttempts.set(type, new Map())
})

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked: boolean
}

export function checkRateLimit(request: NextRequest, type: keyof typeof RATE_LIMITS = 'admin', identifier?: string): RateLimitResult {
  const ip = getClientIP(request)
  const key = identifier || ip // Use provided identifier or fall back to IP
  const config = RATE_LIMITS[type]
  const attemptsMap = rateLimitAttempts.get(type)!
  const now = Date.now()
  const attempts = attemptsMap.get(key)
  
  // Clean up expired entries
  if (attempts && now - attempts.lastAttempt > config.windowMs) {
    attemptsMap.delete(key)
  }
  
  // Check if identifier is currently blocked
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
    attemptsMap.delete(key)
  }
  
  if (!attempts) {
    attemptsMap.set(key, { count: 1, lastAttempt: now })
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
      blocked: false
    }
  }
  
  // Check if within rate limit window
  if (now - attempts.lastAttempt > config.windowMs) {
    attemptsMap.set(key, { count: 1, lastAttempt: now })
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
      blocked: false
    }
  }
  
  // Check if exceeded max attempts
  if (attempts.count >= config.maxAttempts) {
    // Block the identifier for the specified duration
    attempts.blockedUntil = now + config.blockMs
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
    remaining: config.maxAttempts - attempts.count,
    resetTime: now + config.windowMs,
    blocked: false
  }
}

// Convenience functions for specific rate limit types
export function checkLoginRateLimit(request: NextRequest, emailOrPhone?: string): RateLimitResult {
  return checkRateLimit(request, 'login', emailOrPhone)
}

export function checkOTPRateLimit(request: NextRequest, emailOrPhone?: string): RateLimitResult {
  return checkRateLimit(request, 'otp', emailOrPhone)
}

export function checkTransactionRateLimit(request: NextRequest, userId?: string): RateLimitResult {
  return checkRateLimit(request, 'transaction', userId)
}

export function checkKYCRateLimit(request: NextRequest, userId?: string): RateLimitResult {
  return checkRateLimit(request, 'kyc', userId)
}

export function resetRateLimit(request: NextRequest, type: keyof typeof RATE_LIMITS = 'admin', identifier?: string): void {
  const ip = getClientIP(request)
  const key = identifier || ip
  const attemptsMap = rateLimitAttempts.get(type)!
  attemptsMap.delete(key)
}

export function getRateLimitStatus(request: NextRequest, type: keyof typeof RATE_LIMITS = 'admin', identifier?: string): RateLimitResult {
  const ip = getClientIP(request)
  const key = identifier || ip
  const config = RATE_LIMITS[type]
  const attemptsMap = rateLimitAttempts.get(type)!
  const now = Date.now()
  const attempts = attemptsMap.get(key)
  
  if (!attempts) {
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
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
  
  if (now - attempts.lastAttempt > config.windowMs) {
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
      blocked: false
    }
  }
  
  return {
    allowed: attempts.count < config.maxAttempts,
    remaining: Math.max(0, config.maxAttempts - attempts.count),
    resetTime: attempts.lastAttempt + config.windowMs,
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
  
  for (const [type, attemptsMap] of rateLimitAttempts.entries()) {
    const config = RATE_LIMITS[type as keyof typeof RATE_LIMITS]
    
    for (const [key, attempts] of attemptsMap.entries()) {
      if (now - attempts.lastAttempt > config.windowMs && 
          (!attempts.blockedUntil || now >= attempts.blockedUntil)) {
        attemptsMap.delete(key)
      }
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredAttempts, 5 * 60 * 1000)
