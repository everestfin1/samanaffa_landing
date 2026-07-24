'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { countries as ALL_COUNTRIES, type Country } from '@/components/data/countries';
import { SENEGAL_REGIONS } from '@/components/data/senegal-regions';

const PRIORITY_CODES = ['SN', 'CI', 'ML', 'BF', 'BJ', 'TG', 'NE', 'GW', 'GN', 'MR', 'FR', 'US'];

export type T2PersonalInfoResult = {
  profession: string;
  country: string;
  region: string;
};

interface T2PersonalInfoProps {
  firstName: string;
  initialProfession?: string;
  initialCountry?: string;
  initialRegion?: string;
  onSuccess: (data: T2PersonalInfoResult) => void | Promise<void>;
  onBack?: () => void;
}

export default function T2PersonalInfo({
  firstName,
  initialProfession,
  initialCountry,
  initialRegion,
  onSuccess,
  onBack,
}: T2PersonalInfoProps) {
  const sortedCountries = useMemo(() => {
    const priority = PRIORITY_CODES
      .map((c) => ALL_COUNTRIES.find((x) => x.code === c))
      .filter(Boolean) as Country[];
    const rest = ALL_COUNTRIES
      .filter((c) => !PRIORITY_CODES.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...priority, ...rest];
  }, []);

  const [profession, setProfession] = useState(initialProfession ?? '');
  const [country, setCountry] = useState<Country>(
    sortedCountries.find((c) => c.code === (initialCountry || 'SN')) ??
      sortedCountries.find((c) => c.code === 'SN') ??
      sortedCountries[0],
  );
  const [region, setRegion] = useState(initialRegion ?? 'Dakar');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedCountries;
    return sortedCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.phoneCode.includes(q),
    );
  }, [search, sortedCountries]);

  const isSenegal = country.code === 'SN';
  const greetingName = firstName.trim() || 'toi';

  const canSubmit = profession.trim().length > 0 && region.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const payload: T2PersonalInfoResult = {
        profession: profession.trim(),
        country: country.code,
        region: region.trim(),
      };
      const res = await fetch('/api/onboarding/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metiers: payload.profession,
          country: payload.country,
          region: payload.region,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      await onSuccess(payload);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="e1-shell">
      <div className="e1-art" aria-hidden>
        <Image
          src="/figma/e1/kondanne-chests.png"
          alt=""
          width={1102}
          height={830}
          className="e1-art-img"
          priority
        />
      </div>

      <div className="e1-layout">
        <div className="e1-form-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title">
            {greetingName}, dis nous en plus
          </h1>

          <div className="e1-card">
            <label className="e1-field">
              <span className="e1-label">Profession</span>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Votre profession"
                className="e1-input"
                autoComplete="organization-title"
                autoFocus
              />
            </label>

            <div className="e1-field">
              <span className="e1-label">Pays de résidence</span>
              <div ref={pickerRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setPickerOpen((o) => !o);
                    setRegionOpen(false);
                  }}
                  className="e1-input e2-select-trigger"
                  aria-label="Choisir le pays de résidence"
                >
                  <span>
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </span>
                  <span className="e1-country-caret">▾</span>
                </button>

                {pickerOpen && (
                  <div className="e1-picker">
                    <div className="e1-picker-search">
                      <MagnifyingGlassIcon className="h-4 w-4 opacity-50" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Rechercher un pays"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setPickerOpen(false);
                          if (e.key === 'Enter' && filteredCountries.length > 0) {
                            setCountry(filteredCountries[0]);
                            setPickerOpen(false);
                            setSearch('');
                            if (filteredCountries[0].code === 'SN' && !region.trim()) {
                              setRegion('Dakar');
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="e1-picker-list">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountry(c);
                            setPickerOpen(false);
                            setSearch('');
                            if (c.code === 'SN') {
                              setRegion((r) => r || 'Dakar');
                            }
                          }}
                          className={`e1-picker-item ${c.code === country.code ? 'is-active' : ''}`}
                        >
                          <span>
                            <span className="mr-2">{c.flag}</span>
                            {c.name}
                          </span>
                          <span className="opacity-50">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="e1-field">
              <span className="e1-label">Région</span>
              {isSenegal ? (
                <div ref={regionRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setRegionOpen((o) => !o);
                      setPickerOpen(false);
                    }}
                    className="e1-input e2-select-trigger"
                    aria-label="Choisir la région"
                  >
                    <span>{region || 'Choisir une région'}</span>
                    <span className="e1-country-caret">▾</span>
                  </button>
                  {regionOpen && (
                    <div className="e1-picker">
                      <div className="e1-picker-list">
                        {SENEGAL_REGIONS.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setRegion(r);
                              setRegionOpen(false);
                            }}
                            className={`e1-picker-item ${r === region ? 'is-active' : ''}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Votre région"
                  className="e1-input"
                  autoComplete="address-level1"
                />
              )}
            </div>

            {error && <p className="e1-error">{error}</p>}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={loading || !canSubmit}
              className="e1-cta"
            >
              {loading ? 'Enregistrement…' : 'Je continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
