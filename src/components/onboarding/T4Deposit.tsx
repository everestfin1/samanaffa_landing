'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

interface T4DepositProps {
  firstName: string;
  initialAmount?: number;
  initialWallet?: string | null;
  onSuccess: (amount: number, wallet: string) => void;
  onBack?: () => void;
}

const MIN_AMOUNT = 1_000;
const AMOUNT_STEP = 1_000;

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

export default function T4Deposit({
  firstName,
  initialAmount,
  onSuccess,
  onBack,
}: T4DepositProps) {
  const [amountDraft, setAmountDraft] = useState(
    initialAmount ? formatAmountInput(initialAmount) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amount = useMemo(() => parseAmountInput(amountDraft), [amountDraft]);

  const amountError = useMemo(() => {
    if (!amountDraft.trim()) return null;
    if (amount < MIN_AMOUNT) return `Montant minimum : ${formatAmountInput(MIN_AMOUNT)} FCFA`;
    if (amount % AMOUNT_STEP !== 0) return 'Le montant doit être un multiple de 1 000 FCFA';
    return null;
  }, [amount, amountDraft]);

  const canSubmit = amount >= MIN_AMOUNT && amount % AMOUNT_STEP === 0 && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
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
      onSuccess(amount, 'intouch');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const greetingName = firstName.trim() || 'toi';

  return (
    <div className="e1-shell e4-shell">
      <div className="e1-art e4-art" aria-hidden>
        <Image
          src="/figma/e4/premier-versement-art.png"
          alt=""
          width={406}
          height={358}
          className="e1-art-img e4-art-img"
          priority
          unoptimized
        />
      </div>

      <div className="e1-layout e4-layout">
        <div className="e1-form-col e4-form-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back e4-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title e4-title">
            {greetingName}, fais le premier pas&nbsp;!
          </h1>

          <div className="e1-card e4-card">
            <label className="e1-field e4-field">
              <span className="e1-label">Montant</span>
              <input
                type="text"
                inputMode="numeric"
                value={amountDraft}
                onChange={(e) => {
                  const next = parseAmountInput(e.target.value);
                  setAmountDraft(next ? formatAmountInput(next) : '');
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit) void handleSubmit();
                }}
                placeholder="Entrer un montant"
                className="e1-input e4-input"
                autoComplete="off"
                autoFocus
              />
            </label>
            <p className="e4-hint">Multiple de 1 000 FCFA</p>

            {(amountError || error) && (
              <p className="e1-error">{amountError || error}</p>
            )}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
              className="e1-cta e4-cta"
            >
              {loading ? 'Programmation…' : 'Je continue'}
            </button>
          </div>

          <div className="e4-pending" role="status">
            Versement en attente de réception de la pièce et photo d&apos;identité.
          </div>
        </div>
      </div>
    </div>
  );
}
