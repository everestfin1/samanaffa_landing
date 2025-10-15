import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
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
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Admin routes are handled by their own authentication
    // This middleware just ensures the route exists
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/portal/:path*',
    '/admin/:path*'
  ]
};
