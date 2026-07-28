import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ne } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getAppBaseUrl } from '@/lib/app-url';
import { readEmailVerificationToken } from '@/lib/email-verification-token';
import { mergeInvestorProfile, readOnboardingProgress } from '@/lib/onboarding-progress';

/**
 * Binds a pending address once the owner opens the emailed link. The token is
 * the only credential needed — recipients may be on another device without a
 * session — and it is single use because success clears pendingEmail.
 */
export async function GET(request: NextRequest) {
  const base = getAppBaseUrl(request);
  const redirect = (status: string) =>
    NextResponse.redirect(`${base}/onboarding?emailConfirmation=${status}`);

  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) return redirect('invalid');

    const payload = readEmailVerificationToken(token);
    if (!payload) return redirect('invalid');

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        investorProfile: users.investorProfile,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) return redirect('invalid');

    if (user.email === payload.email) return redirect('already');

    const pendingEmail = readOnboardingProgress(user.investorProfile).pendingEmail;
    if (!pendingEmail || pendingEmail.toLowerCase() !== payload.email) {
      return redirect('expired');
    }

    const [conflict] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.email, payload.email), ne(users.id, user.id)))
      .limit(1);
    if (conflict) return redirect('taken');

    const investorProfile = mergeInvestorProfile(user.investorProfile, {
      onboarding: { pendingEmail: null },
    });

    await db
      .update(users)
      .set({
        email: payload.email,
        emailVerified: true,
        investorProfile,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return redirect('success');
  } catch (error) {
    console.error('[onboarding/email/confirm]', error);
    return redirect('error');
  }
}
