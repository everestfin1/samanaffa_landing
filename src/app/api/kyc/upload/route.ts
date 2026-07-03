import { NextResponse } from 'next/server'

/** @deprecated Didit KYC replaced manual blob upload — route kept for explicit 410 responses. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Le téléversement manuel de documents KYC est désactivé. Utilisez la vérification Didit dans le parcours d\'inscription.',
    },
    {
      status: 410,
      headers: { Deprecation: 'true' },
    },
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 },
  )
}
