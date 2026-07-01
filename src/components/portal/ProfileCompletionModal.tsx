'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCommunicationsCompletionProgress } from '@/lib/portal-profile-completion';
import {
  MANDATE_TERMS_SECTIONS,
  MANDATE_TERMS_TITLE,
} from '@/lib/mandate-terms-content';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { EnvelopeIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import SignaturePad from '@/components/portal/SignaturePad';

type ModalStep = 'email' | 'terms' | 'signature';

const STEPS: ModalStep[] = ['email', 'terms', 'signature'];

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dismissible?: boolean;
  initialData?: {
    email?: string;
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    marketingAccepted?: boolean;
  };
}

function sanitizeEmail(email?: string): string {
  if (!email || email.includes('@onboarding.samanaffa.tmp')) return '';
  return email;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  dismissible = true,
  initialData = {},
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();
  const [step, setStep] = useState<ModalStep>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [signature, setSignature] = useState('');

  const initialFormData = useMemo(
    () => ({
      email: sanitizeEmail(initialData.email),
      termsAccepted: initialData.termsAccepted || false,
      privacyAccepted: initialData.privacyAccepted || false,
      marketingAccepted: initialData.marketingAccepted || false,
    }),
    [initialData],
  );

  const [formData, setFormData] = useState(initialFormData);

  const stepIndex = STEPS.indexOf(step);
  const stepPercent = Math.round(((stepIndex + 1) / STEPS.length) * 100);

  const completionProgress = useMemo(
    () => getCommunicationsCompletionProgress(formData),
    [formData],
  );

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setSignature('');
      setStep('email');
      setError(null);
      setEmailHint(null);
    }
  }, [isOpen, initialFormData]);

  const goNext = () => {
    setError(null);
    if (step === 'email') {
      if (!formData.email.trim()) {
        setError('Veuillez indiquer votre adresse email.');
        return;
      }
      if (!isValidEmail(formData.email)) {
        setError("Format d'email invalide.");
        return;
      }
      setStep('terms');
      return;
    }
    if (step === 'terms') {
      if (!formData.termsAccepted) {
        setError('Veuillez accepter les termes et conditions.');
        return;
      }
      if (!formData.privacyAccepted) {
        setError('Veuillez accepter la politique de confidentialité.');
        return;
      }
      setStep('signature');
    }
  };

  const goBack = () => {
    setError(null);
    if (step === 'terms') setStep('email');
    else if (step === 'signature') setStep('terms');
  };

  const handleSubmit = async () => {
    setError(null);

    if (!signature) {
      setError('Veuillez signer dans la zone prévue.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/portal/profile/complete', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          termsAccepted: formData.termsAccepted,
          privacyAccepted: formData.privacyAccepted,
          marketingAccepted: formData.marketingAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      await queryClient.refetchQueries({ queryKey: ['userProfile'] });
      if (typeof updateSession === 'function') {
        await updateSession();
      }

      onClose();
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const stepTitles: Record<ModalStep, { title: string; subtitle?: string }> = {
    email: {
      title: 'Restons en contact',
      subtitle:
        'Votre identité est vérifiée via Didit. Indiquez votre email pour recevoir vos relevés et alertes.',
    },
    terms: {
      title: 'Termes & conditions',
      subtitle: MANDATE_TERMS_TITLE,
    },
    signature: {
      title: 'Termes & conditions',
      subtitle: 'Signez pour confirmer votre acceptation du mandat de gestion.',
    },
  };

  const { title, subtitle } = stepTitles[step];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="shrink-0 border-b border-timberwolf/20 px-6 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-night">{title}</h2>
            {subtitle && (
              <p
                className={`text-sm mt-1 leading-snug ${
                  step === 'terms' ? 'font-semibold text-gold-metallic' : 'text-night/60'
                }`}
              >
                {subtitle}
              </p>
            )}
            {!dismissible && (
              <div className="mt-3">
                <ProfileProgressBar
                  percent={step === 'email' ? completionProgress.percent : stepPercent}
                  label={
                    step === 'email'
                      ? `Étape complétée à ${completionProgress.percent}%`
                      : `Étape ${stepIndex + 1} sur ${STEPS.length}`
                  }
                />
              </div>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-night/50 hover:text-night transition-colors"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-4">
              <div className="p-4 bg-gold-light/15 border border-gold-metallic/20 rounded-xl text-sm text-night/80">
                <p>
                  Vos informations d&apos;identité (nom, date de naissance, document) proviennent
                  de votre vérification KYC et ne sont pas modifiables ici.
                </p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-night mb-2">
                  <EnvelopeIcon className="w-5 h-5 text-gold-metallic" />
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setEmailHint(null);
                  }}
                  onBlur={async () => {
                    const email = formData.email.trim();
                    if (!email || !isValidEmail(email)) return;
                    const currentEmail = sanitizeEmail(initialData.email);
                    if (
                      currentEmail &&
                      email.toLowerCase() === currentEmail.toLowerCase()
                    ) {
                      return;
                    }
                    try {
                      const res = await fetch('/api/auth/check-availability', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      });
                      if (res.status === 401 || res.status === 429) return;
                      const data = await res.json();
                      if (res.ok && data.emailAvailable === false) {
                        setEmailHint('Cet email est déjà associé à un compte existant.');
                      }
                    } catch {
                      // non-fatal
                    }
                  }}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="votre@email.com"
                  autoComplete="email"
                />
                {emailHint && (
                  <p className="text-sm text-amber-700 mt-2">{emailHint}</p>
                )}
                <p className="text-xs text-night/50 mt-2">
                  Reçus de transaction, alertes de sécurité et informations sur votre épargne.
                </p>
              </div>
            </div>
          )}

          {step === 'terms' && (
            <div className="space-y-4">
              <div className="bg-white border border-timberwolf/25 rounded-lg p-4 max-h-52 overflow-y-auto text-sm text-night/80 leading-relaxed">
                {MANDATE_TERMS_SECTIONS.map((section) => (
                  <div key={section.heading} className="mb-4 last:mb-0">
                    <p className="font-semibold text-night mb-1">{section.heading}</p>
                    <p>{section.body}</p>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, termsAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-5 h-5 accent-gold-metallic border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">J&apos;accepte les termes et conditions.</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, privacyAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-5 h-5 accent-gold-metallic border-timberwolf rounded focus:ring-gold"
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
                  *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, marketingAccepted: e.target.checked })
                  }
                  className="mt-0.5 w-5 h-5 accent-gold-metallic border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">
                  J&apos;accepte de recevoir des communications marketing (optionnel)
                </span>
              </label>
            </div>
          )}

          {step === 'signature' && (
            <SignaturePad value={signature} onChange={setSignature} />
          )}
        </div>

        <div className="shrink-0 border-t border-timberwolf/20 px-6 py-4 flex gap-3">
          {step !== 'email' && (
            <button
              type="button"
              onClick={goBack}
              disabled={loading}
              className="flex items-center justify-center gap-1 px-4 py-3 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Retour
            </button>
          )}
          {dismissible && step === 'email' && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
            >
              Plus tard
            </button>
          )}
          {step !== 'signature' ? (
            <button
              type="button"
              onClick={goNext}
              className="flex-1 px-6 py-3 bg-gold-metallic text-white rounded-lg font-semibold hover:bg-gold-dark transition-colors"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gold-metallic text-white rounded-lg font-semibold hover:bg-gold-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Valider'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileProgressBar({ percent, label }: { percent: number; label: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-night/70">{label}</p>
      <div className="w-full h-2 bg-timberwolf/30 rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-gold-metallic rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
