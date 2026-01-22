import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminRefreshToken, createAuthResponse, createErrorResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return createErrorResponse('Refresh token is required', 400)
    }

    const { error, user } = await verifyAdminRefreshToken(refreshToken)

    if (error || !user) {
      return createErrorResponse('Invalid or expired refresh token', 401)
    }

    return createAuthResponse(user, 'Token refreshed successfully')

  } catch (error) {
    console.error('Token refresh error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
