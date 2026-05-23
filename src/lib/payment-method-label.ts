/** Display labels for stored paymentMethod / wallet ids (ONB-046). */
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  intouch: 'Intouch',
  orange_money: 'Orange Money',
  wave: 'Wave',
  free_money: 'Free Money',
};

const LEGACY_WALLET_METHODS = new Set(['orange_money', 'wave', 'free_money']);

/** Human-readable label for UI (confirm modals, transaction lists). */
export function getPaymentMethodDisplayLabel(paymentMethod: string | null | undefined): string {
  if (!paymentMethod) return 'Intouch';
  const key = paymentMethod.trim().toLowerCase();
  return PAYMENT_METHOD_LABELS[key] ?? key.replace(/_/g, ' ');
}

/** Onboarding v2 only supports Intouch at payment time; legacy intents may store old wallet ids. */
export function isLegacyWalletPaymentMethod(paymentMethod: string | null | undefined): boolean {
  if (!paymentMethod) return false;
  return LEGACY_WALLET_METHODS.has(paymentMethod.trim().toLowerCase());
}

/** Canonical value for onboarding deposit intents going forward. */
export function normalizeOnboardingPaymentMethod(
  paymentMethod: string | null | undefined,
): 'intouch' {
  void paymentMethod;
  return 'intouch';
}
