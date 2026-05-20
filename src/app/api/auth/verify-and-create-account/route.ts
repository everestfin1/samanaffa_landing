import { NextResponse } from 'next/server'

/** Legacy registration API — use /onboarding (AUTH-013). */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'L\'inscription via cette API est désactivée. Créez votre compte sur /onboarding.',
    },
    { status: 410 },
  )
}
