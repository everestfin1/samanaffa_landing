'use client';

import { useEffect, useState } from 'react';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';
import SponsorCodeField from '@/components/onboarding/SponsorCodeField';
import { useSponsorCodeVerification } from '@/hooks/useSponsorCodeVerification';

interface T2FirstNameProps {
  initialValue?: string;
  initialReferralCode?: string | null;
  onSuccess: (firstName: string, referralCode: string | null) => void | Promise<void>;
  onBack?: () => void;
}

export default function T2FirstName({
  initialValue,
  initialReferralCode,
  onSuccess,
  onBack,
}: T2FirstNameProps) {
  const [firstName, setFirstName] = useState(initialValue ?? '');
  const [hasReferralCode, setHasReferralCode] = useState<boolean | null>(
    initialReferralCode ? true : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sponsor = useSponsorCodeVerification(initialReferralCode ?? '');

  useEffect(() => {
    if (initialReferralCode) {
      setHasReferralCode(true);
      sponsor.setCode(initialReferralCode);
      void sponsor.verify(initialReferralCode);
    }
    // Only prefill from URL / saved progress on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!firstName.trim()) return;
    if (hasReferralCode === null) {
      setError('Indiquez si vous avez un code de parrainage.');
      return;
    }
    if (hasReferralCode && sponsor.code.trim() && !sponsor.canProceedWithCode) {
      setError('Corrigez ou supprimez le code de parrainage avant de continuer.');
      return;
    }
    if (hasReferralCode && sponsor.code.trim() && sponsor.status !== 'valid') {
      setError('Veuillez attendre la validation du code ou corriger le code saisi.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const referralPayload =
        hasReferralCode && sponsor.code.trim() ? sponsor.code.trim() : null;

      const res = await fetch('/api/onboarding/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          referralCode: referralPayload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      await onSuccess(firstName.trim(), data.user?.referralCode ?? referralPayload);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    firstName.trim() &&
    hasReferralCode !== null &&
    (hasReferralCode === false ||
      !sponsor.code.trim() ||
      (sponsor.status === 'valid' && sponsor.canProceedWithCode));

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}
      <OnboardingStepHeader
        title="Comment devons-nous vous appeler ?"
        description="Votre prénom suffit pour commencer."
        className="mb-10"
      />

      <div className="space-y-4">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
          placeholder="Votre prénom"
          className="w-full px-6 py-5 text-2xl text-center border-2 border-timberwolf/40 rounded-2xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
          autoFocus
          maxLength={50}
        />
        <div className="flex justify-between px-2">
          <span className="text-xs text-night/40">
            {firstName.trim() ? 'Prénom valide' : 'Champ requis'}
          </span>
          <span className="text-xs text-night/40">{firstName.length}/50</span>
        </div>

        <SponsorCodeField
          hasCode={hasReferralCode}
          onHasCodeChange={(value) => {
            setHasReferralCode(value);
            if (!value) sponsor.reset();
          }}
          code={sponsor.code}
          onCodeChange={sponsor.handleChange}
          status={sponsor.status}
          message={sponsor.message}
          disabled={loading}
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !canSubmit}
          className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
        >
          <span className="relative z-10">{loading ? 'Enregistrement...' : 'Continuer'}</span>
          {!loading && (
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
