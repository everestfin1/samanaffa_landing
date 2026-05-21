import { redirect } from 'next/navigation';

/**
 * Legacy registration entry point. The new onboarding flow lives at /onboarding.
 * Forwards optional referral query params (`ref`, `parrain`, `code_parrainage`).
 */
export default async function RegisterRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const ref =
    (typeof params.ref === 'string' && params.ref) ||
    (typeof params.parrain === 'string' && params.parrain) ||
    (typeof params.code_parrainage === 'string' && params.code_parrainage) ||
    '';

  if (ref) {
    redirect(`/onboarding?ref=${encodeURIComponent(ref)}`);
  }

  redirect('/onboarding');
}
