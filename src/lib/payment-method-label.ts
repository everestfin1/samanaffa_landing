import { getOnboardingPaymentMethod } from '@/lib/payments/onboarding-payment-methods';

/** Display labels for stored paymentMethod / wallet ids (ONB-046). */
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  intouch: 'Intouch',
  card: 'Carte bancaire',
  orange_money: 'Max it',
  wave: 'Wave',
  wizall: 'Wizall',
  yas: 'Yas',
  free_money: 'Free Money',
};

/** Pre-Momar wallet ids that were Intouch rails only (Wave is now a direct rail). */
const LEGACY_INTOUCH_WALLET_METHODS = new Set(['orange_money', 'free_money']);

/** Human-readable label for UI (confirm modals, transaction lists). */
export function getPaymentMethodDisplayLabel(paymentMethod: string | null | undefined): string {
  if (!paymentMethod) return 'Intouch';
  const key = paymentMethod.trim().toLowerCase();
  const fromCatalog = getOnboardingPaymentMethod(key);
  if (fromCatalog) return fromCatalog.label;
  return PAYMENT_METHOD_LABELS[key] ?? key.replace(/_/g, ' ');
}

/** @deprecated Prefer getPaymentRail — Wave is no longer treated as a legacy Intouch wallet. */
export function isLegacyWalletPaymentMethod(paymentMethod: string | null | undefined): boolean {
  if (!paymentMethod) return false;
  return LEGACY_INTOUCH_WALLET_METHODS.has(paymentMethod.trim().toLowerCase());
}

/**
 * Prefer storing the brand method id (wave, orange_money, …).
 * `intouch` remains valid for schedule-only T4 intents before method choice.
 */
export function normalizeOnboardingPaymentMethod(
  paymentMethod: string | null | undefined,
): string {
  if (!paymentMethod) return 'intouch';
  return paymentMethod.trim().toLowerCase();
}
