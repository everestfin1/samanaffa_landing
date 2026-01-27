/**
 * Normalizes a status search parameter to uppercase or empty string.
 * This is used in validateSearch for TanStack Router to ensure consistent status matching.
 */
export function normalizeStatusParam(status: unknown): string {
  if (typeof status !== 'string') return '';
  return status.trim().toUpperCase();
}
