'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import OnboardingDepositModal, {
  type PendingOnboardingDeposit,
} from '@/components/portal/OnboardingDepositModal';
import TransferModal from '@/components/modals/TransferModal';

interface PendingOnboardingDepositCardProps {
  intent: PendingOnboardingDeposit;
  onUpdated: () => void;
  onCancelled: () => void;
  onPaymentComplete: () => void;
  autoOpenConfirm?: boolean;
}

export default function PendingOnboardingDepositCard({
  intent,
  onUpdated,
  onCancelled,
  onPaymentComplete,
  autoOpenConfirm = false,
}: PendingOnboardingDepositCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(autoOpenConfirm);
  const [showModify, setShowModify] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!window.confirm('Annuler ce dépôt programmé ? Vous pourrez en créer un nouveau plus tard.')) {
      return;
    }
    setIsCancelling(true);
    setActionError(null);
    try {
      const res = await fetch('/api/onboarding/pending-deposit', { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Annulation impossible');
      onCancelled();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleModify = async ({ amount }: { amount: number; method: string }) => {
    setActionError(null);
    const res = await fetch('/api/onboarding/pending-deposit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Modification impossible');
    setShowModify(false);
    onUpdated();
  };

  return (
    <>
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
        <div>
          <p className="font-semibold text-amber-900">Confirmer votre premier dépôt</p>
          <p className="text-sm text-amber-800/90 mt-1">
            Votre identité est validée. Finalisez votre dépôt de{' '}
            <strong>{formatCurrency(intent.amount)} FCFA</strong> via Intouch (même parcours que les
            dépôts sur ce compte).
          </p>
        </div>
        {actionError && <p className="text-sm text-red-600">{actionError}</p>}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 px-5 py-2.5 bg-gold-metallic text-white rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Confirmer via Intouch
          </button>
          <button
            type="button"
            onClick={() => setShowModify(true)}
            className="flex-1 px-5 py-2.5 border border-amber-300 text-amber-900 rounded-lg font-medium hover:bg-amber-100/80 transition-colors"
          >
            Modifier le montant
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex-1 px-5 py-2.5 border border-timberwolf/40 text-night/70 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {isCancelling ? 'Annulation…' : 'Annuler'}
          </button>
        </div>
      </section>

      <OnboardingDepositModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        intent={intent}
        onPaymentComplete={() => {
          setShowConfirmModal(false);
          onPaymentComplete();
        }}
      />

      {showModify && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-night">Modifier le montant</h3>
              <button
                type="button"
                onClick={() => setShowModify(false)}
                className="text-night/60 hover:text-night"
              >
                ✕
              </button>
            </div>
            <TransferModal
              isOpen
              variant="embedded"
              type="deposit"
              accountName="Sama Naffa"
              accountType="sama_naffa"
              scheduleIntentOnly
              initialAmount={intent.amount}
              submitLabel="Enregistrer le montant"
              cancelLabel="Fermer"
              onClose={() => setShowModify(false)}
              onConfirm={handleModify}
            />
          </div>
        </div>
      )}
    </>
  );
}
