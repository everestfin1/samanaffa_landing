/**
 * Single source of truth for “portal profile completion” (post-onboarding modal + API).
 */

const PLACEHOLDER_LAST_NAMES = new Set(['membre', 'member']);

export function isPlaceholderFamilyName(lastName: string | null | undefined): boolean {
  if (!lastName?.trim()) return true;
  return PLACEHOLDER_LAST_NAMES.has(lastName.trim().toLowerCase());
}

export function hasRealPortalEmail(email: string | null | undefined): boolean {
  return !!(email && !email.includes('@onboarding.samanaffa.tmp'));
}

/** Fields required before we stop showing “Complétez votre profil”. */
export function meetsPortalProfileRequirements(u: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  dateOfBirth?: Date | string | null | undefined;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  statutEmploi?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
}): boolean {
  const dobOk =
    u.dateOfBirth != null &&
    u.dateOfBirth !== '' &&
    !(typeof u.dateOfBirth === 'string' && !u.dateOfBirth.trim());

  return !!(
    u.firstName?.trim() &&
    !isPlaceholderFamilyName(u.lastName) &&
    hasRealPortalEmail(u.email) &&
    dobOk &&
    String(u.address ?? '').trim() &&
    String(u.city ?? '').trim() &&
    String(u.country ?? '').trim() &&
    String(u.statutEmploi ?? '').trim() &&
    u.termsAccepted === true &&
    u.privacyAccepted === true
  );
}

export interface ProfileFieldCheck {
  id: string;
  label: string;
  ok: boolean;
}

export function getProfileCompletionProgress(u: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  dateOfBirth?: Date | string | null | undefined;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  statutEmploi?: string | null;
  termsAccepted?: boolean | null;
  privacyAccepted?: boolean | null;
}): { percent: number; checks: ProfileFieldCheck[] } {
  const checks: ProfileFieldCheck[] = [
    { id: 'firstName', label: 'Prénom', ok: !!u.firstName?.trim() },
    {
      id: 'lastName',
      label: 'Nom de famille',
      ok: !isPlaceholderFamilyName(u.lastName),
    },
    { id: 'email', label: 'Email', ok: hasRealPortalEmail(u.email) },
    {
      id: 'dateOfBirth',
      label: 'Date de naissance',
      ok:
        u.dateOfBirth != null &&
        u.dateOfBirth !== '' &&
        !(typeof u.dateOfBirth === 'string' && !u.dateOfBirth.trim()),
    },
    { id: 'address', label: 'Adresse', ok: !!String(u.address ?? '').trim() },
    { id: 'city', label: 'Ville', ok: !!String(u.city ?? '').trim() },
    { id: 'country', label: 'Pays', ok: !!String(u.country ?? '').trim() },
    { id: 'statutEmploi', label: 'Statut professionnel', ok: !!String(u.statutEmploi ?? '').trim() },
    { id: 'termsAccepted', label: 'Conditions d\'utilisation', ok: u.termsAccepted === true },
    { id: 'privacyAccepted', label: 'Politique de confidentialité', ok: u.privacyAccepted === true },
  ];

  const done = checks.filter((c) => c.ok).length;
  const percent = Math.round((done / checks.length) * 100);

  return { percent, checks };
}
