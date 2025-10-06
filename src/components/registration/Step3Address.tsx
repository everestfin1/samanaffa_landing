'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { countries } from '@/components/data/countries';
import regionsSenegal from '../../../regions_senegal.json';

// All Senegal regions (14 total) - with display names and JSON keys
const senegalRegions = [
  { display: 'Dakar', value: 'DAKAR' },
  { display: 'Diourbel', value: 'DIOURBEL' },
  { display: 'Fatick', value: 'FATICK' },
  { display: 'Kaffrine', value: 'KAFFRINE' },
  { display: 'Kédougou', value: 'KEDOUGOU' },
  { display: 'Kaolack', value: 'KAOLACK' },
  { display: 'Kolda', value: 'KOLDA' },
  { display: 'Louga', value: 'LOUGA' },
  { display: 'Matam', value: 'MATAM' },
  { display: 'Saint-Louis', value: 'SAINT-LOUIS' },
  { display: 'Sédhiou', value: 'SEDHIOU' },
  { display: 'Tambacounda', value: 'TAMBACOUNDA' },
  { display: 'Thiès', value: 'THIES' },
  { display: 'Ziguinchor', value: 'ZIGUINCHOR' }
];

// Function to get region data by region name
const getRegionData = (regionName: string) => {
  return regionsSenegal.find(region => region.name.toLowerCase() === regionName.toLowerCase());
};

// Function to get departments based on region
const getDepartmentsForRegion = (regionName: string): string[] => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  return regionData.departements.map(dept => dept.name);
};

// Function to get arrondissements for a specific department
const getArrondissementsForDepartment = (regionName: string, departmentName: string): string[] => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.arrondissements) return [];
  
  return department.arrondissements.map(arr => arr.name);
};

// Function to get direct communes for a specific department
const getDirectCommunesForDepartment = (regionName: string, departmentName: string): string[] => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.communes) return [];
  
  return department.communes.map(commune => commune.name);
};

// Function to get communes for a specific arrondissement
const getCommunesForArrondissement = (regionName: string, departmentName: string, arrondissementName: string): string[] => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.arrondissements) return [];
  
  const arrondissement = department.arrondissements.find(arr => arr.name.toLowerCase() === arrondissementName.toLowerCase());
  if (!arrondissement || !arrondissement.communes) return [];
  
  return arrondissement.communes.map(commune => commune.name);
};

// Function to check if department has direct communes
const departmentHasDirectCommunes = (regionName: string, departmentName: string): boolean => {
  return getDirectCommunesForDepartment(regionName, departmentName).length > 0;
};

// Function to check if department has arrondissements
const departmentHasArrondissements = (regionName: string, departmentName: string): boolean => {
  return getArrondissementsForDepartment(regionName, departmentName).length > 0;
};

interface FormData {
  country: string;
  region: string;
  department: string;
  arrondissement: string;
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

  // Handle changes and clear dependent fields
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Create a new event object for clearing dependent fields
    const createClearEvent = (fieldName: string) => ({
      target: { name: fieldName, value: '' }
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>);

    // Clear dependent fields when parent fields change
    if (name === 'country') {
      onInputChange(e);
      if (value !== 'Senegal') {
        onInputChange(createClearEvent('region'));
        onInputChange(createClearEvent('department'));
        onInputChange(createClearEvent('arrondissement'));
        onInputChange(createClearEvent('district'));
      }
    } else if (name === 'region') {
      onInputChange(e);
      onInputChange(createClearEvent('department'));
      onInputChange(createClearEvent('arrondissement'));
      onInputChange(createClearEvent('district'));
    } else if (name === 'department') {
      onInputChange(e);
      onInputChange(createClearEvent('arrondissement'));
      onInputChange(createClearEvent('district'));
    } else if (name === 'arrondissement') {
      onInputChange(e);
      onInputChange(createClearEvent('district'));
    } else {
      onInputChange(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Pays de résidence *</label>
        <div className="relative">
          <select 
            name="country" 
            value={formData.country} 
            onChange={handleFieldChange} 
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
              onChange={handleFieldChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                hasFieldError('region') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              required
            >
              <option value="">Sélectionner une région</option>
              {senegalRegions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.display}
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
            onChange={handleFieldChange}
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
                onChange={handleFieldChange}
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
              onChange={handleFieldChange}
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

      {formData.country === 'Senegal' && formData.region && formData.department && departmentHasArrondissements(formData.region, formData.department) && (
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Arrondissement *</label>
          <div className="relative">
            <select
              name="arrondissement"
              value={formData.arrondissement}
              onChange={handleFieldChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                hasFieldError('arrondissement') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              required
            >
              <option value="">Sélectionner un arrondissement</option>
              {getArrondissementsForDepartment(formData.region, formData.department).map((arrondissement: string) => (
                <option key={arrondissement} value={arrondissement}>
                  {arrondissement}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {getFieldError('arrondissement') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('arrondissement')}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-night mb-2">Commune *</label>
        {formData.country === 'Senegal' && formData.region && formData.department ? (
          (() => {
            let communes: string[] = [];
            
            // If department has direct communes, use them
            if (departmentHasDirectCommunes(formData.region, formData.department)) {
              communes = getDirectCommunesForDepartment(formData.region, formData.department);
            }
            // If arrondissement is selected, get communes from arrondissement
            else if (formData.arrondissement) {
              communes = getCommunesForArrondissement(formData.region, formData.department, formData.arrondissement);
            }
            
            return communes.length > 0 ? (
              <div className="relative">
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleFieldChange}
                  onBlur={onBlur}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 appearance-none ${
                    hasFieldError('district') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
                  }`}
                  required
                >
                  <option value="">Sélectionner une commune</option>
                  {communes.map((commune: string) => (
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
                onChange={handleFieldChange}
                onBlur={onBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                  hasFieldError('district') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
                }`}
                placeholder={
                  departmentHasArrondissements(formData.region, formData.department) && !formData.arrondissement
                    ? "Sélectionner d'abord un arrondissement"
                    : "Saisir la commune"
                }
                required
                disabled={departmentHasArrondissements(formData.region, formData.department) && !formData.arrondissement}
              />
            );
          })()
        ) : (
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleFieldChange}
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
          onChange={handleFieldChange}
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
