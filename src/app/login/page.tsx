'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import PhoneInput from '@/components/ui/PhoneInput';
import {
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    contact: '', // Unified field for email or phone
    phone: '', // Separate phone field for react-phone-input-2
    otp: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneValidation, setPhoneValidation] = useState({ isValid: true, error: '' });

  // Utility functions for input validation and detection
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  }

  const detectInputType = (value: string, phoneValue?: string): 'email' | 'phone' | null => {
    if (isValidEmail(value)) return 'email'
    if (phoneValue && phoneValue.length > 5) return 'phone' // Phone input validation
    return null
  }

  // Handle phone validation changes from PhoneInput component
  const handlePhoneValidationChange = (isValid: boolean, error?: string) => {
    setPhoneValidation({ isValid, error: error || '' });
    // Clear general error when phone validation changes
    if (error) setError('');
  };

  // Check for success message from registration
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'registration_success') {
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter avec vos identifiants.');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear the other field when user starts typing in one field
    if (name === 'contact' && value && formData.phone) {
      // User is typing email, clear phone field
      setFormData(prev => ({
        ...prev,
        contact: value,
        phone: '' // Clear phone when email is being filled
      }));
      setPhoneValidation({ isValid: true, error: '' }); // Reset phone validation
    } else {
      // Handle both text inputs and checkboxes
      const fieldValue = type === 'checkbox' ? checked : value;
      setFormData(prev => ({
        ...prev,
        [name]: fieldValue
      }));
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || '';

    // Clear email field when user starts typing phone
    if (phoneValue && formData.contact) {
      // User is typing phone, clear email field
      setFormData(prev => ({
        ...prev,
        phone: phoneValue,
        contact: '' // Clear email when phone is being filled
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phone: phoneValue
      }));
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  // OTP Timer countdown
  const startOtpTimer = () => {
    setOtpTimer(300); // 5 minutes
    const interval = setInterval(() => {
      setOtpTimer(prev => {
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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Check if both fields are filled (should not happen due to input handlers, but safety check)
    if (formData.contact && formData.phone) {
      setError('Veuillez choisir soit l\'email soit le numéro de téléphone, pas les deux');
      setIsLoading(false);
      return;
    }

    if (!formData.contact && !formData.phone) {
      setError('Veuillez saisir votre email ou numéro de téléphone');
      setIsLoading(false);
      return;
    }

    const inputType = detectInputType(formData.contact, formData.phone);
    if (!inputType) {
      setError('Veuillez saisir un email valide ou un numéro de téléphone valide');
      setIsLoading(false);
      return;
    }

    // Additional phone validation check
    if (inputType === 'phone' && !phoneValidation.isValid) {
      setError(phoneValidation.error || 'Numéro de téléphone invalide');
      setIsLoading(false);
      return;
    }

    try {
      let requestBody;
      if (inputType === 'email') {
        requestBody = { email: formData.contact, phone: null, type: 'login' };
      } else {
        // Use the phone value from react-phone-input-2 (already validated)
        requestBody = { email: null, phone: formData.phone, type: 'login' };
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setOtpSent(true);
        setStep('otp');
        startOtpTimer();
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code OTP');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!formData.otp) {
      setError('Veuillez saisir le code OTP');
      setIsLoading(false);
      return;
    }

    try {
      const inputType = detectInputType(formData.contact, formData.phone);
      let signInData;
      if (inputType === 'email') {
        signInData = { email: formData.contact, phone: null, otp: formData.otp, type: 'login', redirect: false };
      } else {
        // Use the phone value from react-phone-input-2 (already validated)
        signInData = { email: null, phone: formData.phone, otp: formData.otp, type: 'login', redirect: false };
      }

      const result = await signIn('credentials', signInData);

      if (result?.error) {
        setError('Code OTP invalide ou expiré');
      } else if (result?.ok) {
        setSuccess('Connexion réussie !');
        router.push('/portal/dashboard');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Check if both fields are filled (should not happen due to input handlers, but safety check)
    if (formData.contact && formData.phone) {
      setError('Veuillez choisir soit l\'email soit le numéro de téléphone, pas les deux');
      setIsLoading(false);
      return;
    }

    const inputType = detectInputType(formData.contact, formData.phone);
    if (!inputType) {
      setError('Veuillez saisir un email valide ou un numéro de téléphone valide');
      setIsLoading(false);
      return;
    }

    // Additional phone validation check
    if (inputType === 'phone' && !phoneValidation.isValid) {
      setError(phoneValidation.error || 'Numéro de téléphone invalide');
      setIsLoading(false);
      return;
    }

    try {
      let requestBody;
      if (inputType === 'email') {
        requestBody = { email: formData.contact, phone: null, type: 'login' };
      } else {
        // Use the phone value from react-phone-input-2 (already validated)
        requestBody = { email: null, phone: formData.phone, type: 'login' };
      }

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Code OTP renvoyé avec succès');
        startOtpTimer();
      } else {
        setError(data.error || 'Erreur lors du renvoi du code OTP');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-night mb-2">
            {step === 'email' ? 'Connexion' : 'Vérification OTP'}
          </h1>
          <p className="text-night/70">
            {step === 'email' 
              ? 'Accédez à votre portail client Sama Naffa'
              : 'Saisissez le code de vérification envoyé'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-night mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                  <p className="text-xs text-night/60 mt-1">
                    Format: email@domain.com
                  </p>
                </div>

                <div className="text-center text-night/70 text-sm font-medium py-2">
                  <span className="bg-night/10 px-3 py-1 rounded-full">OU</span>
                </div>

                <PhoneInput
                  label="Numéro de téléphone *"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onValidationChange={handlePhoneValidationChange}
                  error={phoneValidation.error}
                  placeholder="77 123 45 67"
                  required
                />

                <div className="text-center text-sm text-night/60 mt-3">
                  <p className="bg-gold-metallic/5 px-3 py-2 rounded-lg">
                    💡 Choisissez <strong>soit l'email</strong> soit <strong>le numéro de téléphone</strong> pour vous connecter
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-gold-metallic border-timberwolf/30 rounded focus:ring-gold-metallic"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-night/70">
                  Se souvenir de moi
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || (!formData.contact && !formData.phone) || (!!formData.contact && !!formData.phone)}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading || (!formData.contact && !formData.phone) || (!!formData.contact && !!formData.phone)
                    ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                    : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le code OTP</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              <div className="text-center">
                <p className="text-night/70 mb-4">
                  Code envoyé à {detectInputType(formData.contact, formData.phone) === 'email' ? formData.contact : formData.phone}
                </p>
                {otpTimer > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-gold-metallic">
                    <ClockIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Expire dans {formatTime(otpTimer)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-night mb-2">
                  Code de vérification (6 chiffres)
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  placeholder="123456"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="flex-1 py-3 px-6 border border-timberwolf/30 rounded-lg text-night hover:bg-timberwolf/10 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.otp || formData.otp.length !== 6}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    isLoading || !formData.otp || formData.otp.length !== 6
                      ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                      : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <>
                      <span>Vérifier</span>
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
                    : 'Renvoyer le code'
                  }
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-night/70 text-sm">
              Pas encore de compte ?{' '}
              <button 
                onClick={() => router.push('/register')}
                className="text-gold-metallic hover:text-gold-metallic/80 font-medium transition-colors"
              >
                Créer un Naffa
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-night/60">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Connexion sécurisée - Chiffrement SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-metallic"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
