/**
 * APE / Emprunt obligataire is removed from the public site (mono-produit Sama Naffa).
 * Set `NEXT_PUBLIC_APE_DEPRECATED=false` only for internal legacy testing.
 */
export function isApeDeprecated(): boolean {
  return process.env.NEXT_PUBLIC_APE_DEPRECATED !== 'false';
}
