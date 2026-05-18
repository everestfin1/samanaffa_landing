import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PATCH /api/portal/profile/complete
 *
 * Authenticated endpoint for post-login profile completion.
 * Updates firstName, lastName, email, DOB, address, profession, and legal consents.
 * Marks profile as COMPLETE when all required fields are present.
 *
 * Accepts: { firstName, lastName, email, dateOfBirth, address, city, country, statutEmploi, termsAccepted, privacyAccepted, marketingAccepted }
 * Returns: { success: true, user: {...} }
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      address,
      city,
      country,
      statutEmploi,
      termsAccepted,
      privacyAccepted,
      marketingAccepted,
    } = body;

    // Fetch current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    const now = new Date();

    // Basic profile fields
    if (typeof firstName === 'string' && firstName.trim()) {
      updateData.firstName = firstName.trim();
    }
    if (typeof lastName === 'string' && lastName.trim()) {
      updateData.lastName = lastName.trim();
    }
    if (typeof statutEmploi === 'string' && statutEmploi.trim()) {
      updateData.statutEmploi = statutEmploi.trim();
    }

    // Email validation and uniqueness check
    if (typeof email === 'string' && email.trim() && email !== currentUser.email) {
      const trimmedEmail = email.trim().toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return NextResponse.json(
          { error: 'Format d\'email invalide.' },
          { status: 400 },
        );
      }

      if (trimmedEmail.includes('@onboarding.samanaffa.tmp')) {
        return NextResponse.json(
          { error: 'Veuillez fournir une adresse email réelle.' },
          { status: 400 },
        );
      }

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

    // Address fields
    if (typeof address === 'string' && address.trim()) {
      updateData.address = address.trim();
    }
    if (typeof city === 'string' && city.trim()) {
      updateData.city = city.trim();
    }
    if (typeof country === 'string' && country.trim()) {
      updateData.country = country.trim();
    }

    // Date of birth with age validation
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) {
        return NextResponse.json(
          { error: 'Date de naissance invalide.' },
          { status: 400 },
        );
      }
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        return NextResponse.json(
          { error: 'Vous devez avoir au moins 18 ans.' },
          { status: 400 },
        );
      }
      updateData.dateOfBirth = dob;
    }

    // Legal consents
    if (typeof termsAccepted === 'boolean' && termsAccepted && !currentUser.termsAccepted) {
      updateData.termsAccepted = true;
      updateData.termsAcceptedAt = now;
    }
    if (typeof privacyAccepted === 'boolean' && privacyAccepted && !currentUser.privacyAccepted) {
      updateData.privacyAccepted = true;
      updateData.privacyAcceptedAt = now;
    }
    if (typeof marketingAccepted === 'boolean') {
      updateData.marketingAccepted = marketingAccepted;
    }

    // Pre-compute completeness to merge into a single DB write
    const mergedFirstName = (updateData.firstName as string) || currentUser.firstName;
    const mergedLastName = (updateData.lastName as string) || currentUser.lastName;
    const mergedEmail = (updateData.email as string) || currentUser.email;
    const mergedDob = updateData.dateOfBirth || currentUser.dateOfBirth;
    const mergedAddress = (updateData.address as string) || currentUser.address;
    const mergedCity = (updateData.city as string) || currentUser.city;
    const mergedCountry = (updateData.country as string) || currentUser.country;
    const mergedStatut = (updateData.statutEmploi as string) || currentUser.statutEmploi;
    const mergedTerms = (updateData.termsAccepted as boolean | undefined) ?? currentUser.termsAccepted;
    const mergedPrivacy = (updateData.privacyAccepted as boolean | undefined) ?? currentUser.privacyAccepted;

    const isComplete =
      mergedFirstName &&
      mergedLastName &&
      mergedEmail &&
      !mergedEmail.includes('@onboarding.samanaffa.tmp') &&
      mergedDob &&
      mergedAddress &&
      mergedCity &&
      mergedCountry &&
      mergedStatut &&
      mergedTerms &&
      mergedPrivacy;

    if (isComplete && currentUser.profileCompletionStatus !== 'COMPLETE') {
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
        dateOfBirth: updatedUser.dateOfBirth,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country,
        statutEmploi: updatedUser.statutEmploi,
        termsAccepted: updatedUser.termsAccepted,
        privacyAccepted: updatedUser.privacyAccepted,
        marketingAccepted: updatedUser.marketingAccepted,
        profileCompletionStatus: updatedUser.profileCompletionStatus ?? (isComplete ? 'COMPLETE' : 'INCOMPLETE'),
      },
    });
  } catch (error) {
    console.error('[api/portal/profile/complete]', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
