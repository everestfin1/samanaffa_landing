import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json()

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      )
    }

    if (!type || !['login', 'register'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "login" or "register"' },
        { status: 400 }
      )
    }

    const result = await sendOTP(email, phone)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: result.message
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
