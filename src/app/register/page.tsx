'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface FormData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Step 2: Address & Identity
  address: string;
  city: string;
  postalCode: string;
  idType: 'cni' | 'passport' | 'other';
  idNumber: string;
  
  // Step 3: Account Preferences
  accountType: 'savings' | 'investment' | 'both';
  initialDeposit: string;
  monthlyGoal: string;
  
  // Step 4: Security
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  
  // Agreements
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    idType: 'cni',
    idNumber: '',
    accountType: 'savings',
    initialDeposit: '',
    monthlyGoal: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false
  });

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: UserIcon },
    { id: 2, title: 'Adresse & Identité', icon: IdentificationIcon },
    { id: 3, title: 'Préférences de compte', icon: DocumentTextIcon },
    { id: 4, title: 'Sécurité & Validation', icon: ShieldCheckIcon }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth);
      case 2:
        return !!(formData.address && formData.city && formData.idNumber);
      case 3:
        return !!(formData.accountType && formData.initialDeposit);
      case 4:
        return !!(formData.password && formData.confirmPassword && 
                 formData.password === formData.confirmPassword &&
                 formData.securityQuestion && formData.securityAnswer &&
                 formData.termsAccepted && formData.privacyAccepted);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      // Set authentication state
      localStorage.setItem('isAuthenticated', 'true');
      // Trigger storage event to update navigation
      window.dispatchEvent(new Event('storage'));
      router.push('/portal');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-night mb-2">Prénom *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            placeholder="Votre prénom"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-night mb-2">Nom *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            placeholder="Votre nom"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="votre@email.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Téléphone *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="+221 XX XXX XX XX"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Date de naissance *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-night mb-2">Adresse complète *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent resize-none"
          placeholder="Votre adresse complète"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-night mb-2">Ville *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            placeholder="Dakar"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-night mb-2">Code postal</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
            placeholder="12345"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Type de pièce d'identité *</label>
        <select
          name="idType"
          value={formData.idType}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          required
        >
          <option value="cni">Carte Nationale d'Identité</option>
          <option value="passport">Passeport</option>
          <option value="other">Autre</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Numéro de pièce d'identité *</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="Numéro de votre pièce"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-night mb-2">Type de compte souhaité *</label>
        <div className="grid gap-3">
          {[
            { value: 'savings', label: 'Sama Naffa - Épargne', desc: 'Compte d\'épargne avec intérêts' },
            { value: 'investment', label: 'APE - Investissement', desc: 'Produits d\'investissement et obligations' },
            { value: 'both', label: 'Les deux', desc: 'Épargne et investissement' }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3 p-4 border border-timberwolf/30 rounded-lg cursor-pointer hover:bg-timberwolf/5">
              <input
                type="radio"
                name="accountType"
                value={option.value}
                checked={formData.accountType === option.value}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-gold-metallic border-timberwolf/30"
              />
              <div>
                <div className="font-medium text-night">{option.label}</div>
                <div className="text-sm text-night/60">{option.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Dépôt initial (FCFA) *</label>
        <select
          name="initialDeposit"
          value={formData.initialDeposit}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          required
        >
          <option value="">Sélectionner un montant</option>
          <option value="25000">25 000 FCFA</option>
          <option value="50000">50 000 FCFA</option>
          <option value="100000">100 000 FCFA</option>
          <option value="250000">250 000 FCFA</option>
          <option value="500000">500 000 FCFA</option>
          <option value="custom">Montant personnalisé</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Objectif d'épargne mensuel (optionnel)</label>
        <input
          type="number"
          name="monthlyGoal"
          value={formData.monthlyGoal}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="Ex: 50000"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-night mb-2">Mot de passe *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="Choisissez un mot de passe sécurisé"
          required
        />
        <p className="text-xs text-night/60 mt-1">Au moins 8 caractères avec lettres, chiffres et symboles</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Confirmer le mot de passe *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="Confirmez votre mot de passe"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Question de sécurité *</label>
        <select
          name="securityQuestion"
          value={formData.securityQuestion}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          required
        >
          <option value="">Choisissez une question</option>
          <option value="pet">Quel est le nom de votre premier animal de compagnie ?</option>
          <option value="school">Dans quelle école avez-vous fait vos études primaires ?</option>
          <option value="mother">Quel est le nom de jeune fille de votre mère ?</option>
          <option value="city">Dans quelle ville êtes-vous né(e) ?</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-night mb-2">Réponse à la question de sécurité *</label>
        <input
          type="text"
          name="securityAnswer"
          value={formData.securityAnswer}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-lg focus:ring-2 focus:ring-gold-metallic focus:border-transparent"
          placeholder="Votre réponse"
          required
        />
      </div>
      
      <div className="space-y-3 pt-4 border-t border-timberwolf/20">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-gold-metallic border-timberwolf/30 rounded"
            required
          />
          <span className="text-sm text-night">
            J'accepte les <button className="text-gold-metallic hover:underline">conditions d'utilisation</button> *
          </span>
        </label>
        
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-gold-metallic border-timberwolf/30 rounded"
            required
          />
          <span className="text-sm text-night">
            J'accepte la <button className="text-gold-metallic hover:underline">politique de confidentialité</button> *
          </span>
        </label>
        
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="marketingAccepted"
            checked={formData.marketingAccepted}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 text-gold-metallic border-timberwolf/30 rounded"
          />
          <span className="text-sm text-night">
            J'accepte de recevoir des communications marketing (optionnel)
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-night mb-2">
            Créer votre compte
          </h1>
          <p className="text-night/70">
            Rejoignez Sama Naffa et commencez votre parcours financier
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-gold-metallic border-gold-metallic text-night'
                      : isActive
                        ? 'border-gold-metallic text-gold-metallic bg-white'
                        : 'border-timberwolf/40 text-timberwolf/40 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-gold-metallic' : 'bg-timberwolf/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.id} className="text-xs text-center text-night/60 max-w-[120px]">
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-night">
              {steps[currentStep - 1].title}
            </h2>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-timberwolf/20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-timberwolf/50 cursor-not-allowed'
                  : 'text-night hover:bg-timberwolf/10'
              }`}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  validateStep(currentStep)
                    ? 'bg-gold-metallic text-night hover:bg-gold-metallic/90'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                <span>Suivant</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep(4) || isLoading}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  validateStep(4) && !isLoading
                    ? 'bg-gold-metallic text-night hover:bg-gold-metallic/90'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-night/30 border-t-night rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <CheckCircleIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
