/**
 * Portal profile / communications completion (post-onboarding).
 * Identity fields come from Didit KYC — the modal only collects email + legal consents.
 */

const PLACEHOLDER_LAST_NAMES = new Set(['membre', 'member']);

export function isPlaceholderFamilyName(lastName: string | null | undefined): boolean {
  if (!lastName?.trim()) return true;
  return PLACEHOLDER_LAST_NAMES.has(lastName.trim().toLowerCase());
}

export function hasRealPortalEmail(email: string | null | undefined): boolean {
  return !!(email && !email.includes('@onboarding.samanaffa.tmp'));
}

/** Email + mandatory legal consents (marketing popup). */
export function meetsPortalCommunicationsRequirements(u: {
  email?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
}): boolean {
  return !!(
    hasRealPortalEmail(u.email) &&
    u.termsAccepted === true &&
    u.privacyAccepted === true
  );
}

/** Identity data expected from Didit (used for compliance / display, not the modal). */
export function meetsVerifiedIdentityRequirements(u: {
  kycStatus?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | string | null | undefined;
}): boolean {
  if (u.kycStatus !== 'APPROVED') return false;

  const dobOk =
    u.dateOfBirth != null &&
    u.dateOfBirth !== '' &&
    !(typeof u.dateOfBirth === 'string' && !u.dateOfBirth.trim());

  return !isPlaceholderFamilyName(u.lastName) && dobOk;
}

/**
 * Full portal readiness: communications done (modal) + KYC-approved identity on file.
 * @deprecated Prefer checking communications and KYC separately in UI.
 */
export function meetsPortalProfileRequirements(u: {
  email?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
  kycStatus?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | string | null | undefined;
  firstName?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  statutEmploi?: string | null;
}): boolean {
  return (
    meetsPortalCommunicationsRequirements(u) &&
    meetsVerifiedIdentityRequirements(u)
  );
}

export interface ProfileFieldCheck {
  id: string;
  label: string;
  ok: boolean;
}

/** Progress for the communications modal only. */
export function getCommunicationsCompletionProgress(u: {
  email?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
  marketingAccepted?: boolean | null;
}): { percent: number; checks: ProfileFieldCheck[] } {
  const checks: ProfileFieldCheck[] = [
    { id: 'email', label: 'Email', ok: hasRealPortalEmail(u.email) },
    { id: 'termsAccepted', label: 'Convention-Cadre Utilisateur (CCU)', ok: u.termsAccepted === true },
    { id: 'privacyAccepted', label: 'Politique de confidentialité', ok: u.privacyAccepted === true },
    {
      id: 'marketingAccepted',
      label: 'Communications marketing (optionnel)',
      ok: u.marketingAccepted === true,
    },
  ];

  const required = checks.filter((c) => c.id !== 'marketingAccepted');
  const done = required.filter((c) => c.ok).length;
  const percent = Math.round((done / required.length) * 100);

  return { percent, checks };
}

/** @deprecated Use getCommunicationsCompletionProgress */
export function getProfileCompletionProgress(u: {
  email?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
  marketingAccepted?: boolean | null;
}): { percent: number; checks: ProfileFieldCheck[] } {
  return getCommunicationsCompletionProgress(u);
}
