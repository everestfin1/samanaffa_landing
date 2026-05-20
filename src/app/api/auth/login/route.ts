import { NextResponse } from 'next/server'

/** Password login disabled — portal uses phone + SMS OTP only (AUTH-021). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'La connexion par mot de passe n\'est plus disponible. Utilisez votre numéro de téléphone.',
    },
    { status: 410 },
  )
}
