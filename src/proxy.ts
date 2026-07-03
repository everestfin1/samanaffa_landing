import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkCSRFToken } from '@/lib/csrf';
import { getAdminTokenFromRequest, verifyAdminToken } from '@/lib/admin-auth';
import { buildContentSecurityPolicy } from '@/lib/csp';
import {
  isLegacyCampaignDeprecated,
  legacyAdminRedirect,
  legacyCampaignGoneResponse,
  legacyCampaignRedirect,
  LEGACY_ADMIN_PATH_PREFIXES,
  LEGACY_API_PATH_PREFIXES,
  LEGACY_PUBLIC_PATH_PREFIXES,
  matchesPathPrefix,
} from '@/lib/legacy-campaign-deprecation';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ==================== DISCONTINUED CAMPAIGNS (APE / PEE) ====================
  if (isLegacyCampaignDeprecated()) {
    if (matchesPathPrefix(pathname, LEGACY_API_PATH_PREFIXES)) {
      return legacyCampaignGoneResponse();
    }

    if (matchesPathPrefix(pathname, LEGACY_ADMIN_PATH_PREFIXES)) {
      return legacyAdminRedirect(request.url);
    }

    if (matchesPathPrefix(pathname, LEGACY_PUBLIC_PATH_PREFIXES)) {
      return legacyCampaignRedirect(request.url);
    }
  }

  // ==================== MAINTENANCE MODE ====================
  const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (MAINTENANCE_MODE) {
    const isStaticAsset =
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/static/') ||
      request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|webmanifest)$/);
    const isAllowedRoute =
      pathname.startsWith('/admin') ||
      pathname.startsWith('/portal') ||
      pathname.startsWith('/api/payments') ||
      pathname.startsWith('/api/webhooks') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/onboarding') ||
      pathname === '/maintenance' ||
      pathname === '/manifest.json';

    if (!isStaticAsset && !isAllowedRoute) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
      301,
    );
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = getAdminTokenFromRequest(request);
    if (!adminToken || !verifyAdminToken(adminToken)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const csrfCheck = checkCSRFToken(request);
    if (!csrfCheck.valid) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: csrfCheck.error || 'Request blocked' },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: csrfCheck.error || 'Request blocked' },
        { status: 403 },
      );
    }
  }

  // secureCookie must match authOptions.useSecureCookies so the cookie name
  // (`__Secure-next-auth.session-token` in prod/preview) lines up on read.
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  if (pathname.startsWith('/portal')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload',
    );
  }

  const csp = buildContentSecurityPolicy(process.env.NODE_ENV === 'development');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set(
    'Permissions-Policy',
    'camera=(self "https://verify.didit.me"), microphone=(self "https://verify.didit.me"), fullscreen=(self "https://verify.didit.me"), geolocation=(), payment=()',
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
