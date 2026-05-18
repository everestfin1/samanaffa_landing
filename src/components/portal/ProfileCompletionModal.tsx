'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  BriefcaseIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dismissible?: boolean;
  initialData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dateOfBirth?: string;
    address?: string;
    city?: string;
    country?: string;
    statutEmploi?: string;
    termsAccepted?: boolean;
    privacyAccepted?: boolean;
    marketingAccepted?: boolean;
  };
}

function sanitizeEmail(email?: string): string {
  if (!email || email.includes('@onboarding.samanaffa.tmp')) return '';
  return email;
}

function sanitizeLastName(lastName?: string): string {
  // Clear placeholder values that signal incomplete profiles
  if (!lastName || lastName === 'Membre' || lastName === 'membre' || lastName === 'Member') return '';
  return lastName;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  dismissible = true,
  initialData = {},
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

  const validateAge = (dob: string): string | null => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return 'Date invalide.';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (birth > today) return 'Date de naissance invalide.';
    if (age < 18) return `Vous devez avoir au moins 18 ans (âge actuel : ${age} ans).`;
    return null;
  };

  const buildFormData = () => ({
    firstName: initialData.firstName || '',
    lastName: sanitizeLastName(initialData.lastName),
    email: sanitizeEmail(initialData.email),
    dateOfBirth: initialData.dateOfBirth || '',
    address: initialData.address || '',
    city: initialData.city || '',
    country: initialData.country || 'Sénégal',
    statutEmploi: initialData.statutEmploi || '',
    termsAccepted: initialData.termsAccepted || false,
    privacyAccepted: initialData.privacyAccepted || false,
    marketingAccepted: initialData.marketingAccepted || false,
  });

  const [formData, setFormData] = useState(buildFormData);

  // Re-sync form state when the modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(buildFormData());
      setError(null);
      setDobError(null);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.dateOfBirth ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.country.trim() ||
      !formData.statutEmploi.trim()
    ) {
      setError('Veuillez remplir tous les champs requis.');
      setLoading(false);
      return;
    }

    const ageErr = validateAge(formData.dateOfBirth);
    if (ageErr) {
      setDobError(ageErr);
      setLoading(false);
      return;
    }

    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité.');
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
        throw new Error(data.error || 'Erreur lors de la mise à jour du profil');
      }

      // Success - close modal and refresh
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
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-timberwolf/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-night">Complétez votre profil</h2>
            <p className="text-sm text-night/60 mt-1">
              Quelques informations supplémentaires pour finaliser votre inscription
            </p>
          </div>
          {dismissible && (
            <button
              onClick={onClose}
              className="text-night/50 hover:text-night transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gold-metallic" />
              Informations personnelles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
                {!formData.lastName && (
                  <p className="text-xs text-amber-600 mt-1">
                    Veuillez saisir votre nom de famille réel.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gold-metallic" />
              Coordonnées
            </h3>
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
              {!formData.email && (
                <p className="text-xs text-amber-600 mt-1">
                  Veuillez saisir votre adresse email réelle.
                </p>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gold-metallic" />
              Date de naissance
            </h3>
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, dateOfBirth: val });
                  setDobError(validateAge(val));
                }}
                onBlur={(e) => setDobError(validateAge(e.target.value))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-colors ${
                  dobError ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
                }`}
                required
              />
              {dobError && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <span>⚠</span> {dobError}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-gold-metallic" />
              Adresse
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-night mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Rue, numéro..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Pays *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Profession */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-night flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-gold-metallic" />
              Profession
            </h3>
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Statut professionnel *
              </label>
              <select
                value={formData.statutEmploi}
                onChange={(e) => setFormData({ ...formData, statutEmploi: e.target.value })}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="">Sélectionnez votre statut</option>
                <option value="Salarié">Salarié</option>
                <option value="Indépendant">Indépendant / Freelance</option>
                <option value="Entrepreneur">Entrepreneur</option>
                <option value="Étudiant">Étudiant</option>
                <option value="Retraité">Retraité</option>
                <option value="Sans emploi">Sans emploi</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          {/* Legal Consents */}
          <div className="space-y-4 pt-4 border-t border-timberwolf/20">
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                  required
                />
                <span className="text-sm text-night">
                  J'accepte les{' '}
                  <a href="/conditions" target="_blank" className="text-gold-metallic hover:underline">
                    conditions d'utilisation
                  </a>{' '}
                  de Sama Naffa *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                  required
                />
                <span className="text-sm text-night">
                  J'accepte la{' '}
                  <a href="/politique-confidentialite" target="_blank" className="text-gold-metallic hover:underline">
                    politique de confidentialité
                  </a>{' '}
                  *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingAccepted}
                  onChange={(e) => setFormData({ ...formData, marketingAccepted: e.target.checked })}
                  className="mt-1 w-5 h-5 text-gold border-timberwolf rounded focus:ring-gold"
                />
                <span className="text-sm text-night">
                  J'accepte de recevoir des communications marketing et des offres personnalisées (optionnel)
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
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
              disabled={loading || !!dobError}
              className="flex-1 px-6 py-3 bg-gold-metallic text-white rounded-lg font-medium hover:bg-gold-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
