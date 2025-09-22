'use client';

import { UserIcon } from '@heroicons/react/24/outline';
import { normalizeSenegalPhone, formatPhoneForDisplay, isValidSenegalPhone } from '@/lib/utils';

interface FormData {
  civilite: 'mr' | 'mme' | 'mlle';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profession: string;
  domaineActivite: string;
}

interface Step1PersonalInfoProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPhoneChange: (value: string) => void;
}

export default function Step1PersonalInfo({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  onPhoneChange
}: Step1PersonalInfoProps) {
  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  // Format phone number for display while keeping normalized value internally
  const handlePhoneChange = (inputValue: string) => {
    // Normalize the phone number for storage
    const normalized = normalizeSenegalPhone(inputValue)
    if (normalized) {
      // Pass the normalized value to the parent component
      onPhoneChange(normalized)
    } else {
      // If normalization fails, pass the original value
      onPhoneChange(inputValue)
    }
  }

  // Get display value for the input field
  const getDisplayValue = (phoneValue: string) => {
    if (!phoneValue) return ''
    // If it's already normalized, format it for display
    if (phoneValue.startsWith('+221')) {
      return formatPhoneForDisplay(phoneValue)
    }
    // Otherwise return as-is (user is still typing)
    return phoneValue
  }

  return (
    <div className="space-y-6">
      <div className="bg-gold-metallic/10 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserIcon className="w-5 h-5 text-gold-metallic" />
          <h3 className="font-semibold text-night">Informations personnelles</h3>
        </div>
        <p className="text-sm text-night/70">Étape 1 sur 5 - Renseignez vos informations de base</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Civilité *</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'mr', label: 'Mr' },
            { value: 'mme', label: 'Mme' },
            { value: 'mlle', label: 'Mlle' }
          ].map((option) => (
            <label key={option.value} className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
              <input
                type="radio"
                name="civilite"
                value={option.value}
                checked={formData.civilite === option.value}
                onChange={onInputChange}
                className="sr-only"
              />
              <span className={`font-medium ${formData.civilite === option.value ? 'text-gold-metallic' : 'text-night/70'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Prénom *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('firstName') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            placeholder="Amadou"
            required
          />
          {getFieldError('firstName') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('firstName')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Nom *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('lastName') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            placeholder="Diallo"
            required
          />
          {getFieldError('lastName') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('lastName')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Numéro de téléphone *</label>
        <input
          type="tel"
          name="phone"
          value={getDisplayValue(formData.phone)}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('phone') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="77 123 45 67"
          required
        />
        <p className="text-xs text-night/60 mt-1">Format: 77 XXX XX XX ou +221 XX XXX XX XX</p>
        {getFieldError('phone') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('phone')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Adresse email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('email') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="amadou.diallo@email.com"
          required
        />
        {getFieldError('email') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Profession *</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('profession') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            required
          >
            <option value="">Sélectionnez votre profession</option>
            <option value="Agriculteurs exploitants">Agriculteurs exploitants</option>
            <option value="Artisans, commerçants, chefs d'entreprise">Artisans, commerçants, chefs d'entreprise</option>
            <option value="Cadres et professions intellectuelles supérieures">Cadres et professions intellectuelles supérieures</option>
            <option value="Professions intermédiaires">Professions intermédiaires</option>
            <option value="Employés">Employés</option>
            <option value="Ouvriers">Ouvriers</option>
            <option value="Retraités">Retraités</option>
            <option value="Autres personnes sans activité professionnelle">Autres personnes sans activité professionnelle</option>
            <option value="Salarié">Salarié</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Profession libérale">Profession libérale</option>
            <option value="Travailleur autonome">Travailleur autonome</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Stagiaire non rémunéré">Stagiaire non rémunéré</option>
          </select>
          {getFieldError('profession') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('profession')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Domaine d'activité *</label>
          <input
            type="text"
            name="domaineActivite"
            value={formData.domaineActivite}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('domaineActivite') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            placeholder="Ex: Informatique, Commerce..."
            required
          />
          {getFieldError('domaineActivite') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('domaineActivite')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
