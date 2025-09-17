'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, accept any email/password combination
      if (formData.email && formData.password) {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        // Trigger storage event to update navigation
        window.dispatchEvent(new Event('storage'));
        router.push('/portal');
      } else {
        setError('Veuillez remplir tous les champs');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gold-metallic/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-gold-metallic" />
          </div>
          <h1 className="text-3xl font-bold text-night mb-2">
            Connexion
          </h1>
          <p className="text-night/70">
            Accédez à votre portail client Sama Naffa
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-night mb-2">
                Email ou numéro de téléphone
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                placeholder="votre@email.com ou +221XXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-night mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-night/50 hover:text-night transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
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
                type="button"
                className="text-sm text-gold-metallic hover:text-gold-metallic/80 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                isLoading
                  ? 'bg-timberwolf/50 text-night/50 cursor-not-allowed'
                  : 'bg-gold-metallic text-night hover:bg-gold-metallic/90'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-timberwolf/30"></div>
            <span className="px-4 text-sm text-night/50">ou</span>
            <div className="flex-1 border-t border-timberwolf/30"></div>
          </div>

          {/* Alternative Login Methods */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-timberwolf/30 rounded-lg text-night hover:bg-timberwolf/10 transition-colors">
              <DevicePhoneMobileIcon className="w-5 h-5" />
              <span>Connexion par SMS</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-night/70 text-sm">
              Pas encore de compte ?{' '}
              <button 
                onClick={() => router.push('/register')}
                className="text-gold-metallic hover:text-gold-metallic/80 font-medium transition-colors"
              >
                Créer un compte
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
