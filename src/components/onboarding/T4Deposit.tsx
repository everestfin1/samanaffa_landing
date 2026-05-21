'use client';

import { useState } from 'react';
import TransferModal from '@/components/modals/TransferModal';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';

interface T4DepositProps {
  firstName: string;
  initialAmount?: number;
  initialWallet?: string | null;
  onSuccess: (amount: number, wallet: string) => void;
  onBack?: () => void;
}

export default function T4Deposit({
  firstName,
  initialAmount,
  onSuccess,
  onBack,
}: T4DepositProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async ({ amount, method }: { amount: number; method: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/deposit-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, wallet: 'intouch' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      onSuccess(amount, method);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}
      <OnboardingStepHeader
        title={`${firstName}, préparez votre premier dépôt`}
        description="Aucun prélèvement maintenant. Après validation de votre identité, vous confirmerez le paiement via Intouch depuis votre espace client."
        className="mb-6"
      />

      <TransferModal
        isOpen
        variant="embedded"
        type="deposit"
        accountName="Sama Naffa"
        accountType="sama_naffa"
        scheduleIntentOnly
        initialAmount={initialAmount}
        submitLabel={loading ? 'Programmation...' : 'Programmer le dépôt'}
        cancelLabel="Retour"
        submitDisabled={loading}
        onClose={() => onBack?.()}
        onConfirm={handleConfirm}
      />

      {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
        <p className="font-semibold mb-1">⏳ Dépôt programmé</p>
        <p>
          Aucun montant n&apos;est prélevé maintenant. Vous finaliserez le paiement via Intouch une
          fois votre identité validée (généralement moins de 24 h).
        </p>
      </div>
    </div>
  );
}
