/** Internal path prefixes allowed for notification deep links (AUTH-025 / ONB-031). */
export const ALLOWED_NOTIFICATION_ACTION_URL_PREFIXES = [
  '/portal/',
  '/onboarding',
  '/login',
  '/contact',
] as const;

export function isAllowedNotificationActionUrl(path: string): boolean {
  return ALLOWED_NOTIFICATION_ACTION_URL_PREFIXES.some((prefix) => path.startsWith(prefix));
}
