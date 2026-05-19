import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { meetsPortalCommunicationsRequirements } from '@/lib/portal-profile-completion';

/**
 * PATCH /api/portal/profile/complete
 *
 * Post-login communications step: real email + legal consents (+ optional marketing).
 * Identity fields are filled from Didit KYC (see lib/kyc-sync.ts).
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const { email, termsAccepted, privacyAccepted, marketingAccepted } = body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    if (termsAccepted !== true || privacyAccepted !== true) {
      return NextResponse.json(
        {
          error:
            "Vous devez accepter les conditions d'utilisation et la politique de confidentialité.",
        },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};
    const now = new Date();

    const currentEmailNorm = (currentUser.email || '').trim().toLowerCase();
    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email requis.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
    }
    if (trimmedEmail.includes('@onboarding.samanaffa.tmp')) {
      return NextResponse.json(
        { error: 'Veuillez fournir une adresse email réelle.' },
        { status: 400 },
      );
    }

    if (trimmedEmail !== currentEmailNorm) {
      const existingEmailUser = await prisma.user.findFirst({
        where: {
          email: trimmedEmail,
          id: { not: userId },
        },
      });
      if (existingEmailUser) {
        return NextResponse.json(
          { error: 'Cet email est déjà associé à un compte existant.' },
          { status: 409 },
        );
      }
      updateData.email = trimmedEmail;
    }

    if (!currentUser.termsAccepted) {
      updateData.termsAccepted = true;
      updateData.termsAcceptedAt = now;
    }
    if (!currentUser.privacyAccepted) {
      updateData.privacyAccepted = true;
      updateData.privacyAcceptedAt = now;
    }
    if (typeof marketingAccepted === 'boolean') {
      updateData.marketingAccepted = marketingAccepted;
    }

    const mergedEmail = (updateData.email as string) || currentUser.email;
    const mergedTerms = true;
    const mergedPrivacy = true;

    const communicationsComplete = meetsPortalCommunicationsRequirements({
      email: mergedEmail,
      termsAccepted: mergedTerms,
      privacyAccepted: mergedPrivacy,
    });

    if (communicationsComplete && currentUser.profileCompletionStatus !== 'COMPLETE') {
      updateData.profileCompletionStatus = 'COMPLETE';
      updateData.profileCompletedAt = now;
      updateData.profileCompletionStep = null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        termsAccepted: updatedUser.termsAccepted,
        privacyAccepted: updatedUser.privacyAccepted,
        marketingAccepted: updatedUser.marketingAccepted,
        profileCompletionStatus:
          updatedUser.profileCompletionStatus ??
          (communicationsComplete ? 'COMPLETE' : 'INCOMPLETE'),
      },
    });
  } catch (error) {
    console.error('[api/portal/profile/complete]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
