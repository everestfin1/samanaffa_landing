import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkCSRFToken } from '@/lib/csrf';

export async function proxy(request: NextRequest) {
  // ==================== MAINTENANCE MODE ====================
  // Set to true to enable maintenance mode (redirects all traffic to /apesenegal)
  // Set to false to disable maintenance mode and restore normal operation
    const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  
  if (MAINTENANCE_MODE) {
    // Exclude static assets, admin routes, and apesenegal routes (to avoid redirect loop)
    const isStaticAsset = request.nextUrl.pathname.startsWith('/_next/') || 
                          request.nextUrl.pathname.startsWith('/static/') ||
                          request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/);
    const isAllowedRoute = request.nextUrl.pathname.startsWith('/admin') ||
                          request.nextUrl.pathname.startsWith('/pee');
    
    if (!isStaticAsset && !isAllowedRoute) {
      return NextResponse.redirect(new URL('/pee', request.url));
    }
  }
  // =========================================================

  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(`https://${request.headers.get('host')}${request.nextUrl.pathname}`, 301);
  }

  // Check CSRF token for state-changing requests
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const csrfCheck = checkCSRFToken(request);
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: csrfCheck.error || 'CSRF token validation failed' },
        { status: 403 }
      )
    }
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Check if user is trying to access portal routes
  if (request.nextUrl.pathname.startsWith('/portal')) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // For now, we'll let the dashboard handle KYC status display
    // In a production environment, you might want to add additional checks here
    // based on the user's KYC status from the token
  }

  // Check if user is trying to access admin routes
  // if (request.nextUrl.pathname.startsWith('/admin')) {
  //   // IP-based access control for admin routes
  //   // const allowedIPs = (process.env.ADMIN_ALLOWED_IPS || '').split(',').map(ip => ip.trim()).filter(Boolean);
    
  //   if (allowedIPs.length > 0) {
  //     // Get client IP from various headers (Vercel uses x-forwarded-for)
  //     const forwardedFor = request.headers.get('x-forwarded-for');
  //     const realIP = request.headers.get('x-real-ip');
  //     const clientIP = forwardedFor?.split(',')[0]?.trim() || realIP || 'unknown';
      
  //     if (!allowedIPs.includes(clientIP)) {
  //       // Return 404 to hide admin existence from unauthorized IPs
  //       return NextResponse.redirect(new URL('/apesenegal', request.url));
  //     }
  //   }
    
  //   // Admin routes are handled by their own authentication
  //   return NextResponse.next();
  // }

  // Create response
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // HSTS (HTTP Strict Transport Security) - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://touchpay.gutouch.net https://cdnjs.cloudflare.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.twilio.com https://api.bulksms.com https://api.sendgrid.com https://api.intouch.com https://touchpay.gutouch.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.google.com",
    "frame-src 'self' https://vercel.live",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://touchpay.gutouch.net",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Permissions Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
