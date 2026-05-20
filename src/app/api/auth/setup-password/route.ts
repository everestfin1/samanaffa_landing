import { NextResponse } from 'next/server'

/** Password setup disabled — portal login is phone + SMS OTP only (AUTH-003 / AUTH-021). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'La configuration du mot de passe n\'est plus disponible. Connectez-vous avec votre numéro de téléphone.',
    },
    { status: 410 },
  )
}
