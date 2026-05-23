/**
 * Client helper: ensure onboarding deposit intent is released after KYC approval (ONB-047).
 */
export async function ensureOnboardingDepositReleased(
  maxWaitMs = 12_000,
): Promise<{ ready: boolean; intentId: string | null }> {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const res = await fetch('/api/onboarding/release-deposit', {
      method: 'POST',
      credentials: 'same-origin',
    });
    const data = (await res.json().catch(() => ({}))) as {
      released?: boolean;
      intentId?: string | null;
    };

    if (res.ok && data.released) {
      return { ready: true, intentId: data.intentId ?? null };
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  return { ready: false, intentId: null };
}
