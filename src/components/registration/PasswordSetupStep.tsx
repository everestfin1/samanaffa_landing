'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface PasswordSetupStepProps {
  userId: string;
  onSuccess: () => void;
}

export default function PasswordSetupStep({ userId, onSuccess }: PasswordSetupStepProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    isValid: false
  });

  // Password strength validation
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    let feedback = '';

    if (password.length >= minLength) score += 1;
    if (hasUpperCase) score += 1;
    if (hasLowerCase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSpecialChar) score += 1;

    if (score < 3) {
      feedback = 'Mot de passe faible';
    } else if (score < 4) {
      feedback = 'Mot de passe moyen';
    } else {
      feedback = 'Mot de passe fort';
    }

    return {
      score,
      feedback,
      isValid: score >= 3 && password.length >= minLength
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = validatePassword(value);
      setPasswordStrength(strength);
    }

    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.password) {
      setError('Le mot de passe est requis');
      setIsLoading(false);
      return;
    }

    if (!passwordStrength.isValid) {
      setError('Le mot de passe ne respecte pas les critères de sécurité');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // After successful password setup, automatically log in the user
        try {
          const signInResult = await signIn('credentials', {
            email: data.user.email,
            phone: data.user.phone,
            password: formData.password,
            type: 'login',
            redirect: false
          });

          if (signInResult?.error) {
            setError('Mot de passe configuré mais erreur de connexion. Veuillez vous connecter manuellement.');
            // Still call onSuccess to redirect to login
            setTimeout(() => {
              router.push('/login?message=password_setup_success');
            }, 2000);
          } else if (signInResult?.ok) {
            // Successfully logged in, redirect to dashboard
            onSuccess();
          }
        } catch (loginError) {
          console.error('Error during auto-login:', loginError);
          setError('Mot de passe configuré mais erreur de connexion. Veuillez vous connecter manuellement.');
          // Still call onSuccess to redirect to login
          setTimeout(() => {
            router.push('/login?message=password_setup_success');
          }, 2000);
        }
      } else {
        setError(data.error || 'Erreur lors de la configuration du mot de passe');
      }
    } catch (error) {
      console.error('Error setting up password:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score < 3) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score < 3) return 'Faible';
    if (score < 4) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gold-metallic/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <h1 className="text-3xl font-bold text-night mb-2">
            Configurez votre mot de passe
          </h1>
          <p className="text-night/70">
            Créez un mot de passe sécurisé pour accéder à votre compte
          </p>
        </div>

        {/* Password Setup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={formData.showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  placeholder="Créez un mot de passe sécurisé"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-timberwolf/60 hover:text-timberwolf"
                >
                  {formData.showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-timberwolf/20 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score < 3 ? 'text-red-600' :
                      passwordStrength.score < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <p className="text-xs text-timberwolf/60">{passwordStrength.feedback}</p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Confirmer le mot de passe *
              </label>
              <div className="relative">
                <input
                  type={formData.showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  placeholder="Confirmez votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-timberwolf/60 hover:text-timberwolf"
                >
                  {formData.showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gold-metallic/5 border border-gold-metallic/20 rounded-lg p-4">
              <h4 className="font-semibold text-night mb-3 flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4" />
                Critères de sécurité
              </h4>
              <ul className="text-sm space-y-1 text-night/70">
                <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-timberwolf/60'}`}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Au moins 8 caractères
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-timberwolf/60'}`}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Une majuscule
                </li>
                <li className={`flex items-center gap-2 ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-timberwolf/60'}`}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Une minuscule
                </li>
                <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-timberwolf/60'}`}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Un chiffre
                </li>
                <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : 'text-timberwolf/60'}`}>
                  <CheckCircleIcon className="w-4 h-4" />
                  Un caractère spécial
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordStrength.isValid || formData.password !== formData.confirmPassword}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                isLoading || !passwordStrength.isValid || formData.password !== formData.confirmPassword
                  ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                  : 'bg-gold-metallic text-white hover:bg-gold-metallic/90'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Configuration...</span>
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Configurer le mot de passe</span>
                </>
              )}
            </button>
          </form>

          {/* Skip Option */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/login?message=password_setup_skipped')}
              className="text-sm text-timberwolf/60 hover:text-timberwolf transition-colors"
            >
              Configurer plus tard
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-night/60">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Mot de passe chiffré et sécurisé</span>
          </div>
        </div>
      </div>
    </div>
  );
}
