import { prisma } from './prisma';
import { parseInvestorProfile } from './onboarding-progress';

const LEGACY_SESSION_VERSION_KEY = 'sessionVersion';

/** Read version from legacy investorProfile JSON (pre-AUTH-023 migration). */
export function readSessionVersionFromProfile(investorProfile: unknown): number {
  const profile = parseInvestorProfile(investorProfile);
  const version = profile[LEGACY_SESSION_VERSION_KEY];
  return typeof version === 'number' && Number.isFinite(version) ? version : 0;
}

/** Effective session version: dedicated column with JSON fallback. */
export function resolveSessionVersion(
  sessionVersion: number | null | undefined,
  investorProfile: unknown,
): number {
  if (typeof sessionVersion === 'number' && Number.isFinite(sessionVersion)) {
    return sessionVersion;
  }
  return readSessionVersionFromProfile(investorProfile);
}

/** Max of column + legacy JSON — used only when bumping to avoid downgrading after migration. */
export function resolveSessionVersionForBump(
  sessionVersion: number | null | undefined,
  investorProfile: unknown,
): number {
  const fromColumn =
    typeof sessionVersion === 'number' && Number.isFinite(sessionVersion)
      ? sessionVersion
      : 0;
  return Math.max(fromColumn, readSessionVersionFromProfile(investorProfile));
}

/** @deprecated Use resolveSessionVersion — kept for callers passing profile only. */
export function readSessionVersion(investorProfile: unknown): number {
  return readSessionVersionFromProfile(investorProfile);
}

/** Invalidate all existing JWTs for this user (AUTH-008 / AUTH-023). */
export async function bumpSessionVersion(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionVersion: true, investorProfile: true },
  });
  if (!user) return 0;

  const current = resolveSessionVersionForBump(
    user.sessionVersion as number | null | undefined,
    user.investorProfile,
  );
  const next = current + 1;

  await prisma.user.update({
    where: { id: userId },
    data: { sessionVersion: next },
  });

  return next;
}
