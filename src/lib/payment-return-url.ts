import { safeCallbackUrl } from '@/lib/safe-callback-url';

export const DEFAULT_PAYMENT_RETURN_PATH = '/portal/sama-naffa';
export const ONBOARDING_PAYMENT_RETURN_PATH = '/onboarding';

export function getPaymentReturnPath(returnTo: string | null | undefined): string {
  return safeCallbackUrl(returnTo, DEFAULT_PAYMENT_RETURN_PATH);
}

export function withReturnTo(url: string, returnTo?: string): string {
  if (!returnTo) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}returnTo=${encodeURIComponent(returnTo)}`;
}
