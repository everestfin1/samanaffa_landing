import { prisma } from './prisma';
import { mergeInvestorProfile, parseInvestorProfile } from './onboarding-progress';

const SESSION_VERSION_KEY = 'sessionVersion';

export function readSessionVersion(investorProfile: unknown): number {
  const profile = parseInvestorProfile(investorProfile);
  const version = profile[SESSION_VERSION_KEY];
  return typeof version === 'number' && Number.isFinite(version) ? version : 0;
}

/** Invalidate all existing JWTs for this user (AUTH-008). */
export async function bumpSessionVersion(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { investorProfile: true },
  });
  if (!user) return 0;

  const next = readSessionVersion(user.investorProfile) + 1;
  await prisma.user.update({
    where: { id: userId },
    data: {
      investorProfile: mergeInvestorProfile(user.investorProfile, {
        [SESSION_VERSION_KEY]: next,
      }),
    },
  });
  return next;
}
