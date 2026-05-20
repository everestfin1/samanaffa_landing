import { NextResponse } from 'next/server'

/** Legacy verify-otp API — use onboarding/create-account or NextAuth OTP login (AUTH-013/021). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Cette vérification n\'est plus supportée. Utilisez la connexion par SMS sur /login.',
    },
    { status: 410 },
  )
}
