import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { generateCSRFToken, getSessionIdFromRequest } from '@/lib/csrf'

export async function GET(request: NextRequest) {
  try {
    // Get the session token to identify the user
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get session ID from request
    const sessionId = getSessionIdFromRequest(request)
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID not found' },
        { status: 400 }
      )
    }

    // Generate CSRF token for this session
    const csrfToken = await generateCSRFToken(sessionId)

    return NextResponse.json({
      csrfToken,
      sessionId
    })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // For consistency, allow POST as well as GET
  return GET(request)
}
