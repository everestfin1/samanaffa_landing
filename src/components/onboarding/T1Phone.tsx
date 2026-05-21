'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { countries as ALL_COUNTRIES, type Country } from '@/components/data/countries';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';

interface T1PhoneProps {
  simulation: unknown;
  initialPhone?: string;
  initialCountry?: string;
  onSuccess: (
    userId: string,
    phone: string,
    displayPhone: string,
    countryCode: string,
    sessionToken: string,
  ) => void;
  onBack?: () => void;
}

// West-African / UEMOA priorities, then everything else
const PRIORITY_CODES = ['SN', 'CI', 'ML', 'BF', 'BJ', 'TG', 'NE', 'GW', 'GN', 'MR', 'FR', 'US'];

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function formatLocal(digits: string, country: Country): string {
  // Senegal example: 77 123 45 67 — group as 2-3-2-2 if length 9
  if (country.code === 'SN' && digits.length === 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  // Generic grouping by 3
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

function expectedLength(country: Country): number {
  // Reasonable defaults for the regional/common cases
  const map: Record<string, number> = {
    SN: 9, CI: 10, ML: 8, BF: 8, BJ: 8, TG: 8, NE: 8, GW: 9, GN: 9, MR: 8, FR: 9, US: 10,
  };
  return map[country.code] ?? 9;
}

export default function T1Phone({ simulation, initialPhone, initialCountry, onSuccess, onBack }: T1PhoneProps) {
  const sortedCountries = useMemo(() => {
    const priority = PRIORITY_CODES
      .map((c) => ALL_COUNTRIES.find((x) => x.code === c))
      .filter(Boolean) as Country[];
    const rest = ALL_COUNTRIES
      .filter((c) => !PRIORITY_CODES.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name));
    return [...priority, ...rest];
  }, []);

  const [country, setCountry] = useState<Country>(
    sortedCountries.find((c) => c.code === (initialCountry || 'SN')) ?? sortedCountries[0],
  );
  const [local, setLocal] = useState<string>(initialPhone ? digitsOnly(initialPhone.replace(country.phoneCode, '')) : '');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otp.join('').length === 6) {
      handleVerify();
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false);
    };
    if (pickerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const filteredCountries = useMemo(
    () =>
      search
        ? sortedCountries.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) || c.phoneCode.includes(search),
          )
        : sortedCountries,
    [search, sortedCountries],
  );

  const digits = digitsOnly(local);
  const expected = expectedLength(country);
  const isValidLength = digits.length === expected;
  const fullPhone = `${country.phoneCode}${digits}`;
  const displayPhone = `${country.phoneCode} ${formatLocal(digits, country)}`;

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-otp', phone: fullPhone, simulation }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setSessionId(data.sessionId);
      setMockOtp(null);
      if (data.mockMode && data.sessionId) {
        try {
          const hintRes = await fetch('/api/auth/dev-mock-otp-hint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: data.sessionId }),
          });
          const hint = await hintRes.json();
          if (hintRes.ok && hint.mockOtp) {
            setMockOtp(hint.mockOtp);
          }
        } catch {
          // dev-only
        }
      }
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-otp', sessionId, otp: otp.join('') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      if (!data.sessionToken) {
        throw new Error('Session de connexion manquante');
      }
      onSuccess(data.userId, data.phone, displayPhone, country.code, data.sessionToken);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {onBack && !sessionId && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}

      <OnboardingStepHeader
        title={sessionId ? 'Vérifiez votre numéro' : 'Votre numéro de téléphone'}
        description={
          sessionId
            ? `Code envoyé au ${displayPhone}`
            : 'On t\'enverra un code par SMS — pas de mot de passe pour démarrer.'
        }
      />

      <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-4">
        {!sessionId ? (
          <>
            <div className="flex gap-2">
              {/* Country picker */}
              <div ref={pickerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setPickerOpen((o) => !o)}
                  className="h-14 px-3 flex items-center gap-2 border border-timberwolf/40 rounded-xl hover:bg-gray-50"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-medium text-night">{country.phoneCode}</span>
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </button>

                {pickerOpen && (
                  <div className="absolute z-50 mt-1 w-72 rounded-xl border border-timberwolf/40 bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center border-b border-timberwolf/30 px-3 py-2 bg-gray-50">
                      <MagnifyingGlassIcon className="mr-2 h-4 w-4 opacity-50" />
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
                          }
                        }}
                        className="flex-1 bg-transparent text-sm outline-none"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredCountries.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-night/50">
                          Aucun pays trouvé
                        </div>
                      ) : (
                        filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setCountry(c);
                              setPickerOpen(false);
                              setSearch('');
                            }}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                              c.code === country.code ? 'bg-gold/10 font-medium' : ''
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-night">{c.name}</span>
                            </span>
                            <span className="text-night/50 text-xs">{c.phoneCode}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Local number input */}
              <input
                type="tel"
                inputMode="numeric"
                value={formatLocal(digits, country)}
                onChange={(e) => setLocal(digitsOnly(e.target.value).slice(0, expected))}
                placeholder={country.code === 'SN' ? '77 123 45 67' : 'Numéro'}
                className="flex-1 px-4 h-14 text-lg border border-timberwolf/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold"
                autoFocus
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-night/50">
                {digits.length}/{expected} chiffres
              </p>
              {isValidLength && (
                <span className="text-green-600 text-sm font-bold">✓</span>
              )}
            </div>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            <button
              onClick={handleSendOtp}
              disabled={loading || !isValidLength}
              className="group relative w-full mt-4 px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">{loading ? 'Envoi...' : 'Envoyer le code par SMS'}</span>
              {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>}
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-timberwolf/40 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
              ))}
            </div>
            {mockOtp && (
              <button
                type="button"
                onClick={() => setOtp(mockOtp.split(''))}
                className="w-full mb-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-night"
              >
                Mode dev : utiliser le code {mockOtp}
              </button>
            )}
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] disabled:opacity-50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">{loading ? 'Vérification...' : 'Valider'}</span>
              {!loading && <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>}
            </button>
            <div className="flex flex-col items-center gap-3 mt-4">
              <button
                onClick={handleSendOtp}
                disabled={loading || countdown > 0}
                className="text-sm text-night/60 hover:text-night disabled:opacity-50 transition-colors"
              >
                {countdown > 0 ? `Renvoyer le code dans ${countdown}s` : 'Renvoyer le code'}
              </button>
              <button
                onClick={() => {
                  setSessionId(null);
                  setMockOtp(null);
                  setOtp(['', '', '', '', '', '']);
                  setError(null);
                }}
                className="text-sm text-night/60 hover:text-night transition-colors"
              >
                ← Changer de numéro
              </button>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-night/40 mt-4">
        30 secondes · Compte créé immédiatement
      </p>
    </div>
  );
}
