import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { logAdminLogout } from '@/lib/audit-logger'

export async function POST(request: NextRequest) {
  try {
    // Verify the token to ensure it's valid before logging out
    const { user, error } = await verifyAdminAuth(request)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 })
    }

    // Log admin logout
    if (user) {
      await logAdminLogout(user.id, request)
    }

    // In a more sophisticated setup, you might want to:
    // 1. Add the token to a blacklist
    // 2. Store the logout event in the database
    // 3. Clear any server-side sessions

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
