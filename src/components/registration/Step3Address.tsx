'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface FormData {
  country: string;
  region: string;
  district: string;
  address: string;
  city: string;
}

interface Step3AddressProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function Step3Address({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur
}: Step3AddressProps) {
  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <DocumentTextIcon className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-night">Adresse complète</h3>
        </div>
        <p className="text-sm text-night/70">Étape 3 sur 5 - Votre adresse complète</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Pays de résidence *</label>
        <select 
          name="country" 
          value={formData.country} 
          onChange={onInputChange} 
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200" 
          required
        >
          <option value="Sénégal">Sénégal</option>
          <option value="Mali">Mali</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          <option value="Niger">Niger</option>
          <option value="Guinée">Guinée</option>
          <option value="Bénin">Bénin</option>
          <option value="Togo">Togo</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Région *</label>
        <select 
          name="region" 
          value={formData.region} 
          onChange={onInputChange} 
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200" 
          required
        >
          <option value="">Sélectionnez votre région</option>
          <option value="Dakar">Dakar</option>
          <option value="Thiès">Thiès</option>
          <option value="Saint-Louis">Saint-Louis</option>
          <option value="Kaolack">Kaolack</option>
          <option value="Ziguinchor">Ziguinchor</option>
          <option value="Diourbel">Diourbel</option>
          <option value="Tambacounda">Tambacounda</option>
          <option value="Louga">Louga</option>
          <option value="Kolda">Kolda</option>
          <option value="Kédougou">Kédougou</option>
          <option value="Sédhiou">Sédhiou</option>
          <option value="Matam">Matam</option>
          <option value="Kaffrine">Kaffrine</option>
          <option value="Fatick">Fatick</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">District / Commune *</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('district') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Grand-Dakar, Sicap Liberté, Plateau..."
          required
        />
        {getFieldError('district') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('district')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Ville *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
            placeholder="Dakar"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Adresse complète *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={onInputChange}
          onBlur={onBlur}
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 resize-none ${
            hasFieldError('address') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Villa 6550 Sicap Liberté 6, Rue de la République..."
          required
        />
        {getFieldError('address') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('address')}</p>
        )}
      </div>
    </div>
  );
}
