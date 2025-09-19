'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelection, getInitialDepositFromSelection, getMonthlyGoalFromSelection } from '../../lib/selection-context';
import {
  UserIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface FormData {
  // Step 1: Personal & Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  
  // Step 2: KYC & Identity Verification
  address: string;
  city: string;
  occupation: string;
  monthlyIncome: string;
  idType: 'cni' | 'passport' | 'driver_license';
  idNumber: string;
  idFrontImage: File | null;
  idBackImage: File | null;
  selfieImage: File | null;
  
  // Step 3: Account Setup & Security
  initialDeposit: string;
  monthlyGoal: string;
  password: string;
  confirmPassword: string;
  pin: string;
  confirmPin: string;
  
  // Agreements (moved to final step for better flow)
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { selectionData } = useSelection();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    occupation: '',
    monthlyIncome: '',
    idType: 'cni',
    idNumber: '',
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    initialDeposit: '',
    monthlyGoal: '',
    password: '',
    confirmPassword: '',
    pin: '',
    confirmPin: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false
  });

  // Pre-fill form data based on selection
  useEffect(() => {
    if (selectionData) {
      setFormData(prev => ({
        ...prev,
        initialDeposit: getInitialDepositFromSelection(selectionData),
        monthlyGoal: getMonthlyGoalFromSelection(selectionData),
      }));
    }
  }, [selectionData]);

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: UserIcon, description: 'Nom, email, téléphone' },
    { id: 2, title: 'Vérification KYC', icon: IdentificationIcon, description: 'Identité et documents' },
    { id: 3, title: 'Configuration du compte', icon: ShieldCheckIcon, description: 'Sécurité et finalisation' }
  ];

  const getStepValidationStatus = (step: number) => {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
      2: ['address', 'city', 'occupation', 'monthlyIncome', 'idNumber'],
      3: ['initialDeposit', 'password', 'confirmPassword', 'pin', 'confirmPin']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    const hasErrors = fields.some(field => errors[field]);
    const allFilled = fields.every(field => formData[field as keyof FormData]);
    
    if (hasErrors) return 'error';
    if (allFilled) return 'valid';
    return 'pending';
  };

  // Validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) {
          return `${name === 'firstName' ? 'Prénom' : 'Nom'} doit contenir au moins 2 caractères`;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return `${name === 'firstName' ? 'Prénom' : 'Nom'} ne peut contenir que des lettres`;
        }
        return '';
      
      case 'email':
        if (!value) return 'Email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format d\'email invalide';
        }
        return '';
      
      case 'phone':
        if (!value) return 'Numéro de téléphone est requis';
        const phoneRegex = /^(\+221\s?)?[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Format de téléphone invalide (ex: 77 123 45 67)';
        }
        return '';
      
      case 'dateOfBirth':
        if (!value) return 'Date de naissance est requise';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
        
        if (actualAge < 18) {
          return 'Vous devez avoir au moins 18 ans pour créer un compte';
        }
        if (birthDate > today) {
          return 'Date de naissance invalide';
        }
        return '';
      
      case 'address':
        if (!value || value.trim().length < 5) {
          return 'Adresse doit contenir au moins 5 caractères';
        }
        return '';
      
      case 'city':
        if (!value) return 'Ville est requise';
        return '';
      
      case 'occupation':
        if (!value) return 'Profession est requise';
        return '';
      
      case 'monthlyIncome':
        if (!value) return 'Revenus mensuels sont requis';
        return '';
      
      case 'idNumber':
        if (!value) return 'Numéro de document est requis';
        if (value.length < 5) {
          return 'Numéro de document trop court';
        }
        return '';
      
      case 'password':
        if (!value) return 'Mot de passe est requis';
        if (value.length < 8) {
          return 'Mot de passe doit contenir au moins 8 caractères';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
        }
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Confirmation du mot de passe est requise';
        if (value !== formData.password) {
          return 'Les mots de passe ne correspondent pas';
        }
        return '';
      
      case 'pin':
        if (!value) return 'Code PIN est requis';
        if (!/^\d{4}$/.test(value)) {
          return 'Code PIN doit contenir exactement 4 chiffres';
        }
        return '';
      
      case 'confirmPin':
        if (!value) return 'Confirmation du PIN est requise';
        if (value !== formData.pin) {
          return 'Les codes PIN ne correspondent pas';
        }
        return '';
      
      case 'initialDeposit':
        if (!value) return 'Dépôt initial est requis';
        return '';
      
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate field on change
    const error = validateField(name, type === 'checkbox' ? checked : value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('221')) {
      return cleaned.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
    } else if (cleaned.startsWith('77') || cleaned.startsWith('78') || cleaned.startsWith('70') || cleaned.startsWith('76')) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    return value;
  };

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  const validateStep = (step: number): boolean => {
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
      2: ['address', 'city', 'occupation', 'monthlyIncome', 'idNumber'],
      3: ['initialDeposit', 'password', 'confirmPassword', 'pin', 'confirmPin']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    
    // Check if all required fields are filled and valid
    for (const field of fields) {
      if (!formData[field as keyof FormData]) return false;
      if (errors[field]) return false;
    }

    // Additional checks for specific steps
    if (step === 2) {
      if (!formData.idFrontImage || !formData.selfieImage) return false;
    }
    
    if (step === 3) {
      if (formData.password !== formData.confirmPassword) return false;
      if (formData.pin !== formData.confirmPin) return false;
      if (!formData.termsAccepted || !formData.privacyAccepted) return false;
    }

    return true;
  };

  const handleNext = () => {
    // Mark all fields in current step as touched to show validation errors
    const stepFields = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'],
      2: ['address', 'city', 'occupation', 'monthlyIncome', 'idNumber'],
      3: ['initialDeposit', 'password', 'confirmPassword', 'pin', 'confirmPin']
    };

    const fields = stepFields[currentStep as keyof typeof stepFields] || [];
    const newTouched = { ...touched };
    fields.forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields in current step
    const newErrors = { ...errors };
    fields.forEach(field => {
      const value = formData[field as keyof FormData];
      newErrors[field] = validateField(field, value);
    });
    setErrors(newErrors);

    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);

      // Store user data and authentication state
      const userData = {
        ...formData,
        userId: 'user_' + Math.floor(Math.random() * 1000000),
        registrationDate: new Date().toISOString(),
        isNewUser: true,
        kycStatus: 'completed', // KYC is now completed during registration
        kycCompletionDate: new Date().toISOString(),
        accountStatus: 'active', // Account is immediately active
        selectionData: selectionData // Include the original selection data
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('userSource', 'registration'); // Track how user got here

      // Trigger storage event to update navigation
      window.dispatchEvent(new Event('storage'));
      router.push('/portal');
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-gold-metallic/10 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserIcon className="w-5 h-5 text-gold-metallic" />
          <h3 className="font-semibold text-night">Informations de base</h3>
        </div>
        <p className="text-sm text-night/70">Renseignez vos informations personnelles (1-2 minutes)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Prénom *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('firstName') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            placeholder="Amadou"
            required
            autoComplete="given-name"
          />
          {getFieldError('firstName') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('firstName')}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Nom de famille *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('lastName') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            placeholder="Diallo"
            required
            autoComplete="family-name"
          />
          {getFieldError('lastName') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('lastName')}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Adresse email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('email') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="amadou.diallo@email.com"
          required
          autoComplete="email"
        />
        {getFieldError('email') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('email')}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Numéro de téléphone *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => {
            const formatted = formatPhoneNumber(e.target.value);
            setFormData(prev => ({ ...prev, phone: formatted }));
            const error = validateField('phone', formatted);
            setErrors(prev => ({ ...prev, phone: error }));
          }}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('phone') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="77 123 45 67"
          required
          autoComplete="tel"
        />
        <p className="text-xs text-night/60 mt-1">Format: 77 XXX XX XX ou +221 XX XXX XX XX</p>
        {getFieldError('phone') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('phone')}
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Date de naissance *</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('dateOfBirth') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          required
          max={(() => {
            const today = new Date();
            const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            return eighteenYearsAgo.toISOString().split('T')[0];
          })()}
          autoComplete="bday"
        />
        <p className="text-xs text-night/60 mt-1">Vous devez avoir au moins 18 ans</p>
        {getFieldError('dateOfBirth') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('dateOfBirth')}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* KYC Progress indicator */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <IdentificationIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-night">Vérification KYC</h3>
        </div>
        <p className="text-sm text-night/70">Conformité réglementaire BCEAO - Vérification d'identité (2-3 minutes)</p>
      </div>

      {/* Address and Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Ville de résidence *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('city') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            required
          >
            <option value="">Sélectionnez votre ville</option>
            <option value="Dakar">Dakar</option>
            <option value="Thiès">Thiès</option>
            <option value="Saint-Louis">Saint-Louis</option>
            <option value="Kaolack">Kaolack</option>
            <option value="Ziguinchor">Ziguinchor</option>
            <option value="Diourbel">Diourbel</option>
            <option value="Tambacounda">Tambacounda</option>
            <option value="Louga">Louga</option>
            <option value="Autre">Autre</option>
          </select>
          {getFieldError('city') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('city')}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Quartier/Commune *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('address') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            placeholder="Ex: Plateau, Medina, HLM..."
            required
          />
          {getFieldError('address') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('address')}
            </p>
          )}
        </div>
      </div>

      {/* Professional Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Profession *</label>
          <select
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('occupation') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            required
          >
            <option value="">Sélectionnez votre profession</option>
            <option value="Salarié">Employé/Salarié</option>
            <option value="Fonctionnaire">Fonctionnaire</option>
            <option value="Commerçant">Commerçant</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Artisan">Artisan</option>
            <option value="Agriculteur">Agriculteur</option>
            <option value="Retraité">Retraité</option>
            <option value="Autre">Autre</option>
          </select>
          {getFieldError('occupation') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('occupation')}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Revenus mensuels *</label>
          <select
            name="monthlyIncome"
            value={formData.monthlyIncome}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('monthlyIncome') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            required
          >
            <option value="">Sélectionnez vos revenus</option>
            <option value="< 100,000">Moins de 100,000 FCFA</option>
            <option value="100,000 - 250,000">100,000 - 250,000 FCFA</option>
            <option value="250,000 - 500,000">250,000 - 500,000 FCFA</option>
            <option value="500,000 - 1,000,000">500,000 - 1,000,000 FCFA</option>
            <option value="> 1,000,000">Plus de 1,000,000 FCFA</option>
          </select>
          {getFieldError('monthlyIncome') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('monthlyIncome')}
            </p>
          )}
        </div>
      </div>

      {/* Identity Document Section */}
      <div className="border-2 border-dashed border-gold-metallic/30 rounded-xl p-6 bg-gold-metallic/5">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          Pièce d'identité
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Type de document *</label>
            <select
              name="idType"
              value={formData.idType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
              required
            >
              <option value="cni">Carte Nationale d'Identité</option>
              <option value="passport">Passeport</option>
              <option value="driver_license">Permis de conduire</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Numéro du document *</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                hasFieldError('idNumber') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-timberwolf/30'
              }`}
              placeholder="Ex: 1234567890123"
              required
            />
            {getFieldError('idNumber') && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getFieldError('idNumber')}
              </p>
            )}
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Front of ID */}
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Recto du document *</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'idFrontImage')}
                className="hidden"
                id="idFront"
                required
              />
              <label
                htmlFor="idFront"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idFrontImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                {formData.idFrontImage ? (
                  <>
                    <CheckCircleIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Recto téléchargé</span>
                  </>
                ) : (
                  <>
                    <CameraIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Prendre une photo</span>
                    <span className="text-xs">ou sélectionner un fichier</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Back of ID (optional for some documents) */}
          <div>
            <label className="block text-sm font-semibold text-night mb-2">
              Verso du document {formData.idType === 'cni' ? '*' : '(optionnel)'}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'idBackImage')}
                className="hidden"
                id="idBack"
              />
              <label
                htmlFor="idBack"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idBackImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                {formData.idBackImage ? (
                  <>
                    <CheckCircleIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Verso téléchargé</span>
                  </>
                ) : (
                  <>
                    <CameraIcon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Prendre une photo</span>
                    <span className="text-xs">ou sélectionner un fichier</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selfie Verification */}
      <div className="border-2 border-dashed border-blue-400/30 rounded-xl p-6 bg-blue-50">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <CameraIcon className="w-5 h-5" />
          Vérification biométrique
        </h4>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'selfieImage')}
              className="hidden"
              id="selfie"
              required
            />
            <label
              htmlFor="selfie"
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                formData.selfieImage 
                  ? 'border-green-400 bg-green-50 text-green-700' 
                  : 'border-blue-400/50 bg-blue-50 hover:bg-blue-100 text-night/70'
              }`}
            >
              {formData.selfieImage ? (
                <>
                  <CheckCircleIcon className="w-12 h-12 mb-2" />
                  <span className="text-sm font-medium">Selfie téléchargé</span>
                </>
              ) : (
                <>
                  <CameraIcon className="w-12 h-12 mb-2" />
                  <span className="text-lg font-medium">Prendre un selfie *</span>
                  <span className="text-sm text-center px-4">Tenez votre pièce d'identité à côté de votre visage</span>
                </>
              )}
            </label>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Conseils pour un bon selfie :</p>
                <ul className="text-xs space-y-1">
                  <li>• Éclairage naturel de face</li>
                  <li>• Visage et document bien visibles</li>
                  <li>• Pas de lunettes de soleil</li>
                  <li>• Image nette et non floue</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Final Step Progress indicator */}
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-night">Configuration finale</h3>
        </div>
        <p className="text-sm text-night/70">Sécurité du compte et finalisation (1 minute)</p>
      </div>

      {/* Selection Summary */}
      {selectionData && (
        <div className="p-4 bg-gold-metallic/5 rounded-xl border border-gold-metallic/20 mb-6">
          <h4 className="text-lg font-semibold text-night mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-gold-metallic" />
            Votre sélection {selectionData.type === 'sama-naffa' ? 'Sama Naffa' : 'APE'}
          </h4>
          {selectionData.type === 'sama-naffa' ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Objectif:</span>
                  <span className="font-medium text-night">{selectionData.objective}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium text-night">{selectionData.duration} ans</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mensuel:</span>
                  <span className="font-medium text-night">{selectionData.monthlyAmount.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capital projeté:</span>
                  <span className="font-bold text-gold-metallic">{selectionData.projectedAmount.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tranche:</span>
                  <span className="font-medium text-night">Tranche {selectionData.trancheId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium text-night">{selectionData.duration}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux:</span>
                  <span className="font-bold text-gold-metallic">{selectionData.rate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valeur nominale:</span>
                  <span className="font-medium text-night">{selectionData.nominalValue}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Account Configuration */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-gray-50/50">
        <h4 className="font-semibold text-night mb-4">Configuration du compte</h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-night mb-2">Dépôt initial *</label>
              <select
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                  hasFieldError('initialDeposit') 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-timberwolf/30'
                }`}
                required
              >
                <option value="">Choisir le montant</option>
                <option value="25000">25,000 FCFA</option>
                <option value="50000">50,000 FCFA</option>
                <option value="100000">100,000 FCFA</option>
                <option value="250000">250,000 FCFA</option>
                <option value="500000">500,000 FCFA</option>
                <option value="custom">Montant personnalisé</option>
              </select>
              {getFieldError('initialDeposit') && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getFieldError('initialDeposit')}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-night mb-2">Objectif mensuel (optionnel)</label>
              <input
                type="number"
                name="monthlyGoal"
                value={formData.monthlyGoal}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
                placeholder="Ex: 50,000"
              />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Types de comptes disponibles</h5>
                <p className="text-sm text-blue-800">
                  Une fois votre compte créé, vous pourrez accéder à votre portail et choisir entre :
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• <strong>Sama Naffa</strong> - Compte d'épargne avec objectifs personnalisés</li>
                  <li>• <strong>Emprunt Obligataire</strong> - Investissement dans les obligations d'État</li>
                  <li>• <strong>Compte Complet</strong> - Accès aux deux services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Setup */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-blue-50/50">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5" />
          Sécurité du compte
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Mot de passe *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                hasFieldError('password') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-timberwolf/30'
              }`}
              placeholder="Minimum 8 caractères"
              required
              minLength={8}
            />
            <p className="text-xs text-night/60 mt-1">Lettres, chiffres et symboles recommandés</p>
            {getFieldError('password') && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getFieldError('password')}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Confirmer le mot de passe *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                hasFieldError('confirmPassword') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-timberwolf/30'
              }`}
              placeholder="Retaper le mot de passe"
              required
            />
            {getFieldError('confirmPassword') && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getFieldError('confirmPassword')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Code PIN (4 chiffres) *</label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest ${
                hasFieldError('pin') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-timberwolf/30'
              }`}
              placeholder="••••"
              required
              maxLength={4}
              pattern="[0-9]{4}"
            />
            <p className="text-xs text-night/60 mt-1">Pour les transactions rapides</p>
            {getFieldError('pin') && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getFieldError('pin')}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Confirmer le PIN *</label>
            <input
              type="password"
              name="confirmPin"
              value={formData.confirmPin}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest ${
                hasFieldError('confirmPin') 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-timberwolf/30'
              }`}
              placeholder="••••"
              required
              maxLength={4}
              pattern="[0-9]{4}"
            />
            {getFieldError('confirmPin') && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <ExclamationTriangleIcon className="w-4 h-4" />
                {getFieldError('confirmPin')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terms and Agreements */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-gray-50/50">
        <h4 className="font-semibold text-night mb-4">Conditions d'utilisation</h4>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-gold-metallic border-timberwolf/30 rounded focus:ring-2 focus:ring-gold-metallic"
              required
            />
            <div className="text-sm">
              <span className="text-night font-medium">J'accepte les </span>
              <button type="button" className="text-gold-metallic hover:underline font-medium">conditions générales d'utilisation</button>
              <span className="text-night font-medium"> et la </span>
              <button type="button" className="text-gold-metallic hover:underline font-medium">politique de confidentialité</button>
              <span className="text-red-500"> *</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="privacyAccepted"
              checked={formData.privacyAccepted}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-gold-metallic border-timberwolf/30 rounded focus:ring-2 focus:ring-gold-metallic"
              required
            />
            <div className="text-sm">
              <span className="text-night font-medium">J'autorise le traitement de mes données personnelles conformément à la réglementation BCEAO</span>
              <span className="text-red-500"> *</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="marketingAccepted"
              checked={formData.marketingAccepted}
              onChange={handleInputChange}
              className="mt-1 w-5 h-5 text-gold-metallic border-timberwolf/30 rounded focus:ring-2 focus:ring-gold-metallic"
            />
            <div className="text-sm text-night">
              J'accepte de recevoir des communications marketing (optionnel)
            </div>
          </label>
        </div>
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
              
              const validationStatus = getStepValidationStatus(step.id);
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white shadow-lg scale-110'
                      : isActive
                        ? validationStatus === 'error'
                          ? 'border-red-400 text-red-400 bg-red-50 shadow-md scale-105'
                          : validationStatus === 'valid'
                            ? 'border-green-400 text-green-400 bg-green-50 shadow-md scale-105'
                            : 'border-gold-metallic text-gold-metallic bg-gold-metallic/10 shadow-md scale-105'
                        : validationStatus === 'error'
                          ? 'border-red-300 text-red-300 bg-red-50'
                          : validationStatus === 'valid'
                            ? 'border-green-300 text-green-300 bg-green-50'
                            : 'border-timberwolf/40 text-timberwolf/40 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-7 h-7" />
                    ) : validationStatus === 'error' ? (
                      <ExclamationTriangleIcon className="w-6 h-6" />
                    ) : (
                      <IconComponent className="w-6 h-6" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-6 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-green-500' : 'bg-timberwolf/20'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              const validationStatus = getStepValidationStatus(step.id);
              
              return (
                <div key={step.id} className={`text-center max-w-[140px] transition-all duration-300 ${
                  isActive 
                    ? validationStatus === 'error'
                      ? 'text-red-500 font-semibold'
                      : validationStatus === 'valid'
                        ? 'text-green-600 font-semibold'
                        : 'text-gold-metallic font-semibold'
                    : isCompleted 
                      ? 'text-green-600 font-medium' 
                      : validationStatus === 'error'
                        ? 'text-red-400 font-medium'
                        : validationStatus === 'valid'
                          ? 'text-green-500 font-medium'
                          : 'text-night/60'
                }`}>
                  <div className="text-sm font-medium mb-1">{step.title}</div>
                  <div className="text-xs text-night/50">{step.description}</div>
                </div>
              );
            })}
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

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-timberwolf/20">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                currentStep === 1
                  ? 'text-timberwolf/50 cursor-not-allowed'
                  : 'text-night hover:bg-timberwolf/10 hover:shadow-sm'
              }`}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Précédent</span>
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  validateStep(currentStep)
                    ? 'bg-gradient-to-r from-gold-dark to-gold-metallic text-night hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                <span>Étape suivante</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep(3) || isLoading}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  validateStep(3) && !isLoading
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création du compte...</span>
                  </>
                ) : (
                  <>
                    <span>🎉 Créer mon compte</span>
                    <CheckCircleIcon className="w-6 h-6" />
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
