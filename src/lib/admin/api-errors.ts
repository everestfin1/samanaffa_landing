/** Extract a user-facing error message from an admin API response. */
export async function readApiError(
  res: Response,
  fallback = 'Une erreur est survenue',
): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string; message?: string };
    if (typeof data.error === 'string' && data.error.trim()) return data.error;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
  } catch {
    // ignore JSON parse errors
  }
  return fallback;
}
