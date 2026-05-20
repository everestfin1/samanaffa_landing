import { NextRequest } from 'next/server';

const EXEMPT_PREFIXES = [
  '/api/auth/callback',
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/providers',
  '/api/auth/csrf',
  '/api/webhooks/',
  '/api/payments/intouch/callback',
];

/** Same-origin guard for state-changing API requests (AUTH-006). */
export function isApiMutationAllowed(request: NextRequest): { valid: boolean; error?: string } {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api')) {
    return { valid: true };
  }

  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return { valid: true };
  }

  if (EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return { valid: true };
  }

  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite === 'same-origin' || secFetchSite === 'none') {
    return { valid: true };
  }

  const host = request.headers.get('host');
  const origin = request.headers.get('origin');
  if (origin && host) {
    try {
      if (new URL(origin).host === host) {
        return { valid: true };
      }
    } catch {
      // ignore malformed origin
    }
  }

  const referer = request.headers.get('referer');
  if (referer && host) {
    try {
      if (new URL(referer).host === host) {
        return { valid: true };
      }
    } catch {
      // ignore malformed referer
    }
  }

  if (request.headers.get('x-requested-with') === 'XMLHttpRequest') {
    return { valid: true };
  }

  return { valid: false, error: 'Cross-origin request blocked' };
}
