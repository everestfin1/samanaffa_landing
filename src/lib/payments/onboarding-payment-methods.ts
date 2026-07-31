/**
 * Momar payment picker (Figma 166:185).
 *
 * Preferred rails (catalog):
 * - `wave` → direct Wave API when enabled (see wave-client.ts)
 * - `intouch` → Intouch widget for other services
 *
 * Runtime today: Intouch for everything until WAVE_DIRECT_PAYMENTS_ENABLED.
 */

export type PaymentRail = 'wave' | 'intouch';

export type OnboardingPaymentMethodId =
  | 'card'
  | 'orange_money'
  | 'wave'
  | 'wizall'
  | 'yas';

export interface OnboardingPaymentMethod {
  id: OnboardingPaymentMethodId;
  label: string;
  /** Long-term rail once Wave credentials are live. */
  preferredRail: PaymentRail;
  iconSrc: string;
}

/**
 * Flip when DCI Wave API credentials are wired (`WAVE_API_KEY` + base URL).
 * Until then every selection pays via Intouch.
 */
export const WAVE_DIRECT_PAYMENTS_ENABLED = false;

export const ONBOARDING_PAYMENT_METHODS: OnboardingPaymentMethod[] = [
  {
    id: 'card',
    label: 'Carte bancaire',
    preferredRail: 'intouch',
    iconSrc: '/figma/e6/card-tile.png',
  },
  {
    id: 'orange_money',
    label: 'Max it',
    preferredRail: 'intouch',
    iconSrc: '/figma/e6/maxit.png',
  },
  {
    id: 'wave',
    label: 'Wave',
    preferredRail: 'wave',
    iconSrc: '/figma/e6/wave.png',
  },
  {
    id: 'wizall',
    label: 'Wizall',
    preferredRail: 'intouch',
    iconSrc: '/figma/e6/wizall.png',
  },
  {
    id: 'yas',
    label: 'Yas',
    preferredRail: 'intouch',
    iconSrc: '/figma/e6/yas.png',
  },
];

const METHOD_BY_ID = new Map(
  ONBOARDING_PAYMENT_METHODS.map((method) => [method.id, method]),
);

export function isOnboardingPaymentMethodId(
  value: string,
): value is OnboardingPaymentMethodId {
  return METHOD_BY_ID.has(value as OnboardingPaymentMethodId);
}

export function getOnboardingPaymentMethod(
  id: string | null | undefined,
): OnboardingPaymentMethod | null {
  if (!id) return null;
  return METHOD_BY_ID.get(id as OnboardingPaymentMethodId) ?? null;
}

/** Active checkout rail for a selected method (Intouch-only until Wave is enabled). */
export function getPaymentRail(methodId: string | null | undefined): PaymentRail {
  const method = getOnboardingPaymentMethod(methodId);
  if (
    method?.preferredRail === 'wave' &&
    WAVE_DIRECT_PAYMENTS_ENABLED
  ) {
    return 'wave';
  }
  return 'intouch';
}
