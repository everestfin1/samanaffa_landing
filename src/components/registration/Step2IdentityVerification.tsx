'use client';

import { IdentificationIcon } from '@heroicons/react/24/outline';
import { countries } from '@/components/data/countries';

interface FormData {
  nationality: string;
  idType: 'cni' | 'passport';
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
  dateOfBirth: string;
  placeOfBirth: string;
}

interface Step2IdentityVerificationProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step2IdentityVerification({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}: Step2IdentityVerificationProps) {
  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  // Calculate max date for birth date (18 years ago)
  const getMaxBirthDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <IdentificationIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-night">Vérification d'identité</h3>
        </div>
        <p className="text-sm text-night/70">Étape 2 sur 5 - Informations de votre document d'identité</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Nationalité *</label>
        <select
          name="nationality"
          value={formData.nationality}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
          required
        >
          {countries
            .map(country => ({ name: country.name, code: country.code }))
            .sort((a, b) => {
              if (a.name === 'Senegal') return -1;
              if (b.name === 'Senegal') return 1;
              return a.name.localeCompare(b.name);
            })
            .map(country => (
              <option key={country.code} value={country.name}>
                {country.name === 'Senegal' ? `🇸🇳 ${country.name}` : country.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Type de pièce *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'cni', label: 'Carte Nationale d\'Identité' },
            { value: 'passport', label: 'Passeport' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
              <input 
                type="radio" 
                name="idType" 
                value={option.value} 
                checked={formData.idType === option.value} 
                onChange={onInputChange} 
                className="sr-only" 
              />
              <span className={`text-sm ${formData.idType === option.value ? 'text-gold-metallic font-medium' : 'text-night/70'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Numéro de la pièce *</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('idNumber') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="Ex: 1234567890123"
          required
        />
        {getFieldError('idNumber') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('idNumber')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Date d'émission *</label>
          <input
            type="date"
            name="idIssueDate"
            value={formData.idIssueDate}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('idIssueDate') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            required
          />
          {getFieldError('idIssueDate') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('idIssueDate')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Date d'expiration *</label>
          <input
            type="date"
            name="idExpiryDate"
            value={formData.idExpiryDate}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('idExpiryDate') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            required
          />
          {getFieldError('idExpiryDate') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('idExpiryDate')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Date de naissance *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('dateOfBirth') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          required
          max={getMaxBirthDate()}
        />
        <p className="text-xs text-night/60 mt-1">Vous devez avoir au moins 18 ans</p>
        {getFieldError('dateOfBirth') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('dateOfBirth')}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Lieu de naissance *</label>
        <input
          type="text"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('placeOfBirth') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Dakar, Thiès, Saint-Louis..."
          required
        />
        {getFieldError('placeOfBirth') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('placeOfBirth')}</p>
        )}
      </div>
    </div>
  );
}
