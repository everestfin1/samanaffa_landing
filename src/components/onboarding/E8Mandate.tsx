'use client';

import { useState } from 'react';
import SignaturePad from '@/components/portal/SignaturePad';
import ScrollableTermsPanel from '@/components/legal/ScrollableTermsPanel';
import { CCU } from '@/lib/legal/ccu';
import { isValidSignatureDataUrl } from '@/lib/signature';

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
  const hasSignature = isValidSignatureDataUrl(signature);
  const canSubmit = hasSignature && accepted && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/mandate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signature,
          ccuAccepted: true,
          mandateAccepted: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        signatureSaved?: boolean;
      };
      if (!res.ok) {
        throw new Error(data.error || 'Impossible d’enregistrer le mandat');
      }
      if (!data.signatureSaved) {
        throw new Error('La signature n’a pas pu être enregistrée. Veuillez réessayer.');
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

          <div className="e8-terms-panel">
            <h2 className="e8-terms-title">{CCU.title}</h2>
            <ScrollableTermsPanel
              document={CCU}
              accepted={accepted}
              onAcceptedChange={(next) => {
                setAccepted(next);
                if (!next) setSignature('');
                setError(null);
              }}
              acceptanceLabel="J'accepte la Convention-Cadre Utilisateur (CCU) et je signe électroniquement le mandat de gestion (Livre III)."
            />
          </div>

          {accepted && (
            <>
              <div className="e8-card">
                <p className="e8-signature-label">Signature électronique</p>
                <SignaturePad
                  variant="mandate"
                  value={signature}
                  onChange={(next) => {
                    setSignature(next);
                    setError(null);
                  }}
                />
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
