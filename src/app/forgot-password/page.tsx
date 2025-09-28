'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  LockClosedIcon,
  EyeSlashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import PhoneInput from '@/components/ui/PhoneInput';

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    contact: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [phoneValidation, setPhoneValidation] = useState({ isValid: true, error: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Utility functions
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const detectInputType = (value: string, phoneValue?: string): 'email' | 'phone' | null => {
    if (isValidEmail(value)) return 'email';
    if (phoneValue && phoneValue.length > 5) return 'phone';
    return null;
  };

  const handlePhoneValidationChange = (isValid: boolean, error?: string) => {
    setPhoneValidation({ isValid, error: error || '' });
    if (error) setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === 'contact' && value && formData.phone) {
      setFormData(prev => ({
        ...prev,
        contact: value,
        phone: ''
      }));
      setPhoneValidation({ isValid: true, error: '' });
    } else {
      const fieldValue = type === 'checkbox' ? checked : value;
      setFormData(prev => ({
        ...prev,
        [name]: fieldValue
      }));
    }

    if (error) setError('');
  };

  const handlePhoneChange = (value: string | undefined) => {
    const phoneValue = value || '';

    if (phoneValue && formData.contact) {
      setFormData(prev => ({
        ...prev,
        phone: phoneValue,
        contact: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        phone: phoneValue
      }));
    }

    if (error) setError('');
  };

  // OTP Timer
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

  // Send OTP for password reset
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

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

    if (inputType === 'phone' && !phoneValidation.isValid) {
      setError(phoneValidation.error || 'Numéro de téléphone invalide');
      setIsLoading(false);
      return;
    }

    try {
      let requestBody;
      if (inputType === 'email') {
        requestBody = { email: formData.contact, phone: null, type: 'password_reset' };
      } else {
        requestBody = { email: null, phone: formData.phone, type: 'password_reset' };
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

  // Verify OTP and proceed to password reset
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
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inputType === 'email' ? formData.contact : null,
          phone: inputType === 'phone' ? formData.phone : null,
          otp: formData.otp,
          type: 'password_reset'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Code OTP vérifié. Vous pouvez maintenant définir un nouveau mot de passe.');
        setStep('password');
      } else {
        setError(data.error || 'Code OTP invalide ou expiré');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!formData.newPassword) {
      setError('Le nouveau mot de passe est requis');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const inputType = detectInputType(formData.contact, formData.phone);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inputType === 'email' ? formData.contact : null,
          phone: inputType === 'phone' ? formData.phone : null,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Mot de passe réinitialisé avec succès !');
        setTimeout(() => {
          router.push('/login?message=password_reset_success');
        }, 2000);
      } else {
        setError(data.error || 'Erreur lors de la réinitialisation du mot de passe');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <LockClosedIcon className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-night mb-2">
            {step === 'email' ? 'Mot de passe oublié' : 
             step === 'otp' ? 'Vérification OTP' : 'Nouveau mot de passe'}
          </h1>
          <p className="text-night/70">
            {step === 'email' ? 'Réinitialisez votre mot de passe en toute sécurité' :
             step === 'otp' ? 'Vérifiez votre identité avec le code envoyé' :
             'Définissez un nouveau mot de passe sécurisé'}
          </p>
        </div>

        {/* Form */}
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
              </div>

              <button
                type="submit"
                disabled={isLoading || (!formData.contact && !formData.phone)}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading || (!formData.contact && !formData.phone)
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
                    <span>Envoyer le code de réinitialisation</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : step === 'otp' ? (
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
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="Nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-timberwolf/60 hover:text-timberwolf"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-night mb-2">
                  Confirmer le nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                    placeholder="Confirmez le nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-timberwolf/60 hover:text-timberwolf"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isLoading || !formData.newPassword || formData.newPassword !== formData.confirmPassword
                    ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                    : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Réinitialisation...</span>
                  </>
                ) : (
                  <>
                    <span>Réinitialiser le mot de passe</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <p className="text-night/70 text-sm">
              Vous vous souvenez de votre mot de passe ?{' '}
              <button 
                onClick={() => router.push('/login')}
                className="text-gold-metallic hover:text-gold-metallic/80 font-medium transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-metallic"></div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}
