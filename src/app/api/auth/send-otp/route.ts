import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/otp'
import { normalizeSenegalPhone } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, type } = await request.json()

    console.log('🔍 Send OTP Request:', { email, phone, type })

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email ou numéro de téléphone requis' },
        { status: 400 }
      )
    }

    if (!type || !['login', 'register'].includes(type)) {
      return NextResponse.json(
        { error: 'Le type doit être "login" ou "register"' },
        { status: 400 }
      )
    }

    // Normalize phone number if provided
    const normalizedPhone = phone ? normalizeSenegalPhone(phone) : null
    console.log('🔄 Phone normalization:', { original: phone, normalized: normalizedPhone })

    if (phone && !normalizedPhone) {
      return NextResponse.json(
        { error: 'Format de numéro de téléphone invalide' },
        { status: 400 }
      )
    }

    const result = await sendOTP(email, normalizedPhone || undefined, type)

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
    console.error('Erreur lors de l\'envoi du code OTP:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
