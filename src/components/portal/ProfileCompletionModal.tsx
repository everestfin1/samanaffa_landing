'use client';

import { useState, useEffect, useMemo } from 'react';
import { getCommunicationsCompletionProgress } from '@/lib/portal-profile-completion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  dismissible = true,
  initialData = {},
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const completionProgress = useMemo(
    () => getCommunicationsCompletionProgress(formData),
    [formData],
  );

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen, initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email.trim()) {
      setError('Veuillez indiquer votre adresse email.');
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setError(
        "Vous devez accepter les conditions d'utilisation et la politique de confidentialité.",
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/portal/profile/complete', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-timberwolf/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-night">Restons en contact</h2>
            <p className="text-sm text-night/60 mt-1">
              Votre identité est vérifiée via Didit. Indiquez votre email et vos préférences de
              communication.
            </p>
            {!dismissible && (
              <div className="mt-3">
                <ProfileProgressBar percent={completionProgress.percent} />
              </div>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              className="text-night/50 hover:text-night transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="p-4 bg-gold-light/15 border border-gold-metallic/20 rounded-xl text-sm text-night/80">
            <p>
              Vos informations d&apos;identité (nom, date de naissance, document) proviennent de
              votre vérification KYC et ne sont pas modifiables ici.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gold-metallic" />
              Email
            </h3>
            <div>
              <label className="block text-sm font-medium text-night mb-2">Adresse email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
              <p className="text-xs text-night/50 mt-2">
                Reçus de transaction, alertes de sécurité et informations sur votre épargne.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-timberwolf/20">
            <h3 className="text-sm font-semibold text-night">Préférences légales</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, termsAccepted: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                  required
                />
                <span className="text-sm text-night">
                  J&apos;accepte les{' '}
                  <a
                    href="/conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-metallic hover:underline"
                  >
                    conditions d&apos;utilisation
                  </a>{' '}
                  de Sama Naffa *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, privacyAccepted: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                  required
                />
                <span className="text-sm text-night">
                  J&apos;accepte la{' '}
                  <a
                    href="/politique-confidentialite"
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
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">
                  J&apos;accepte de recevoir des communications marketing et des offres
                  personnalisées (optionnel)
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
              >
                Plus tard
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gold-metallic text-white rounded-lg font-medium hover:bg-gold-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Valider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileProgressBar({ percent }: { percent: number }) {
  return (
    <div>
      <p className="text-xs font-medium text-night/70">Étape complétée à {percent}%</p>
      <div className="w-full h-2 bg-timberwolf/30 rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-gold-metallic rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
