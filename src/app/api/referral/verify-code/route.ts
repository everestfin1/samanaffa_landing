import { NextRequest, NextResponse } from 'next/server';
import { verifyAgentCode } from '@/lib/field-agent';

/** Public verification for Sama Naffa referral codes (onboarding). */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Code requis' }, { status: 400 });
    }

    const result = await verifyAgentCode(code);
    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error });
    }

    return NextResponse.json({
      valid: true,
      code: result.code,
      message: result.message,
    });
  } catch (error) {
    console.error('[referral/verify-code]', error);
    return NextResponse.json({ valid: false, error: 'Erreur de vérification' }, { status: 500 });
  }
}
