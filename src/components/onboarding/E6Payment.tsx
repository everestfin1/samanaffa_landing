'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import IntouchPayment from '@/components/payments/IntouchPayment';
import {
  ONBOARDING_PAYMENT_METHODS,
  type OnboardingPaymentMethodId,
  getPaymentRail,
} from '@/lib/payments/onboarding-payment-methods';

interface PendingIntent {
  id: string;
  accountId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
}

interface E6PaymentProps {
  firstName: string;
  initialAmount?: number | null;
  onSuccess: (amount: number, wallet: string) => void;
  onSkip: () => void;
  onBack?: () => void;
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

export default function E6Payment({
  firstName,
  initialAmount,
  onSuccess,
  onSkip,
  onBack,
}: E6PaymentProps) {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const [amountDraft, setAmountDraft] = useState(
    initialAmount ? formatAmountInput(initialAmount) : '',
  );
  const [intent, setIntent] = useState<PendingIntent | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<OnboardingPaymentMethodId | null>(null);
  const [showIntouch, setShowIntouch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = useMemo(() => parseAmountInput(amountDraft), [amountDraft]);
  const greetingName = firstName.trim() || 'toi';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/onboarding/pending-deposit', { cache: 'no-store' });
        const data = (await res.json().catch(() => ({}))) as {
          intent?: PendingIntent | null;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || 'Impossible de charger le versement');
        if (cancelled) return;
        if (data.intent) {
          setIntent(data.intent);
          if (!initialAmount) {
            setAmountDraft(formatAmountInput(data.intent.amount));
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Erreur de chargement');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialAmount]);

  const persistSelection = async (
    methodId: OnboardingPaymentMethodId,
    nextAmount: number,
  ): Promise<PendingIntent> => {
    const res = await fetch('/api/onboarding/pending-deposit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: nextAmount, paymentMethod: methodId }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      intent?: PendingIntent;
      error?: string;
    };
    if (!res.ok || !data.intent) {
      throw new Error(data.error || 'Impossible de préparer le paiement');
    }
    setIntent(data.intent);
    return data.intent;
  };

  const handleSelectMethod = async (methodId: OnboardingPaymentMethodId) => {
    if (paying) return;
    setError(null);
    setSelectedMethod(methodId);

    if (amount < MIN_AMOUNT) {
      setError(`Montant minimum : ${formatAmountInput(MIN_AMOUNT)} FCFA`);
      return;
    }
    if (!userId) {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
      return;
    }

    setPaying(true);
    try {
      await persistSelection(methodId, amount);
      // Wave direct API is stubbed (WAVE_DIRECT_PAYMENTS_ENABLED=false) — Intouch for all.
      if (getPaymentRail(methodId) === 'wave') {
        const waveRes = await fetch('/api/onboarding/pay/wave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        const waveData = (await waveRes.json().catch(() => ({}))) as {
          checkoutUrl?: string;
          error?: string;
        };
        if (!waveRes.ok || !waveData.checkoutUrl) {
          throw new Error(waveData.error || 'Impossible de démarrer Wave');
        }
        window.location.href = waveData.checkoutUrl;
        return;
      }
      setShowIntouch(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
      setShowIntouch(false);
    } finally {
      setPaying(false);
    }
  };

  if (showIntouch && userId && intent) {
    return (
      <div className="e1-shell e6-shell">
        <div className="e1-layout e6-layout">
          <div className="e6-col">
            <h1 className="e1-title e6-title">Paiement sécurisé</h1>
            <div className="e6-intouch">
              <IntouchPayment
                amount={amount >= MIN_AMOUNT ? amount : intent.amount}
                userId={userId}
                accountId={intent.accountId}
                accountType="sama_naffa"
                intentType="deposit"
                referenceNumber={intent.referenceNumber}
                onSuccess={() => {
                  onSuccess(amount >= MIN_AMOUNT ? amount : intent.amount, selectedMethod ?? 'intouch');
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
    <div className="e1-shell e6-shell">
      <div className="e1-layout e6-layout">
        <div className="e6-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back e6-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title e6-title">
            {greetingName}, ton Naffa est ouvert
          </h1>

          <div className="e1-card e6-card">
            <label className="e1-field e6-field">
              <span className="e1-label">Montant (FCFA)</span>
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
                className="e1-input e6-input"
                autoComplete="off"
                disabled={loading || paying}
              />
            </label>
            <p className="e6-hint">Minimum 1 000 FCFA</p>
          </div>

          <p className="e6-methods-title">Choisis ton moyen de paiement</p>

          <div className="e6-methods" role="list">
            {ONBOARDING_PAYMENT_METHODS.map((method) => {
              const selected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  role="listitem"
                  className={`e6-method${selected ? ' is-selected' : ''}`}
                  onClick={() => void handleSelectMethod(method.id)}
                  disabled={loading || paying}
                  aria-label={`Payer avec ${method.label}`}
                  title={method.label}
                >
                  <Image
                    src={method.iconSrc}
                    alt=""
                    width={62}
                    height={62}
                    className="e6-method-icon"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>

          {(error || (!loading && !intent)) && (
            <p className="e1-error e6-error">
              {error ||
                'Aucun versement programmé. Revenez à l’étape précédente ou continuez plus tard.'}
            </p>
          )}

          {paying && <p className="e6-status">Préparation du paiement…</p>}

          <button type="button" className="e6-skip" onClick={onSkip} disabled={paying}>
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
