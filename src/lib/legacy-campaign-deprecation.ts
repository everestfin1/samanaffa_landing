import { NextResponse } from 'next/server';
import { isApeDeprecated } from '@/lib/product-flags';

/** APE Sénégal + PEE campaigns — inactive per PM (June 2026). */
export function isLegacyCampaignDeprecated(): boolean {
  return isApeDeprecated();
}

export const LEGACY_CAMPAIGN_GONE_MESSAGE =
  'Cette campagne (APE / PEE) n’est plus active. Découvrez Sama Naffa sur /sama-naffa.';

export const LEGACY_PUBLIC_PATH_PREFIXES = [
  '/pee',
  '/ape',
  '/apesenegal',
  '/souscrire-ape',
  '/portal/ape',
] as const;

export const LEGACY_API_PATH_PREFIXES = [
  '/api/ape',
  '/api/pee',
  '/api/lead-pee',
  '/api/admin/ape-subscriptions',
  '/api/admin/pee-leads',
] as const;

// /admin/sponsor-codes and /api/admin/sponsor-codes are Sama Naffa referral codes.
export const LEGACY_ADMIN_PATH_PREFIXES = [
  '/admin/ape',
  '/admin/pee-leads',
] as const;

export function matchesPathPrefix(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function legacyCampaignGoneResponse(): NextResponse {
  return NextResponse.json(
    { error: LEGACY_CAMPAIGN_GONE_MESSAGE },
    { status: 410, headers: { Deprecation: 'true' } },
  );
}

export function legacyCampaignRedirect(requestUrl: string): NextResponse {
  return NextResponse.redirect(new URL('/sama-naffa', requestUrl), 301);
}

export function legacyAdminRedirect(requestUrl: string): NextResponse {
  return NextResponse.redirect(new URL('/admin', requestUrl));
}

/** Use at the top of legacy campaign API handlers. */
export function guardLegacyCampaignApi(): NextResponse | null {
  if (isLegacyCampaignDeprecated()) {
    return legacyCampaignGoneResponse();
  }
  return null;
}
