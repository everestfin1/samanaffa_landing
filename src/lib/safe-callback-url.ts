/** Allow only same-origin relative paths (no open redirects). */
export function safeCallbackUrl(raw: string | null | undefined, fallback: string): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return fallback;
  }
  return raw;
}
