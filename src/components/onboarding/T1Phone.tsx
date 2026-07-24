'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { countries as ALL_COUNTRIES, type Country } from '@/components/data/countries';
import { useSponsorCodeVerification } from '@/hooks/useSponsorCodeVerification';
import { GENERIC_OTP_SEND_MESSAGE } from '@/lib/otp-send-response';
import { isApeDeprecated } from '@/lib/product-flags';

export type T1ProfileDraft = {
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string | null;
};

interface T1PhoneProps {
  simulation: unknown;
  referralCode?: string | null;
  initialPhone?: string;
  initialCountry?: string;
  onSuccess: (
    userId: string,
    phone: string,
    displayPhone: string,
    countryCode: string,
    sessionToken: string,
    profile: T1ProfileDraft,
  ) => void;
  onBack?: () => void;
}

const PRIORITY_CODES = ['SN', 'CI', 'ML', 'BF', 'BJ', 'TG', 'NE', 'GW', 'GN', 'MR', 'FR', 'US'];

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function formatLocal(digits: string, country: Country): string {
  if (country.code === 'SN' && digits.length === 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

function expectedLength(country: Country): number {
  const map: Record<string, number> = {
    SN: 9, CI: 10, ML: 8, BF: 8, BJ: 8, TG: 8, NE: 8, GW: 9, GN: 9, MR: 8, FR: 9, US: 10,
  };
  return map[country.code] ?? 9;
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function T1Phone({
  simulation,
  referralCode,
  initialPhone,
  initialCountry,
  onSuccess,
  onBack,
}: T1PhoneProps) {
  const monoProduit = isApeDeprecated();
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
  const [local, setLocal] = useState<string>(
    initialPhone ? digitsOnly(initialPhone.replace(country.phoneCode, '')) : '',
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [hasReferralCode, setHasReferralCode] = useState<boolean | null>(
    referralCode ? true : monoProduit ? false : null,
  );
  const sponsor = useSponsorCodeVerification(referralCode ?? '');

  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mockOtp, setMockOtp] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingAccountHint, setExistingAccountHint] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (referralCode) {
      setHasReferralCode(true);
      sponsor.setCode(referralCode);
      void sponsor.verify(referralCode);
    }
    // Prefill from URL / parent once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        ? sortedCountries.filter(
            (c) =>
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

  const referralReady =
    monoProduit ||
    hasReferralCode === false ||
    (hasReferralCode === true &&
      (!sponsor.code.trim() ||
        (sponsor.status === 'valid' && sponsor.canProceedWithCode)));

  const canSendOtp =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    isValidEmail(email) &&
    isValidLength &&
    consent &&
    referralReady &&
    (monoProduit || hasReferralCode !== null);

  const profileDraft = (): T1ProfileDraft => ({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    referralCode:
      hasReferralCode && sponsor.code.trim() ? sponsor.code.trim() : null,
  });

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && otp.join('').length === 6) {
      void handleVerify();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = digitsOnly(e.clipboardData.getData('text')).slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? '');
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSendOtp = async () => {
    if (!canSendOtp && !sessionId) return;
    setLoading(true);
    setError(null);
    setExistingAccountHint(null);
    try {
      const draft = profileDraft();
      const res = await fetch('/api/onboarding/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-otp',
          phone: fullPhone,
          simulation,
          referralCode: draft.referralCode || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      if (!data.sessionId) {
        setExistingAccountHint(
          typeof data.message === 'string' ? data.message : GENERIC_OTP_SEND_MESSAGE,
        );
        return;
      }

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
          if (hintRes.ok && hint.mockOtp) setMockOtp(hint.mockOtp);
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
      if (!data.sessionToken) throw new Error('Session de connexion manquante');
      onSuccess(data.userId, data.phone, displayPhone, country.code, data.sessionToken, profileDraft());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (sessionId) {
    const greetingName = firstName.trim() || 'toi';
    return (
      <div className="e1-shell">
        <div className="e1-otp">
          <h1 className="e1-title">
            {greetingName}, sécurise ton Kondanné
          </h1>
          <p className="e1-subtitle">Code envoyé au {displayPhone}</p>

          <div className="e1-otp-card">
            <div className="e1-otp-row" role="group" aria-label="Code de vérification">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  aria-label={`Chiffre ${index + 1}`}
                  className={`e1-otp-cell ${digit ? 'is-filled' : ''} ${
                    index === otp.findIndex((d) => !d) || (otp.every(Boolean) && index === 5)
                      ? 'is-active'
                      : ''
                  }`}
                />
              ))}
            </div>

            {mockOtp && (
              <button
                type="button"
                onClick={() => setOtp(mockOtp.split(''))}
                className="e1-dev-hint"
              >
                Mode dev : utiliser le code {mockOtp}
              </button>
            )}

            {error && <p className="e1-error">{error}</p>}

            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={loading || otp.join('').length !== 6}
              className="e1-cta"
            >
              {loading ? 'Vérification…' : 'Je valide'}
            </button>

            <div className="e1-otp-footer">
              <button
                type="button"
                onClick={() => void handleSendOtp()}
                disabled={loading || countdown > 0}
                className="e1-text-btn"
              >
                {countdown > 0 ? `Renvoie le code : ${countdown} s` : 'Renvoyer le code'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSessionId(null);
                  setMockOtp(null);
                  setOtp(['', '', '', '', '', '']);
                  setError(null);
                }}
                className="e1-text-btn e1-text-btn--link"
              >
                Change de numéro de téléphone
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="e1-shell">
      <div className="e1-layout">
        <div className="e1-form-col">
          {onBack && (
            <button type="button" onClick={onBack} className="e1-back">
              ← Retour
            </button>
          )}

          <h1 className="e1-title">Je crée mon Kondanné</h1>

          <div className="e1-card">
            <div className="e1-name-row">
              <label className="e1-field">
                <span className="e1-label">Prénom</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Aliou"
                  className="e1-input"
                  autoComplete="given-name"
                />
              </label>
              <label className="e1-field">
                <span className="e1-label">Nom</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Diallo"
                  className="e1-input"
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="e1-field">
              <span className="e1-label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Aliou@gmail.com"
                className="e1-input"
                autoComplete="email"
              />
            </label>

            <div className="e1-field">
              <span className="e1-label">
                Numéro de téléphone <span className="e1-required">*</span>
              </span>
              <div className="e1-phone-row">
                <div ref={pickerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setPickerOpen((o) => !o)}
                    className="e1-country"
                    aria-label="Choisir le pays"
                  >
                    <span className="text-lg leading-none">{country.flag}</span>
                    <span>{country.phoneCode}</span>
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
                            }}
                            className={`e1-picker-item ${c.code === country.code ? 'is-active' : ''}`}
                          >
                            <span>
                              <span className="mr-2">{c.flag}</span>
                              {c.name}
                            </span>
                            <span className="opacity-50">{c.phoneCode}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={formatLocal(digits, country)}
                  onChange={(e) => {
                    setLocal(digitsOnly(e.target.value).slice(0, expected));
                    setExistingAccountHint(null);
                  }}
                  placeholder={country.code === 'SN' ? '77 123 45 67' : 'Numéro'}
                  className="e1-input e1-input--phone"
                  autoComplete="tel-national"
                />
              </div>
            </div>

            <div className="e1-referral">
              <p className="e1-label">As-tu un code de parrainage ?</p>
              <div className="e1-referral-toggle">
                {(
                  [
                    { value: true, label: 'Oui' },
                    { value: false, label: 'Non' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setHasReferralCode(opt.value)}
                    className={`e1-chip ${hasReferralCode === opt.value ? 'is-active' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {hasReferralCode === true && (
                <input
                  type="text"
                  value={sponsor.code}
                  onChange={(e) => sponsor.handleChange(e.target.value)}
                  placeholder="Mets ton code"
                  className="e1-input mt-3"
                  autoComplete="off"
                />
              )}
              {hasReferralCode === true && sponsor.message && (
                <p
                  className={`mt-2 text-sm ${
                    sponsor.status === 'valid' ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  {sponsor.message}
                </p>
              )}
            </div>

            {error && <p className="e1-error">{error}</p>}
            {existingAccountHint && (
              <div className="e1-existing">
                <p>{existingAccountHint}</p>
                <p>
                  Vous avez déjà un compte ?{' '}
                  <Link href="/login" className="e1-inline-link">
                    Connectez-vous avec ce numéro
                  </Link>
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleSendOtp()}
              disabled={loading || !canSendOtp}
              className="e1-cta"
            >
              {loading ? 'Envoi…' : 'Envoie moi le code de vérification par SMS'}
            </button>

            <p className="e1-login-hint">
              Déjà un Naffa ?{' '}
              <Link href="/login" className="e1-inline-link">
                Connecte-toi
              </Link>
            </p>
          </div>

          <label className="e1-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="e1-consent-check"
            />
            <span>
              En entrant votre numéro de téléphone, vous acceptez la{' '}
              <Link href="/privacy" className="e1-inline-link">
                Politique de confidentialité
              </Link>{' '}
              et de gestion des cookies de EVEREST Finance. En entrant votre courriel, vous
              consentez à recevoir des communications de la part de EVEREST Finance. Vous pouvez
              vous désinscrire à tout moment.
            </span>
          </label>
        </div>

        <div className="e1-art" aria-hidden>
          <Image
            src="/figma/e1/kondanne-chests.png"
            alt=""
            width={551}
            height={415}
            className="e1-art-img"
            priority
          />
        </div>
      </div>
    </div>
  );
}
