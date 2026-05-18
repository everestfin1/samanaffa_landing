import { redirect } from 'next/navigation';

/**
 * Legacy registration entry point. The new onboarding flow lives at /onboarding.
 * This redirect preserves any existing bookmarks/links and ensures all new
 * users go through the phone-OTP based account creation.
 *
 * Marked as `dynamic = 'force-static'` would short-circuit the redirect;
 * we keep it dynamic so future query params (e.g. ?ref=...) can be forwarded.
 */
export default function RegisterRedirectPage() {
  redirect('/onboarding');
}
