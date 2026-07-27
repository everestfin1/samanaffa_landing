'use client';

import Image from 'next/image';
import { useState } from 'react';

interface T2bContactConsentsProps {
  firstName: string;
  initialEmail?: string;
  onSuccess: (data: {
    email: string;
    privacyAccepted: boolean;
    marketingAccepted: boolean;
  }) => void | Promise<void>;
  onBack?: () => void;
}

export default function T2bContactConsents({
  firstName,
  initialEmail,
  onSuccess,
  onBack,
}: T2bContactConsentsProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const isPlaceholderEmail = (e: string) => e.includes('@onboarding.samanaffa.tmp');
  const canSubmit =
    email.trim() && isValidEmail(email) && !isPlaceholderEmail(email) && privacyAccepted;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          privacyAccepted: true,
          marketingAccepted,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      await onSuccess({
        email: email.trim(),
        privacyAccepted: true,
        marketingAccepted,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    const e = email.trim();
    if (!e || !isValidEmail(e) || isPlaceholderEmail(e)) return;
    try {
      const res = await fetch('/api/auth/check-availability', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e }),
      });
      if (res.status === 401 || res.status === 429) return;
      const data = await res.json();
      if (res.ok && data.emailAvailable === false) {
        setEmailHint('Cet email est déjà associé à un compte existant.');
      }
    } catch {
      // non-fatal
    }
  };

  const greetingName = firstName.trim() || 'toi';

  return (
    <div className="e1-shell">
      <div className="e1-art" aria-hidden>
        <Image
          src="/figma/e1/kondanne-chests.png"
          alt=""
          width={1102}
          height={830}
          className="e1-art-img"
          priority
        />
      </div>

      <div className="e1-layout">
        <div className="e1-form-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title">{greetingName}, restons en contact</h1>

          <div className="e1-card">
            <p className="e1-hint">
              Indiquez votre email pour recevoir vos relevés et alertes.
            </p>

            <div className="e1-field">
              <label className="e1-label">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailHint(null);
                }}
                onBlur={handleEmailBlur}
                placeholder="votre@email.com"
                className="e1-input"
                autoComplete="email"
                autoFocus
              />
              {emailHint && <p className="e1-hint text-amber-700">{emailHint}</p>}
            </div>

            <div className="e1-field">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-gold-metallic border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">
                  J&apos;accepte la{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-metallic hover:underline"
                  >
                    politique de confidentialité
                  </a>{' '}
                  <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            <div className="e1-field">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-gold-metallic border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">
                  J&apos;accepte de recevoir des communications marketing (optionnel)
                </span>
              </label>
            </div>

            {error && <p className="e1-error">{error}</p>}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading || !canSubmit}
              className="e1-cta"
            >
              {loading ? 'Enregistrement…' : 'Je continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
