'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import IntouchPayment from '@/components/payments/IntouchPayment';
import KYCVerificationMessage from '@/components/kyc/KYCVerificationMessage';
import type { C1Account } from '@/components/portal/C1Dashboard';
import {
  ONBOARDING_PAYMENT_METHODS,
  type OnboardingPaymentMethodId,
} from '@/lib/payments/onboarding-payment-methods';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface C5RetraitProps {
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

function formatFcfa(value: number): string {
  return `${Math.round(value).toLocaleString('fr-FR')} FCFA`;
}

function buildClientReferenceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SAMA-NAFFA-WITHDRAW-${timestamp}-${random}`;
}

export default function C5Retrait({ account, kycStatus }: C5RetraitProps) {
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
  const available = account.balance;
  const kycBlocked = kycStatus !== 'APPROVED';
  const lockedUntil = account.lockedUntil ? new Date(account.lockedUntil) : null;
  const isLocked = Boolean(lockedUntil && lockedUntil > new Date());
  const methodsDisabled = kycBlocked || isLocked || showIntouch;

  const lockMessage =
    isLocked && lockedUntil
      ? `Ce Kondanné est bloqué jusqu'au ${lockedUntil.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}. Les retraits seront disponibles à partir de cette date.`
      : null;

  const handleSelectMethod = (methodId: OnboardingPaymentMethodId) => {
    if (showIntouch || methodsDisabled) return;
    setError(null);
    setSelectedMethod(methodId);
  };

  const handleConfirmWithdraw = () => {
    if (showIntouch || methodsDisabled) return;
    setError(null);

    if (!selectedMethod) {
      setError('Choisis un moyen de paiement.');
      return;
    }
    if (kycBlocked) {
      setError("Votre identité doit être approuvée avant d'effectuer un retrait.");
      return;
    }
    if (isLocked && lockMessage) {
      setError(lockMessage);
      return;
    }
    if (amount < MIN_AMOUNT) {
      setError(`Le montant minimum est de ${MIN_AMOUNT.toLocaleString('fr-FR')} FCFA`);
      return;
    }
    if (amount > available) {
      setError(`Fonds insuffisants. Solde disponible: ${formatFcfa(available)}`);
      return;
    }
    if (!userId) {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
      return;
    }

    setReferenceNumber(buildClientReferenceNumber());
    setShowIntouch(true);
  };

  if (showIntouch && userId && referenceNumber) {
    return (
      <div className="c5-shell">
        <button
          type="button"
          className="c2-back c5-back"
          onClick={() => setShowIntouch(false)}
        >
          ← Retour
        </button>
        <h1 className="c5-title">Paiement sécurisé</h1>
        <div className="c5-card c5-intouch">
          <IntouchPayment
            amount={amount}
            userId={userId}
            accountId={account.id}
            accountType="sama_naffa"
            intentType="withdrawal"
            referenceNumber={referenceNumber}
            onSuccess={async () => {
              setShowIntouch(false);
              await queryClient.invalidateQueries({ queryKey: ['samaNaffaAccounts'] });
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
    );
  }

  return (
    <div className="c5-shell">
      <button
        type="button"
        className="c2-back c5-back"
        onClick={() => router.push(`/portal/sama-naffa/${account.id}`)}
      >
        ← {name}
      </button>

      <h1 className="c5-title">Retrait</h1>

      {kycBlocked && (
        <div className="c5-kyc">
          <KYCVerificationMessage
            kycStatus={kycStatus}
            variant="inline"
            onContactSupport={() => window.open('/contact', '_blank')}
            onRestartRegistration={() => window.open('/onboarding', '_blank')}
          />
        </div>
      )}

      {lockMessage && !kycBlocked && (
        <p className="c2-action-warning c5-warning" role="status">
          {lockMessage}
        </p>
      )}

      <div className="c5-layout">
        <div className="c5-col">
          <section className="c5-card c5-estimate" aria-label="Estimation du retrait">
            <p className="c5-estimate-eyebrow">Estimation</p>
            <div className="c5-estimate-rows">
              <div className="c5-estimate-row">
                <span>Montant disponible</span>
                <strong>{formatFcfa(available)}</strong>
              </div>
              <div className="c5-estimate-row">
                <span>Frais de cession</span>
                <strong>à confirmer</strong>
              </div>
              <div className="c5-estimate-row c5-estimate-row--net">
                <span>Montant net estimé</span>
                <strong>{amount >= MIN_AMOUNT ? formatFcfa(amount) : '—'}</strong>
              </div>
            </div>
          </section>

          <div className="c5-card">
            <label className="c5-field">
              <span className="c5-label">Montant (FCFA)</span>
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
                className="c5-input"
                autoComplete="off"
                disabled={kycBlocked || isLocked}
              />
            </label>
            <p className="c5-hint">Minimum 1 000 FCFA</p>

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
                    disabled={methodsDisabled}
                    aria-label={`Retirer avec ${method.label}`}
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
          </div>
        </div>

        <div className="c5-col c5-col--confirm">
          <section className="c5-card c5-confirm" aria-label="Double confirmation">
            <h2 className="c5-confirm-title">Double confirmation</h2>
            <ol className="c5-confirm-steps">
              <li className="c5-confirm-step">
                <span className="c5-confirm-badge" aria-hidden>
                  1
                </span>
                <span className="c5-confirm-label">Validation OTP par SMS</span>
              </li>
            </ol>
          </section>

          <div className="c5-confirm-actions">
            {error && <p className="c5-error">{error}</p>}
            <button
              type="button"
              className="c5-confirm-cta"
              onClick={handleConfirmWithdraw}
              disabled={methodsDisabled}
            >
              Confirme le retrait
            </button>
            <p className="c5-confirm-note">
              Les frais de transaction, nous gérons ça pour toi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
