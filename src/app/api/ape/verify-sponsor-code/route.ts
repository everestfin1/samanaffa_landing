import { NextRequest, NextResponse } from 'next/server';
import { verifySponsorCode } from '@/lib/sponsor-code';
import { guardLegacyCampaignApi } from '@/lib/legacy-campaign-deprecation';

/** @deprecated APE sponsor codes inactive — route kept for explicit 410 responses. */
export async function POST(request: NextRequest) {
  const blocked = guardLegacyCampaignApi();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { code } = body;

    const result = await verifySponsorCode(code ?? '');

    if (!result.valid) {
      return NextResponse.json({
        success: true,
        valid: false,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      code: result.code,
      message: result.message,
    });
  } catch (error) {
    console.error('[APE] Error verifying sponsor code:', error);
    return NextResponse.json(
      { success: false, valid: false, error: 'Erreur lors de la vérification du code' },
      { status: 500 },
    );
  }
}
