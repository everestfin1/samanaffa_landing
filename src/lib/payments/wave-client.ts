/**
 * Direct Wave payment client (Senegal) — prepared, not active in UX yet.
 *
 * Onboarding currently routes Wave through Intouch
 * (`WAVE_DIRECT_PAYMENTS_ENABLED=false` in onboarding-payment-methods.ts).
 * When DCI credentials land, set that flag and wire createWaveCheckout.
 */

export type WaveCheckoutRequest = {
  amount: number;
  currency?: 'XOF';
  referenceNumber: string;
  successUrl: string;
  errorUrl: string;
  clientReference?: string;
};

export type WaveCheckoutResult =
  | {
      ok: true;
      checkoutUrl: string;
      waveSessionId: string;
    }
  | {
      ok: false;
      code: 'not_configured' | 'request_failed';
      error: string;
    };

export function isWavePaymentsConfigured(): boolean {
  const apiKey = process.env.WAVE_API_KEY?.trim();
  const apiUrl = process.env.WAVE_API_BASE_URL?.trim();
  return Boolean(apiKey && apiUrl);
}

/**
 * Create a Wave checkout session. Stub until WAVE_API_KEY + WAVE_API_BASE_URL exist.
 * Server-only — do not import from client components.
 */
export async function createWaveCheckout(
  request: WaveCheckoutRequest,
): Promise<WaveCheckoutResult> {
  if (!isWavePaymentsConfigured()) {
    return {
      ok: false,
      code: 'not_configured',
      error:
        'Paiement Wave direct pas encore configuré (accès API DCI en attente). Choisis un autre moyen ou réessaie plus tard.',
    };
  }

  // Placeholder for the real Wave Business API call once credentials land.
  void request;
  return {
    ok: false,
    code: 'not_configured',
    error: 'Intégration Wave en cours — endpoint non branché.',
  };
}
