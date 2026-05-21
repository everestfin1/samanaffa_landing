/** Prefer Didit JS SDK modal on desktop with a fine pointer (not touch-primary). */
export function shouldUseDiditWebSdk(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  if (window.matchMedia('(max-width: 1023px)').matches) return false;
  return true;
}
