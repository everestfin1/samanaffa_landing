'use client';

import { useState } from 'react';
import SignaturePad from '@/components/portal/SignaturePad';

interface E8MandateProps {
  firstName: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export default function E8Mandate({ firstName, onSuccess, onBack }: E8MandateProps) {
  const [signature, setSignature] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const greetingName = firstName.trim() || 'toi';
  const canSubmit = Boolean(signature) && accepted && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/mandate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          mandateAccepted: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || 'Impossible d’enregistrer le mandat');
      }
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="e1-shell e8-shell">
      <div className="e1-layout e8-layout">
        <div className="e8-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back e8-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title e8-title">
            {greetingName}, voici notre engagement
          </h1>

          <div className="e8-card">
            <SignaturePad
              variant="mandate"
              value={signature}
              onChange={(next) => {
                setSignature(next);
                setError(null);
              }}
            />

            <label className="e8-check">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => {
                  setAccepted(e.target.checked);
                  setError(null);
                }}
                className="e8-check-input"
              />
              <span className="e8-check-label">
                J&apos;accepte les termes de la convention de gestion sous mandat (CGSM).
              </span>
            </label>
          </div>

          {error && <p className="e1-error e8-error">{error}</p>}

          <button
            type="button"
            className="e1-cta e8-cta"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {loading ? 'Enregistrement…' : 'J’accepte et je signe'}
          </button>
        </div>
      </div>
    </div>
  );
}
