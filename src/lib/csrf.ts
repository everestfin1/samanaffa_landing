import { NextRequest } from 'next/server'
import { isApiMutationAllowed } from './api-mutation-guard'

// Store CSRF tokens in memory (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Helper function to generate random hex string using Web Crypto API
async function generateRandomHex(length: number): Promise<string> {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Clean up expired tokens periodically (only in non-edge environments)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of csrfTokens.entries()) {
      if (value.expires < now) {
        csrfTokens.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export async function generateCSRFToken(sessionId: string): Promise<string> {
  const token = await generateRandomHex(32)
  const expires = Date.now() + (60 * 60 * 1000) // 1 hour
  
  csrfTokens.set(sessionId, { token, expires })
  return token
}

export function verifyCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored) {
    return false
  }
  
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId)
    return false
  }
  
  return stored.token === token
}

export function invalidateCSRFToken(sessionId: string): void {
  csrfTokens.delete(sessionId)
}

// Get CSRF token from request headers
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Try different header names
  const token = request.headers.get('x-csrf-token') ||
                request.headers.get('csrf-token') ||
                request.headers.get('x-xsrf-token')
  
  return token
}

// Get session ID from request (you may need to adapt this based on your session management)
export function getSessionIdFromRequest(request: NextRequest): string | null {
  // Try to get session ID from various sources
  const sessionId = request.headers.get('x-session-id') ||
                    request.cookies.get('session-id')?.value ||
                    request.cookies.get('next-auth.session-token')?.value ||
                    null
  
  return sessionId
}

/** Same-origin / API mutation guard (replaces unused token map flow — AUTH-006). */
export function checkCSRFToken(request: NextRequest): { valid: boolean; error?: string } {
  if (request.nextUrl.pathname.startsWith('/api')) {
    return isApiMutationAllowed(request)
  }

  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return { valid: true }
  }

  return isApiMutationAllowed(request)
}
