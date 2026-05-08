'use client';

import { IdentificationIcon } from '@heroicons/react/24/outline';
import { countries } from '@/components/data/countries';
import { isUEMOACountry } from '@/lib/utils';

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

  // Calculate min date for expiry date (should be after today)
  const getMinExpiryDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Check if current nationality is UEMOA
  const isUEMOA = isUEMOACountry(formData.nationality);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-night mb-2">Nationalité *</label>
        <select
          name="nationality"
          value={formData.nationality}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
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
        <label className="block text-sm font-medium text-night mb-2">Type de pièce *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'cni', label: 'Carte Nationale d\'Identité' },
            { value: 'passport', label: 'Passeport' }
          ].map((option) => (
            <label 
              key={option.value} 
              className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.idType === option.value
                  ? 'border-gold-metallic bg-gold-metallic/5 shadow-sm'
                  : 'border-timberwolf/30 hover:border-timberwolf/50 hover:bg-timberwolf/5'
              }`}
            >
              <input 
                type="radio" 
                name="idType" 
                value={option.value} 
                checked={formData.idType === option.value} 
                onChange={onInputChange} 
                className="sr-only" 
              />
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.idType === option.value
                      ? 'border-gold-metallic'
                      : 'border-timberwolf/40'
                  }`}
                >
                  {formData.idType === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-metallic" />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  formData.idType === option.value ? 'text-night' : 'text-night/70'
                }`}>
                  {option.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-night mb-2">Numéro de la pièce *</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={(e) => {
            // For UEMOA countries (especially Senegal), apply length restrictions
            if (isUEMOA && formData.nationality === 'Senegal') {
              const maxLength = formData.idType === 'cni' ? 13 : 9;
              if (e.target.value.length <= maxLength) {
                onInputChange(e);
              }
            } else {
              // For non-UEMOA countries, allow any length and characters
              onInputChange(e);
            }
          }}
          onBlur={onBlur}
          maxLength={isUEMOA && formData.nationality === 'Senegal' ? (formData.idType === 'cni' ? 13 : 9) : undefined}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
            hasFieldError('idNumber') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder={isUEMOA && formData.nationality === 'Senegal' 
            ? (formData.idType === 'cni' ? "13 caractères max" : "9 caractères max")
            : "Numéro de pièce d'identité"}
          required
        />
        <div className="flex justify-between items-center mt-1">
          {isUEMOA && formData.nationality === 'Senegal' ? (
            <>
              <span className="text-xs text-night/60">
                {formData.idType === 'cni' ? 'CNI (13 caractères)' : 'Passeport (9 caractères)'}
              </span>
              <span className={`text-xs ${formData.idNumber.length >= (formData.idType === 'cni' ? 13 : 9) ? 'text-green-600 font-medium' : 'text-red-500'}`}>
                {formData.idNumber.length}/{formData.idType === 'cni' ? 13 : 9}
              </span>
            </>
          ) : (
            <span className="text-xs text-night/60">
              Saisissez le numéro tel qu'il apparaît sur votre document
            </span>
          )}
        </div>
        {getFieldError('idNumber') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('idNumber')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-night mb-2">Date d'émission *</label>
          <input
            type="date"
            name="idIssueDate"
            value={formData.idIssueDate}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
              hasFieldError('idIssueDate') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            required
          />
          {getFieldError('idIssueDate') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('idIssueDate')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-night mb-2">Date d'expiration *</label>
          <input
            type="date"
            name="idExpiryDate"
            value={formData.idExpiryDate}
            onChange={onInputChange}
            onBlur={onBlur}
            min={getMinExpiryDate()}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
              hasFieldError('idExpiryDate') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            required
          />
          {isUEMOA && formData.nationality === 'Senegal' && formData.idIssueDate ? (
            <p className="text-xs text-night/60 mt-1">
              Suggestion: {formData.idType === 'cni' ? '10 ans' : '5 ans'} après la date d'émission. Vous pouvez modifier si nécessaire.
            </p>
          ) : (
            <p className="text-xs text-night/60 mt-1">
              La date d'expiration doit être postérieure à aujourd'hui
            </p>
          )}
          {getFieldError('idExpiryDate') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('idExpiryDate')}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-night mb-2">Date de naissance *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
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
        <label className="block text-sm font-medium text-night mb-2">Lieu de naissance *</label>
        <input
          type="text"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
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
