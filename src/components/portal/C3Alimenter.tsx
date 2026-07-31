'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import IntouchPayment from '@/components/payments/IntouchPayment';
import type { C1Account } from '@/components/portal/C1Dashboard';
import {
  ONBOARDING_PAYMENT_METHODS,
  type OnboardingPaymentMethodId,
} from '@/lib/payments/onboarding-payment-methods';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface C3AlimenterProps {
  account: C1Account;
  kycStatus: KYCStatus;
}

const MIN_AMOUNT = 1_000;

function formatAmountInput(value: number): string {
  if (!value) return '';
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function parseAmountInput(raw: string): number {
  const digits = raw.replace(/\s/g, '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function buildClientReferenceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SAMA-NAFFA-DEPOSIT-${timestamp}-${random}`;
}

export default function C3Alimenter({ account }: C3AlimenterProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [amountDraft, setAmountDraft] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<OnboardingPaymentMethodId | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showIntouch, setShowIntouch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = useMemo(() => parseAmountInput(amountDraft), [amountDraft]);
  const name = account.productName?.trim() || 'Mon Kondanné';

  const handleSelectMethod = (methodId: OnboardingPaymentMethodId) => {
    if (showIntouch) return;
    setError(null);
    setSelectedMethod(methodId);

    if (amount < MIN_AMOUNT) {
      setError(`Le montant minimum est de ${MIN_AMOUNT.toLocaleString('fr-FR')} FCFA`);
      return;
    }
    if (!userId) {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
      return;
    }

    // Same rail as onboarding today: every method opens Intouch
    // (Wave direct stays off until WAVE_DIRECT_PAYMENTS_ENABLED).
    setReferenceNumber(buildClientReferenceNumber());
    setShowIntouch(true);
  };

  if (showIntouch && userId && referenceNumber) {
    return (
      <div className="c3-shell">
        <div className="c3-layout">
          <div className="c3-col">
            <button
              type="button"
              className="c2-back c3-back"
              onClick={() => setShowIntouch(false)}
            >
              ← Retour
            </button>

            <h1 className="c3-title">Paiement sécurisé</h1>

            <div className="c3-card c3-intouch">
              <IntouchPayment
                amount={amount}
                userId={userId}
                accountId={account.id}
                accountType="sama_naffa"
                intentType="deposit"
                referenceNumber={referenceNumber}
                onSuccess={async () => {
                  setShowIntouch(false);
                  await queryClient.refetchQueries({ queryKey: ['samaNaffaAccounts'] });
                  router.push(`/portal/sama-naffa/${account.id}`);
                }}
                onError={(msg) => {
                  setError(msg);
                  setShowIntouch(false);
                }}
                onCancel={() => setShowIntouch(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="c3-shell">
      <div className="c3-layout">
        <div className="c3-col">
          <button
            type="button"
            className="c2-back c3-back"
            onClick={() => router.push(`/portal/sama-naffa/${account.id}`)}
          >
            ← {name}
          </button>

          <h1 className="c3-title">Alimente ton Kondanné</h1>

          <div className="c3-card">
            <label className="c3-field">
              <span className="c3-label">Montant (FCFA)</span>
              <input
                type="text"
                inputMode="numeric"
                value={amountDraft}
                onChange={(e) => {
                  const next = parseAmountInput(e.target.value);
                  setAmountDraft(next ? formatAmountInput(next) : '');
                  setError(null);
                }}
                placeholder="Entrer un montant"
                className="c3-input"
                autoComplete="off"
              />
            </label>
            <p className="c3-hint">Minimum 1 000 FCFA</p>

            <p className="sn-pay-methods-title">Choisis ton moyen de paiement</p>

            <div className="sn-pay-methods" role="list">
              {ONBOARDING_PAYMENT_METHODS.map((method) => {
                const selected = selectedMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="listitem"
                    className={`sn-pay-method${selected ? ' is-selected' : ''}`}
                    onClick={() => handleSelectMethod(method.id)}
                    aria-label={`Payer avec ${method.label}`}
                    title={method.label}
                  >
                    <Image
                      src={method.iconSrc}
                      alt=""
                      width={62}
                      height={62}
                      className="sn-pay-method-icon"
                      unoptimized
                    />
                  </button>
                );
              })}
            </div>

            {error && <p className="c3-error">{error}</p>}

            <p className="c3-note">Les frais de transaction, nous gérons ça pour toi.</p>
          </div>
        </div>

        <div className="c3-art" aria-hidden>
          <Image
            src="/figma/c3/alimenter-art.png"
            alt=""
            width={427}
            height={370}
            className="c3-art-img"
            priority
          />
        </div>
      </div>
    </div>
  );
}
