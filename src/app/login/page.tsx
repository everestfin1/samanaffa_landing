'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PhoneInput from '@/components/ui/PhoneInput';
import { safeCallbackUrl } from '@/lib/safe-callback-url';
import {
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

type LoginStep = 'phone' | 'otp';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postLoginPath = safeCallbackUrl(searchParams.get('callbackUrl'), '/portal/dashboard');

  const [step, setStep] = useState<LoginStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [mockOtp, setMockOtp] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneValidation, setPhoneValidation] = useState({ isValid: true, error: '' });

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'registration_success' || message === 'auto_login_failed') {
      setSuccess('Compte créé ! Entrez votre numéro pour recevoir un code de connexion par SMS.');
    }
  }, [searchParams]);

  const handlePhoneValidationChange = (isValid: boolean, err?: string) => {
    setPhoneValidation({ isValid, error: err || '' });
    if (err) setError('');
  };

  const handlePhoneChange = (value: string | undefined) => {
    setPhone(value || '');
    if (error) setError('');
  };

  const startOtpTimer = () => {
    setOtpTimer(300);
    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validatePhone = (): boolean => {
    if (!phone || phone.length <= 5) {
      setError('Veuillez saisir un numéro de téléphone valide');
      return false;
    }
    if (!phoneValidation.isValid) {
      setError(phoneValidation.error || 'Numéro de téléphone invalide');
      return false;
    }
    return true;
  };

  const applyOtpSendResponse = (data: {
    success?: boolean;
    message?: string;
    error?: string;
    mockOtp?: string;
    mockMode?: boolean;
  }) => {
    if (!data.success) {
      setError(data.error || 'Erreur lors de l\'envoi du code');
      return false;
    }
    setSuccess(
      data.mockMode
        ? 'Mode test : aucun SMS réel envoyé. Utilisez le code affiché ci-dessous.'
        : data.message || 'Code envoyé par SMS',
    );
    setMockMode(Boolean(data.mockMode));
    setMockOtp(null);
    setOtp('');
    setStep('otp');
    startOtpTimer();
    return true;
  };

  const fetchMockOtpHint = async (phoneNumber: string) => {
    try {
      const res = await fetch('/api/auth/dev-mock-otp-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const hint = await res.json();
      if (res.ok && hint.mockOtp) {
        setMockOtp(hint.mockOtp);
      }
    } catch {
      // dev-only; ignore
    }
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setSuccess('');
    if (!validatePhone()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'login' }),
      });
      const data = await response.json();
      if (applyOtpSendResponse(data) && data.mockMode && phone) {
        await fetchMockOtpHint(phone);
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0 || isLoading) return;
    setError('');
    setSuccess('');
    if (!validatePhone()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'login' }),
      });
      const data = await response.json();
      if (applyOtpSendResponse(data)) {
        setSuccess(
          data.mockMode
            ? 'Nouveau code test généré.'
            : 'Code renvoyé par SMS',
        );
        if (data.mockMode && phone) {
          await fetchMockOtpHint(phone);
        }
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const normalizedOtp = otp.replace(/\D/g, '').slice(0, 6);
    if (normalizedOtp.length !== 6) {
      setError('Veuillez saisir le code à 6 chiffres');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        phone,
        otp: normalizedOtp,
        type: 'login',
        redirect: false,
      });

      if (result?.error) {
        setError('Code invalide ou expiré');
      } else if (result?.ok) {
        router.push(postLoginPath);
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setMockOtp(null);
    setMockMode(false);
    setOtpTimer(0);
    setError('');
    setSuccess('');
  };

  const fillMockOtp = () => {
    if (mockOtp) setOtp(mockOtp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-night mb-2">Connexion</h1>
          <p className="text-night/70">
            {step === 'phone'
              ? 'Recevez un code par SMS pour accéder à votre portail'
              : 'Saisissez le code reçu par SMS'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <PhoneInput
                label="Numéro de téléphone"
                value={phone}
                onChange={handlePhoneChange}
                onValidationChange={handlePhoneValidationChange}
                error={phoneValidation.error}
                placeholder="77 123 45 67"
                required
              />

              <button
                type="submit"
                disabled={isLoading || !phone || !phoneValidation.isValid}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading || !phone || !phoneValidation.isValid
                    ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                    : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <DevicePhoneMobileIcon className="w-5 h-5" />
                    <span>Recevoir mon code</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-night/70">
                  Code envoyé au <span className="font-medium text-night">{phone}</span>
                </p>
                {otpTimer > 0 && (
                  <div className="flex items-center justify-center gap-2 text-gold-metallic">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Expire dans {formatTime(otpTimer)}
                    </span>
                  </div>
                )}
              </div>

              {mockMode && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <p className="font-medium">Mode test (MOCK_OTP)</p>
                  <p className="mt-1 text-amber-800/90">
                    Aucun SMS réel n&apos;est envoyé en environnement de développement.
                  </p>
                </div>
              )}

              {mockOtp && (
                <button
                  type="button"
                  onClick={fillMockOtp}
                  className="w-full rounded-lg border border-gold-metallic/40 bg-gold-metallic/10 px-4 py-3 text-sm font-medium text-night hover:bg-gold-metallic/15 transition-colors"
                >
                  Mode dev : utiliser le code {mockOtp}
                </button>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-night mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  type="text"
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  placeholder="• • • • • •"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="flex-1 py-3 px-6 border border-timberwolf/30 rounded-lg text-night hover:bg-timberwolf/10 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otp.replace(/\D/g, '').length !== 6}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isLoading || otp.replace(/\D/g, '').length !== 6
                      ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                      : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <CheckCircleIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={otpTimer > 0 || isLoading}
                  className={`text-sm ${
                    otpTimer > 0 || isLoading
                      ? 'text-night/30 cursor-not-allowed'
                      : 'text-gold-metallic hover:text-gold-metallic/80'
                  } transition-colors`}
                >
                  {otpTimer > 0
                    ? `Renvoyer dans ${formatTime(otpTimer)}`
                    : 'Renvoyer le code'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-night/70 text-sm">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => router.push('/onboarding')}
                className="text-gold-metallic hover:text-gold-metallic/80 font-medium transition-colors"
              >
                Créer un Naffa
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-night/60">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Connexion sécurisée par SMS — Chiffrement SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-metallic" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
