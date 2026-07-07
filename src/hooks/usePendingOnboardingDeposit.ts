'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PendingOnboardingDeposit } from '@/components/portal/OnboardingDepositModal';

export function usePendingOnboardingDeposit(enabled = true) {
  const [pendingDeposit, setPendingDeposit] = useState<PendingOnboardingDeposit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/pending-deposit', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Impossible de charger le versement programmé');
      }
      const data = await res.json();
      setPendingDeposit(data.intent ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
      setPendingDeposit(null);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const cancelPending = useCallback(async () => {
    const res = await fetch('/api/onboarding/pending-deposit', { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Annulation impossible');
    setPendingDeposit(null);
  }, []);

  const updateAmount = useCallback(async (amount: number) => {
    const res = await fetch('/api/onboarding/pending-deposit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Modification impossible');
    if (data.intent) setPendingDeposit(data.intent);
    return data.intent as PendingOnboardingDeposit;
  }, []);

  return {
    pendingDeposit,
    isLoading,
    error,
    refresh,
    cancelPending,
    updateAmount,
    clearPending: () => setPendingDeposit(null),
  };
}
