'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import IntouchPayment from '@/components/payments/IntouchPayment';
import { formatCurrency } from '@/lib/utils';

export interface PendingOnboardingDeposit {
  id: string;
  accountId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
}

interface OnboardingDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  intent: PendingOnboardingDeposit;
  onPaymentComplete?: () => void;
}

const WALLET_LABELS: Record<string, string> = {
  orange_money: 'Orange Money',
  wave: 'Wave',
  free_money: 'Free Money',
  intouch: 'Intouch',
};

export default function OnboardingDepositModal({
  isOpen,
  onClose,
  intent,
  onPaymentComplete,
}: OnboardingDepositModalProps) {
  const { data: session } = useSession();
  const [showIntouchPayment, setShowIntouchPayment] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const userId = (session?.user as { id?: string })?.id;
  const walletLabel =
    WALLET_LABELS[intent.paymentMethod?.toLowerCase()] ?? intent.paymentMethod;

  const handleIntouchSuccess = () => {
    onPaymentComplete?.();
    onClose();
  };

  return (
    <motionlessOverlay>
      <motionlessCard>
        <motionlessHeader
          title={
            showIntouchPayment ? 'Paiement via Intouch' : 'Confirmer votre premier dépôt'
          }
          onClose={onClose}
        />

        {showIntouchPayment && userId ? (
          <IntouchPayment
            amount={intent.amount}
            userId={userId}
            accountId={intent.accountId}
            accountType="sama_naffa"
            intentType="deposit"
            referenceNumber={intent.referenceNumber}
            onSuccess={handleIntouchSuccess}
            onError={(msg) => {
              setError(msg);
              setShowIntouchPayment(false);
            }}
            onCancel={() => setShowIntouchPayment(false)}
          />
        ) : (
          <motionlessIntro
            amount={intent.amount}
            walletLabel={walletLabel}
            error={error}
            userId={userId}
            onLater={onClose}
            onPay={() => {
              setError('');
              if (!userId) {
                setError('Votre session a expiré. Veuillez vous reconnecter.');
                return;
              }
              setShowIntouchPayment(true);
            }}
          />
        )}
      </motionlessCard>
    </motionlessOverlay>
  );
}

function motionlessOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      {children}
    </div>
  );
}

function motionlessCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">{children}</motionlessCard>;
}

function motionlessHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-night">{title}</h3>
      <button onClick={onClose} className="text-night/60 hover:text-night" type="button">
        ✕
      </button>
    </div>
  );
}

function motionlessIntro({
  amount,
  walletLabel,
  error,
  userId,
  onLater,
  onPay,
}: {
  amount: number;
  walletLabel: string;
  error: string;
  userId?: string;
  onLater: () => void;
  onPay: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-night/70">
        Votre identité est validée. Finalisez le dépôt programmé lors de votre inscription via
        Intouch (même parcours que les dépôts sur votre compte).
      </p>
      <div className="p-4 bg-gold-light/20 border border-gold-metallic/30 rounded-xl space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-night/60">Montant</span>
          <span className="font-bold text-night">{formatCurrency(amount)} FCFA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-night/60">Moyen de paiement</span>
          <span className="font-medium text-night">{walletLabel}</span>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={onLater}
          className="flex-1 border border-timberwolf/30 text-night py-3 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
        >
          Plus tard
        </button>
        <button
          type="button"
          onClick={onPay}
          disabled={!userId}
          className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors text-white bg-gold-metallic hover:bg-gold-dark disabled:opacity-50"
        >
          Payer via Intouch
        </button>
      </div>
    </div>
  );
}
