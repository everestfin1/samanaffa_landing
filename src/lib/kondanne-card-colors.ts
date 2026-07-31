/**
 * Kondanné card fills from Figma "Liste Kondanne" (Momar).
 * Assigned by creation order (oldest → newest). Not stored in DB.
 * Index 0 = Sama Naffa brand green (first Kondanné).
 * Later slots skip near-identical forest greens so adjacent cards read distinct.
 */
export const KONDANNE_CARD_COLORS = [
  '#344425', // 1st — Sama Naffa
  '#707c33', // 2nd — olive
  '#ae8103', // 3rd — gold
  '#c4874a', // 4th — clay
  '#8a5a2b', // 5th — brown
  '#2e4620', // 6th — forest-deep (then cycles)
] as const;

export function kondanneCardColorByIndex(creationIndex: number): string {
  const i = Number.isFinite(creationIndex) ? Math.max(0, Math.floor(creationIndex)) : 0;
  return KONDANNE_CARD_COLORS[i % KONDANNE_CARD_COLORS.length] ?? KONDANNE_CARD_COLORS[0];
}

/** Oldest first. Stable tie-break on id. */
export function sortAccountsByCreation<T extends { id: string; createdAt: string }>(
  accounts: T[],
): T[] {
  return [...accounts].sort((a, b) => {
    const delta = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (delta !== 0) return delta;
    return a.id.localeCompare(b.id);
  });
}

export function kondanneCreationIndex(
  accountId: string,
  accounts: { id: string; createdAt: string }[],
): number {
  const sorted = sortAccountsByCreation(accounts);
  const index = sorted.findIndex((a) => a.id === accountId);
  return index >= 0 ? index : 0;
}

export function kondanneCardColor(
  accountId: string,
  accounts: { id: string; createdAt: string }[],
): string {
  return kondanneCardColorByIndex(kondanneCreationIndex(accountId, accounts));
}
