import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkCSRFToken } from '@/lib/csrf';
import { getAdminTokenFromRequest, verifyAdminToken } from '@/lib/admin-auth';

export async function proxy(request: NextRequest) {
  // ==================== DISCONTINUED PRODUCTS ====================
  if (request.nextUrl.pathname.startsWith('/pee')) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // ==================== MAINTENANCE MODE ====================
  const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  if (MAINTENANCE_MODE) {
    const isStaticAsset =
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/static/') ||
      request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|webmanifest)$/);
    const isAllowedRoute =
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/pee') ||
      request.nextUrl.pathname.startsWith('/apesenegal') ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/onboarding') ||
      request.nextUrl.pathname.startsWith('/souscrire-ape') ||
      request.nextUrl.pathname === '/manifest.json';

    if (!isStaticAsset && !isAllowedRoute) {
      return NextResponse.redirect(new URL('/pee', request.url));
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

  const pathname = request.nextUrl.pathname;

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

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

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

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://touchpay.gutouch.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.twilio.com https://api.bulksms.com https://api.sendgrid.com https://api.intouch.com https://touchpay.gutouch.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://connect.facebook.net https://www.facebook.com",
    "frame-src 'self' https://vercel.live https://www.googletagmanager.com https://verify.didit.me",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://touchpay.gutouch.net",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

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
