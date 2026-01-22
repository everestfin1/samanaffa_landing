import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

/**
 * Security middleware for TanStack Start
 * Handles: maintenance mode, portal auth check, security headers
 */
export const securityMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next, request }) => {
    const url = new URL(request.url)
    const pathname = url.pathname

    // ==================== MAINTENANCE MODE ====================
    const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

    // Skip middleware for API routes - let Vercel Functions handle them
    if (pathname.startsWith('/api')) {
      return next()
    }

    if (MAINTENANCE_MODE) {
      const isStaticAsset =
        pathname.startsWith('/_build/') ||
        pathname.startsWith('/static/') ||
        /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|webmanifest)$/.test(pathname)

      const isAllowedRoute =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/pee') ||
        pathname.startsWith('/ape') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/souscrire-ape') ||
        pathname === '/manifest.json'

      if (!isStaticAsset && !isAllowedRoute) {
        throw redirect({ to: '/pee' })
      }
    }

    // ==================== PORTAL AUTH CHECK ====================
    if (pathname.startsWith('/portal')) {
      const cookieHeader = request.headers.get('cookie') || ''
      const hasSession = cookieHeader.includes('better-auth.session_token=')
      if (!hasSession) {
        throw redirect({ to: '/login' })
      }
    }

    // Continue to next middleware / handler
    const result = await next()

    return result
  }
)

