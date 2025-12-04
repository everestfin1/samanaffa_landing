import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Verify a sponsor code (public endpoint for subscription form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string' || code.trim().length < 3) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'Code invalide'
      });
    }

    // Normalize code to uppercase
    const normalizedCode = code.trim().toUpperCase();

    // Find the sponsor code
    const sponsorCode = await prisma.apeSponsorCode.findUnique({
      where: { code: normalizedCode }
    });

    if (!sponsorCode) {
      return NextResponse.json({
        success: true,
        valid: false,
        error: 'Code de parrainage non reconnu'
      });
    }

    // Check if code is active
    if (sponsorCode.status !== 'ACTIVE') {
      return NextResponse.json({
        success: true,
        valid: false,
        error: sponsorCode.status === 'EXPIRED' 
          ? 'Ce code de parrainage a expiré' 
          : 'Ce code de parrainage n\'est plus actif'
      });
    }

    // Check if code has expired by date
    if (sponsorCode.expiresAt && new Date(sponsorCode.expiresAt) < new Date()) {
      // Auto-update status to expired
      await prisma.apeSponsorCode.update({
        where: { id: sponsorCode.id },
        data: { status: 'EXPIRED' }
      });

      return NextResponse.json({
        success: true,
        valid: false,
        error: 'Ce code de parrainage a expiré'
      });
    }

    // Check if max usage has been reached
    if (sponsorCode.maxUsage !== null && sponsorCode.usageCount >= sponsorCode.maxUsage) {
      return NextResponse.json({
        success: true,
        valid: false,
        error: 'Ce code de parrainage a atteint sa limite d\'utilisation'
      });
    }

    // Code is valid
    return NextResponse.json({
      success: true,
      valid: true,
      code: sponsorCode.code,
      message: 'Code de parrainage valide'
    });

  } catch (error) {
    console.error('[APE] Error verifying sponsor code:', error);
    return NextResponse.json(
      { success: false, valid: false, error: 'Erreur lors de la vérification du code' },
      { status: 500 }
    );
  }
}
