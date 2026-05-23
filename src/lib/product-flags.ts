/**
 * Product feature flags (env-driven, no deploy required to toggle).
 *
 * Set `NEXT_PUBLIC_APE_DEPRECATED=true` in Vercel to hide Emprunt obligataire
 * from portal navigation and show a sunset page on legacy routes.
 */
export function isApeDeprecated(): boolean {
  return process.env.NEXT_PUBLIC_APE_DEPRECATED === 'true';
}
