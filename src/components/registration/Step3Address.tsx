'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { countries } from '@/components/data/countries';
import regionsSenegal from '../../../regions_senegal.json';
import { useState, useRef, useEffect } from 'react';

// Utility function to convert ALL CAPS text to Title Case
const toTitleCase = (text: string): string => {
  if (!text) return text;
  
  // Handle special cases and common abbreviations
  const specialCases: Record<string, string> = {
    'HLM': 'HLM',
    'N\'GOR': 'N\'Gor',
    'D\'OIE': 'd\'Oie',
    'D\'AIR': 'd\'Air',
    'L\'AMITIE': 'l\'Amitié',
    'SACRE-COEUR': 'Sacré-Cœur',
    'SAINT-LOUIS': 'Saint-Louis',
    'SEDHIOU': 'Sédhiou',
    'KEDOUGOU': 'Kédougou',
    'THIES': 'Thiès',
    'ZIGUINCHOR': 'Ziguinchor',
    'DIOURBEL': 'Diourbel',
    'FATICK': 'Fatick',
    'KAFFRINE': 'Kaffrine',
    'KAOLACK': 'Kaolack',
    'KOLDA': 'Kolda',
    'LOUGA': 'Louga',
    'MATAM': 'Matam',
    'TAMBACOUNDA': 'Tambacounda',
    'DAKAR': 'Dakar',
    'GUEDIAWAYE': 'Guédiawaye',
    'KEUR MASSAR': 'Keur Massar',
    'PIKINE': 'Pikine',
    'RUFISQUE': 'Rufisque',
    'BAMBEY': 'Bambey',
    'MBACKE': 'Mbacké',
    'FOUNDIOUGNE': 'Foundiougne',
    'GOSSAS': 'Gossas',
    'MBIRKILANE': 'Mbirklane',
    'KOUNGHEUL': 'Koungheul',
    'MALEM HODDAR': 'Malem Hodar',
    'NIORO': 'Nioro',
    'GUINGUINEO': 'Guinginéo',
    'SALEMATA': 'Salémata',
    'SARAYA': 'Saraya',
    'VELINGARA': 'Vélingara',
    'MEDINA YORO FOULAH': 'Médina Yoro Foulah',
    'KEBEMER': 'Kébémer',
    'LINGUERE': 'Linguère',
    'KANEL': 'Kanél',
    'RANEROU': 'Ranérou',
    'DAGANA': 'Dagana',
    'PODOR': 'Podor',
    'BOUNKILING': 'Bounkiling',
    'GOUDOMP': 'Goudomp',
    'BAKEL': 'Bakel',
    'GOUDIRY': 'Goudiry',
    'KOUMPENTOUM': 'Koumpentoum',
    'MBOUR': 'M\'Bour',
    'TIVAOUANE': 'Tivaouane',
    'BIGNONA': 'Bignona',
    'OUSSOUYE': 'Oussouye'
  };

  // Check for exact matches first
  if (specialCases[text]) {
    return specialCases[text];
  }

  // Handle common patterns
  return text
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Handle words with apostrophes
      if (word.includes('\'')) {
        return word.split('\'').map((part, index) => 
          index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part
        ).join('\'');
      }
      // Handle words with hyphens
      if (word.includes('-')) {
        return word.split('-').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('-');
      }
      // Handle words with slashes
      if (word.includes('/')) {
        return word.split('/').map(part => 
          part.charAt(0).toUpperCase() + part.slice(1)
        ).join('/');
      }
      // Regular words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

// All Senegal regions (14 total) - with display names and JSON keys, sorted alphabetically
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
].sort((a, b) => a.display.localeCompare(b.display, 'fr'));

// Function to get region data by region name
const getRegionData = (regionName: string) => {
  return regionsSenegal.find(region => region.name.toLowerCase() === regionName.toLowerCase());
};

// Function to get departments based on region
const getDepartmentsForRegion = (regionName: string): Array<{value: string, display: string}> => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  return regionData.departements
    .map(dept => ({
      value: dept.name,
      display: toTitleCase(dept.name)
    }))
    .sort((a, b) => a.display.localeCompare(b.display, 'fr'));
};

// Function to get arrondissements for a specific department
const getArrondissementsForDepartment = (regionName: string, departmentName: string): Array<{value: string, display: string}> => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.arrondissements) return [];
  
  return department.arrondissements
    .map(arr => ({
      value: arr.name,
      display: toTitleCase(arr.name)
    }))
    .sort((a, b) => a.display.localeCompare(b.display, 'fr'));
};

// Function to get direct communes for a specific department
const getDirectCommunesForDepartment = (regionName: string, departmentName: string): Array<{value: string, display: string}> => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.communes) return [];
  
  return department.communes
    .map(commune => ({
      value: commune.name,
      display: toTitleCase(commune.name)
    }))
    .sort((a, b) => a.display.localeCompare(b.display, 'fr'));
};

// Function to get communes for a specific arrondissement
const getCommunesForArrondissement = (regionName: string, departmentName: string, arrondissementName: string): Array<{value: string, display: string}> => {
  const regionData = getRegionData(regionName);
  if (!regionData) return [];
  
  const department = regionData.departements.find(dept => dept.name.toLowerCase() === departmentName.toLowerCase());
  if (!department || !department.arrondissements) return [];
  
  const arrondissement = department.arrondissements.find(arr => arr.name.toLowerCase() === arrondissementName.toLowerCase());
  if (!arrondissement || !arrondissement.communes) return [];
  
  return arrondissement.communes
    .map(commune => ({
      value: commune.name,
      display: toTitleCase(commune.name)
    }))
    .sort((a, b) => a.display.localeCompare(b.display, 'fr'));
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
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countryInputRef = useRef<HTMLInputElement>(null);

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Get selected country display value
  const selectedCountry = countries.find(c => c.name === formData.country);
  const countryDisplayValue = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle country selection
  const handleCountrySelect = (countryName: string) => {
    const event = {
      target: { name: 'country', value: countryName }
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    
    handleFieldChange(event);
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm('');
    
    // Trigger blur event for validation
    const blurEvent = {
      target: { name: 'country', value: countryName }
    } as React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    onBlur(blurEvent);
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
        <div className="relative" ref={countryDropdownRef}>
          {/* Hidden input for form submission */}
          <input
            type="hidden"
            name="country"
            value={formData.country}
            required
          />
          
          {/* Searchable dropdown */}
          <div className="relative">
            <input
              ref={countryInputRef}
              type="text"
              value={isCountryDropdownOpen ? countrySearchTerm : countryDisplayValue}
              onChange={(e) => {
                setCountrySearchTerm(e.target.value);
                setIsCountryDropdownOpen(true);
              }}
              onFocus={() => {
                setIsCountryDropdownOpen(true);
                setCountrySearchTerm('');
              }}
              onBlur={(e) => {
                // Delay to allow click on dropdown items
                setTimeout(() => {
                  if (!countryDropdownRef.current?.contains(document.activeElement)) {
                    setIsCountryDropdownOpen(false);
                    setCountrySearchTerm('');
                    
                    // Trigger blur event for validation if country is selected
                    if (formData.country) {
                      const blurEvent = {
                        target: { name: 'country', value: formData.country }
                      } as React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
                      onBlur(blurEvent);
                    }
                  }
                }, 200);
              }}
              className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                hasFieldError('country') ? 'border-red-400 bg-red-50' : 'border-timberwolf/30'
              }`}
              placeholder={formData.country ? '' : 'Sélectionner un pays'}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Dropdown options */}
          {isCountryDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-timberwolf/30 rounded-xl shadow-lg max-h-60 overflow-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Aucun pays trouvé
                </div>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country.name)}
                    className={`w-full px-4 py-3 text-left hover:bg-gold-metallic/10 transition-colors duration-150 ${
                      formData.country === country.name ? 'bg-gold-metallic/20 font-medium' : ''
                    }`}
                  >
                    <span className="text-sm">
                      {country.flag} {country.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {getFieldError('country') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('country')}</p>
        )}
      </div>

      {/* Only show Senegal-specific fields when country is Senegal */}
      {formData.country === 'Senegal' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Région *</label>
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
            {getFieldError('region') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('region')}</p>
            )}
          </div>

          {formData.region && (
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
                    {getDepartmentsForRegion(formData.region).map((department) => (
                      <option key={department.value} value={department.value}>
                        {department.display}
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

          {formData.region && formData.department && departmentHasArrondissements(formData.region, formData.department) && (
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
                  {getArrondissementsForDepartment(formData.region, formData.department).map((arrondissement) => (
                    <option key={arrondissement.value} value={arrondissement.value}>
                      {arrondissement.display}
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

          {formData.region && formData.department && (
            <div>
              <label className="block text-sm font-semibold text-night mb-2">Commune *</label>
              {(() => {
                let communes: Array<{value: string, display: string}> = [];
                
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
                      {communes.map((commune) => (
                        <option key={commune.value} value={commune.value}>
                          {commune.display}
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
              })()}
              {getFieldError('district') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('district')}</p>
              )}
            </div>
          )}
        </>
      )}

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
          placeholder="Ex: 1, Rue de la République..."
          required
        />
        {getFieldError('address') && (
          <p className="text-red-500 text-sm mt-1">{getFieldError('address')}</p>
        )}
      </div>
    </div>
  );
}
