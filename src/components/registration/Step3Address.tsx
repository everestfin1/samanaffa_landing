'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { countries } from '@/components/data/countries';
import regionsSenegal from '../../../regions_senegal.json';

// All Senegal regions (14 total)
const senegalRegions = [
  'Dakar',
  'Diourbel',
  'Fatick',
  'Kaffrine',
  'Kédougou',
  'Kaolack',
  'Kolda',
  'Louga',
  'Matam',
  'Saint-Louis',
  'Sédhiou',
  'Tambacounda',
  'Thiès',
  'Ziguinchor'
];

// Function to get region data by region name
const getRegionData = (regionName: string) => {
  return regionsSenegal.find(region => region.region.toLowerCase() === regionName.toLowerCase());
};

// Function to get departments based on region
const getDepartmentsForRegion = (regionName: string): string[] => {
  const regionData = getRegionData(regionName);
  return regionData ? regionData.departements : [];
};

// Function to get communes based on region
const getCommunesForRegion = (regionName: string): string[] => {
  const regionData = getRegionData(regionName);
  return regionData ? regionData.communes : [];
};

interface FormData {
  country: string;
  region: string;
  department: string;
  district: string;
  address: string;
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
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Pays de résidence *</label>
        <div className="relative">
          <select 
            name="country" 
            value={formData.country} 
            onChange={onInputChange} 
            className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none" 
            required
          >
            <option value="">Sélectionner un pays</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Région *</label>
        {formData.country === 'Senegal' ? (
          <div className="relative">
            <select
              name="region"
              value={formData.region}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                hasFieldError('region') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              required
            >
              <option value="">Sélectionner une région</option>
              {senegalRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('region') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            placeholder="Ex: Dakar, Thiès, Paris, New York..."
            required
          />
        )}
        {getFieldError('region') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('region')}</p>
        )}
      </div>

      {formData.country === 'Senegal' && formData.region && (
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Département *</label>
          {getDepartmentsForRegion(formData.region).length > 0 ? (
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={onInputChange}
                onBlur={onBlur}
                className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                  hasFieldError('department') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
                }`}
                required
              >
                <option value="">Sélectionner un département</option>
                {getDepartmentsForRegion(formData.region).map((department: string) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ) : (
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                hasFieldError('department') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              placeholder="Saisir le département"
              required
            />
          )}
          {getFieldError('department') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('department')}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Commune *</label>
        {formData.country === 'Senegal' && getCommunesForRegion(formData.region).length > 0 ? (
          <div className="relative">
            <select
              name="district"
              value={formData.district}
              onChange={onInputChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                hasFieldError('district') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              required
            >
              <option value="">Sélectionner une commune</option>
              {getCommunesForRegion(formData.region).map((commune: string) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        ) : (
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('district') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
            }`}
            placeholder="Saisir la commune"
            required
          />
        )}
        {getFieldError('district') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('district')}</p>
        )}
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
