import { NextResponse } from 'next/server'

/** Password reset disabled — portal login is phone + SMS OTP only (AUTH-001 / AUTH-021). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'La réinitialisation par mot de passe n\'est plus disponible. Connectez-vous avec votre numéro de téléphone.',
    },
    { status: 410 },
  )
}
