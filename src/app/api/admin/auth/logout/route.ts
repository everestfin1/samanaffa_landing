import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    // Verify the token to ensure it's valid before logging out
    const { error } = await verifyAdminAuth(request)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 })
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
