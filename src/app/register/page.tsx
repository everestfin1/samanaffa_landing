'use client';

import { useState, useEffect, useRef } from 'react';
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
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface FormData {
  // Step 1: Personal Information
  civilite: 'mr' | 'mme' | 'mlle';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profession: string;
  domaineActivite: string;
  
  // Step 2: Identity Verification
  nationality: string;
  idType: 'cni' | 'passport';
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'masculin' | 'feminin';
  
  // Step 3: Address and Referral
  country: string;
  region: string;
  district: string;
  address: string;
  hasReferralCode: boolean;
  referralCode: string;
  
  // Step 4: Identity Validation
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;
  
  // Step 5: Terms and Security
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
  
  // PIN Setup (separate screen)
  pin: string;
  confirmPin: string;
  
  // Account Configuration (from selection)
  initialDeposit: string;
  monthlyGoal: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { selectionData } = useSelection();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    civilite: 'mr',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profession: '',
    domaineActivite: '',
    
    // Step 2
    nationality: 'Sénégal',
    idType: 'cni',
    idNumber: '',
    idIssueDate: '',
    idExpiryDate: '',
    dateOfBirth: '',
    placeOfBirth: '',
    gender: 'masculin',
    
    // Step 3
    country: 'Sénégal',
    region: 'Dakar',
    district: '',
    address: '',
    hasReferralCode: false,
    referralCode: '',
    
    // Step 4
    selfieImage: null,
    idFrontImage: null,
    idBackImage: null,
    
    // Step 5
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    signature: '',
    
    // PIN Setup
    pin: '',
    confirmPin: '',
    
    // Account Configuration
    initialDeposit: '',
    monthlyGoal: ''
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
    { id: 1, title: 'Informations personnelles', icon: UserIcon, description: 'Civilité, nom, téléphone, email, profession' },
    { id: 2, title: 'Vérification d\'identité', icon: IdentificationIcon, description: 'Document d\'identité et dates' },
    { id: 3, title: 'Adresse et parrainage', icon: DocumentTextIcon, description: 'Adresse complète et code parrainage' },
    { id: 4, title: 'Validation d\'identité', icon: CameraIcon, description: 'Selfie et scan de documents' },
    { id: 5, title: 'Conditions et signature', icon: ShieldCheckIcon, description: 'Termes et signature' }
  ];

  const getStepValidationStatus = (step: number) => {
    const stepFields = {
      1: ['civilite', 'firstName', 'lastName', 'phone', 'email', 'profession'],
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth', 'gender'],
      3: ['country', 'region', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage'],
      5: ['termsAccepted', 'privacyAccepted']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    const hasErrors = fields.some(field => errors[field]);
    const allFilled = fields.every(field => {
      const value = formData[field as keyof FormData];
      return value !== null && value !== undefined && value !== '';
    });
    
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
      
      case 'profession':
        if (!value) return 'Profession est requise';
        return '';
      
      case 'domaineActivite':
        if (!value) return 'Domaine d\'activité est requis';
        return '';
      
      case 'idNumber':
        if (!value) return 'Numéro de pièce est requis';
        if (value.length < 5) {
          return 'Numéro de pièce trop court';
        }
        return '';
      
      case 'idIssueDate':
        if (!value) return 'Date d\'émission est requise';
        return '';
      
      case 'idExpiryDate':
        if (!value) return 'Date d\'expiration est requise';
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
      
      case 'placeOfBirth':
        if (!value) return 'Lieu de naissance est requis';
        return '';
      
      case 'address':
        if (!value || value.trim().length < 5) {
          return 'Adresse doit contenir au moins 5 caractères';
        }
        return '';
      
      case 'district':
        if (!value) return 'District/Commune est requis';
        return '';
      
      case 'referralCode':
        if (formData.hasReferralCode && !value) {
          return 'Code de parrainage est requis';
        }
        return '';
      
      case 'pin':
        if (!value) return 'Code PIN est requis';
        if (!/^\d{6}$/.test(value)) {
          return 'Code PIN doit contenir exactement 6 chiffres';
        }
        return '';
      
      case 'confirmPin':
        if (!value) return 'Confirmation du PIN est requise';
        if (value !== formData.pin) {
          return 'Les codes PIN ne correspondent pas';
        }
        return '';
      
      case 'signature':
        if (!value) return 'Signature est requise';
        return '';
      
      case 'termsAccepted':
        if (!value) return 'Vous devez accepter les conditions générales';
        return '';
      
      case 'privacyAccepted':
        if (!value) return 'Vous devez accepter la politique de confidentialité';
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

  // Signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Save signature to form data
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL();
        setFormData(prev => ({
          ...prev,
          signature: signatureData
        }));
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData(prev => ({
      ...prev,
      signature: ''
    }));
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing properties
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [currentStep]);

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
      1: ['civilite', 'firstName', 'lastName', 'phone', 'email', 'profession'],
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth', 'gender'],
      3: ['country', 'region', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    
    // Check if all required fields are filled and valid
    for (const field of fields) {
      const value = formData[field as keyof FormData];
      if (!value || value === '') return false;
      if (errors[field]) return false;
    }

    // Additional checks for specific steps
    if (step === 3) {
      if (formData.hasReferralCode && !formData.referralCode) return false;
    }
    
    if (step === 4) {
      if (!formData.idBackImage && formData.idType === 'cni') return false;
    }

    return true;
  };

  const handleNext = () => {
    // Mark all fields in current step as touched to show validation errors
    const stepFields = {
      1: ['civilite', 'firstName', 'lastName', 'phone', 'email', 'profession'],
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth', 'gender'],
      3: ['country', 'region', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
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
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

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
          <h3 className="font-semibold text-night">Informations personnelles</h3>
        </div>
        <p className="text-sm text-night/70">Étape 1 sur 5 - Renseignez vos informations de base</p>
      </div>

      {/* Civilité */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Civilité *</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'mr', label: 'Mr' },
            { value: 'mme', label: 'Mme' },
            { value: 'mlle', label: 'Mlle' }
          ].map((option) => (
            <label key={option.value} className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
              <input
                type="radio"
                name="civilite"
                value={option.value}
                checked={formData.civilite === option.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className={`font-medium ${formData.civilite === option.value ? 'text-gold-metallic' : 'text-night/70'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Nom et Prénom */}
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
          <label className="block text-sm font-semibold text-night mb-2">Nom *</label>
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
      
      {/* Téléphone */}
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

      {/* Email */}
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

      {/* Profession */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Profession *</label>
        <select
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('profession') 
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
        {getFieldError('profession') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('profession')}
          </p>
        )}
      </div>

      {/* Domaine d'activité */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Domaine d'activité *</label>
        <input
          type="text"
          name="domaineActivite"
          value={formData.domaineActivite}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('domaineActivite') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Informatique, Commerce, Santé..."
          required
        />
        {getFieldError('domaineActivite') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('domaineActivite')}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <IdentificationIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-night">Vérification d'identité</h3>
        </div>
        <p className="text-sm text-night/70">Étape 2 sur 5 - Informations de votre document d'identité</p>
      </div>

      {/* Nationalité */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Nationalité *</label>
        <select
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
          required
        >
          <option value="Sénégal">Sénégal</option>
          <option value="Mali">Mali</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          <option value="Niger">Niger</option>
          <option value="Guinée">Guinée</option>
          <option value="Bénin">Bénin</option>
          <option value="Togo">Togo</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Type de pièce */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Type de pièce *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { value: 'cni', label: 'Carte Nationale d\'Identité' },
            { value: 'passport', label: 'Passeport' }
          ].map((option) => (
            <label key={option.value} className="flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
              <input
                type="radio"
                name="idType"
                value={option.value}
                checked={formData.idType === option.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className={`text-sm ${formData.idType === option.value ? 'text-gold-metallic font-medium' : 'text-night/70'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Numéro de la pièce */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Numéro de la pièce *</label>
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

      {/* Dates d'émission et d'expiration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Date d'émission *</label>
          <input
            type="date"
            name="idIssueDate"
            value={formData.idIssueDate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('idIssueDate') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            required
          />
          {getFieldError('idIssueDate') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('idIssueDate')}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-night mb-2">Date d'expiration *</label>
          <input
            type="date"
            name="idExpiryDate"
            value={formData.idExpiryDate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
              hasFieldError('idExpiryDate') 
                ? 'border-red-400 bg-red-50' 
                : 'border-timberwolf/30'
            }`}
            required
          />
          {getFieldError('idExpiryDate') && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {getFieldError('idExpiryDate')}
            </p>
          )}
        </div>
      </div>

      {/* Date de naissance */}
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

      {/* Lieu de naissance */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Lieu de naissance *</label>
        <input
          type="text"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('placeOfBirth') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Dakar, Thiès, Saint-Louis..."
          required
        />
        {getFieldError('placeOfBirth') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('placeOfBirth')}
          </p>
        )}
      </div>

      {/* Sexe */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Sexe *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'masculin', label: 'Masculin' },
            { value: 'feminin', label: 'Féminin' }
          ].map((option) => (
            <label key={option.value} className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={formData.gender === option.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className={`font-medium ${formData.gender === option.value ? 'text-gold-metallic' : 'text-night/70'}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <DocumentTextIcon className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-night">Adresse et parrainage</h3>
        </div>
        <p className="text-sm text-night/70">Étape 3 sur 5 - Votre adresse complète et code de parrainage</p>
      </div>

      {/* Pays de résidence */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Pays de résidence *</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
          required
        >
          <option value="Sénégal">Sénégal</option>
          <option value="Mali">Mali</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Côte d'Ivoire">Côte d'Ivoire</option>
          <option value="Niger">Niger</option>
          <option value="Guinée">Guinée</option>
          <option value="Bénin">Bénin</option>
          <option value="Togo">Togo</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      {/* Région */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Région *</label>
        <select
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-timberwolf/30 rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200"
          required
        >
          <option value="">Sélectionnez votre région</option>
          <option value="Dakar">Dakar</option>
          <option value="Thiès">Thiès</option>
          <option value="Saint-Louis">Saint-Louis</option>
          <option value="Kaolack">Kaolack</option>
          <option value="Ziguinchor">Ziguinchor</option>
          <option value="Diourbel">Diourbel</option>
          <option value="Tambacounda">Tambacounda</option>
          <option value="Louga">Louga</option>
          <option value="Kolda">Kolda</option>
          <option value="Kédougou">Kédougou</option>
          <option value="Sédhiou">Sédhiou</option>
          <option value="Matam">Matam</option>
          <option value="Kaffrine">Kaffrine</option>
          <option value="Fatick">Fatick</option>
        </select>
      </div>

      {/* District/Commune */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">District / Commune *</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
            hasFieldError('district') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Grand-Dakar, Sicap Liberté, Plateau..."
          required
        />
        {getFieldError('district') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('district')}
          </p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-semibold text-night mb-2">Adresse complète *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={3}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 resize-none ${
            hasFieldError('address') 
              ? 'border-red-400 bg-red-50' 
              : 'border-timberwolf/30'
          }`}
          placeholder="Ex: Villa 6550 Sicap Liberté 6, Rue de la République..."
          required
        />
        {getFieldError('address') && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            {getFieldError('address')}
          </p>
        )}
      </div>

      {/* Code de parrainage */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-gold-metallic/5">
        <h4 className="font-semibold text-night mb-4">Code de parrainage</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Avez-vous un code de parrainage ?</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true, label: 'Oui' },
                { value: false, label: 'Non' }
              ].map((option) => (
                <label key={option.label} className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-200 hover:bg-gold-metallic/10">
                  <input
                    type="radio"
                    name="hasReferralCode"
                    checked={formData.hasReferralCode === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasReferralCode: option.value }))}
                    className="sr-only"
                  />
                  <span className={`font-medium ${formData.hasReferralCode === option.value ? 'text-gold-metallic' : 'text-night/70'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {formData.hasReferralCode && (
            <div>
              <label className="block text-sm font-semibold text-night mb-2">Code de parrainage *</label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-all duration-200 ${
                  hasFieldError('referralCode') 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-timberwolf/30'
                }`}
                placeholder="Entrez votre code de parrainage"
                required={formData.hasReferralCode}
              />
              {getFieldError('referralCode') && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  {getFieldError('referralCode')}
                </p>
              )}
              <p className="text-xs text-night/60 mt-1">Le code de parrainage vous permet de bénéficier d'avantages exclusifs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-purple-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CameraIcon className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-night">Validation d'identité</h3>
        </div>
        <p className="text-sm text-night/70">Étape 4 sur 5 - Prenez un selfie et scannez vos documents</p>
      </div>

      {/* Selfie Verification */}
      <div className="border-2 border-dashed border-blue-400/30 rounded-xl p-6 bg-blue-50">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <CameraIcon className="w-5 h-5" />
          Validation de votre identité
        </h4>
        
        <div className="flex flex-col items-center">
          {/* Two options: Take photo or Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
            {/* Take Photo Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => handleFileChange(e, 'selfieImage')}
                className="hidden"
                id="selfie-camera"
                onClick={() => {
                  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                    console.log('Camera API available');
                  } else {
                    console.log('Camera API not available');
                    alert('Camera not available. Please ensure you have camera permissions and are using HTTPS.');
                  }
                }}
              />
              <label
                htmlFor="selfie-camera"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.selfieImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-blue-400/50 bg-blue-50 hover:bg-blue-100 text-night/70'
                }`}
              >
                <CameraIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Prendre une photo</span>
                <span className="text-xs text-center">Caméra frontale</span>
              </label>
            </div>

            {/* Upload File Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'selfieImage')}
                className="hidden"
                id="selfie-upload"
              />
              <label
                htmlFor="selfie-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.selfieImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-blue-400/50 bg-blue-50 hover:bg-blue-100 text-night/70'
                }`}
              >
                <CloudArrowUpIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Télécharger une photo</span>
                <span className="text-xs text-center">Depuis votre appareil</span>
              </label>
            </div>
          </div>

          {/* Status Display */}
          {formData.selfieImage && (
            <div className="w-full bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <span className="text-sm font-medium text-green-800">Selfie téléchargé avec succès</span>
            </div>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Conseils pour un bon selfie :</p>
                <ul className="text-xs space-y-1">
                  <li>• Éclairage naturel de face</li>
                  <li>• Visage bien visible</li>
                  <li>• Pas de lunettes de soleil</li>
                  <li>• Image nette et non floue</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Scanning */}
      <div className="border-2 border-dashed border-gold-metallic/30 rounded-xl p-6 bg-gold-metallic/5">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          Pièce d'identité nationale
        </h4>
        
        {/* Front of ID */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-night mb-3">Recto de la pièce *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Camera Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileChange(e, 'idFrontImage')}
                className="hidden"
                id="idFront-camera"
                onClick={() => {
                  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                    console.log('Camera API available for document capture');
                  } else {
                    console.log('Camera API not available');
                    alert('Camera not available. Please ensure you have camera permissions and are using HTTPS.');
                  }
                }}
              />
              <label
                htmlFor="idFront-camera"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idFrontImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                <CameraIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Prendre une photo</span>
                <span className="text-xs text-center">Caméra arrière</span>
              </label>
            </div>

            {/* Upload Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'idFrontImage')}
                className="hidden"
                id="idFront-upload"
              />
              <label
                htmlFor="idFront-upload"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idFrontImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                <CloudArrowUpIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Télécharger</span>
                <span className="text-xs text-center">Depuis l'appareil</span>
              </label>
            </div>
          </div>
          {formData.idFrontImage && (
            <div className="mt-2 text-center">
              <span className="text-xs text-green-600 font-medium">✓ Recto téléchargé</span>
            </div>
          )}
        </div>

        {/* Back of ID */}
        <div>
          <label className="block text-sm font-semibold text-night mb-3">
            Verso de la pièce {formData.idType === 'cni' ? '*' : '(optionnel)'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Camera Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileChange(e, 'idBackImage')}
                className="hidden"
                id="idBack-camera"
                onClick={() => {
                  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
                    console.log('Camera API available for document capture');
                  } else {
                    console.log('Camera API not available');
                    alert('Camera not available. Please ensure you have camera permissions and are using HTTPS.');
                  }
                }}
              />
              <label
                htmlFor="idBack-camera"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idBackImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                <CameraIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Prendre une photo</span>
                <span className="text-xs text-center">Caméra arrière</span>
              </label>
            </div>

            {/* Upload Option */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'idBackImage')}
                className="hidden"
                id="idBack-upload"
              />
              <label
                htmlFor="idBack-upload"
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.idBackImage 
                    ? 'border-green-400 bg-green-50 text-green-700' 
                    : 'border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70'
                }`}
              >
                <CloudArrowUpIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Télécharger</span>
                <span className="text-xs text-center">Depuis l'appareil</span>
              </label>
            </div>
          </div>
          {formData.idBackImage && (
            <div className="mt-2 text-center">
              <span className="text-xs text-green-600 font-medium">✓ Verso téléchargé</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-night">Conditions et signature</h3>
        </div>
        <p className="text-sm text-night/70">Étape 5 sur 5 - Acceptez les conditions et signez</p>
      </div>

      {/* Terms and Conditions */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-gray-50/50">
        <h4 className="font-semibold text-night mb-4">Termes & conditions</h4>
        
        <div className="bg-white border border-timberwolf/20 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
          <p className="text-sm text-night/80 leading-relaxed">
            <strong>Conditions générales d'ouverture et d'utilisation du service SAMA NAFFA</strong><br/><br/>
            Mandat de gestion - En acceptant ces conditions, vous confiez la gestion de votre épargne à Sama Naffa conformément aux réglementations BCEAO en vigueur. 
            Vous reconnaissez avoir pris connaissance des modalités de fonctionnement, des frais applicables et des risques associés à votre investissement. 
            Sama Naffa s'engage à respecter la confidentialité de vos données personnelles et à vous fournir un service transparent et sécurisé.
          </p>
        </div>

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
              <span className="text-night font-medium">J'accepte les conditions générales d'ouverture et d'utilisation du service SAMA NAFFA</span>
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

      {/* Signature */}
      <div className="border border-timberwolf/30 rounded-xl p-6 bg-blue-50/50">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <PencilIcon className="w-5 h-5" />
          Signature
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-night mb-2">Signez ci-dessous *</label>
            <div className="border-2 border-dashed border-timberwolf/30 rounded-xl p-4 bg-white relative">
              <canvas
                ref={canvasRef}
                className="w-full h-32 cursor-crosshair border border-timberwolf/20 rounded-lg relative z-10"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
              />
              {!formData.signature && (
                <div className="absolute inset-4 flex items-center justify-center pointer-events-none z-0">
                  <div className="text-center text-night/50">
                    <PencilIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Zone de signature</p>
                    <p className="text-xs">Utilisez votre souris ou votre doigt pour signer</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Signature Actions */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-2">
                {formData.signature && (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Signature enregistrée
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                Effacer
              </button>
            </div>
            
            <p className="text-xs text-night/60 mt-2">En signant, vous confirmez l'exactitude des informations fournies</p>
          </div>
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
          <div className="flex justify-center">
            <div className="flex justify-between w-full max-w-2xl">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                const validationStatus = getStepValidationStatus(step.id);
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1 relative">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
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
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : validationStatus === 'error' ? (
                        <ExclamationTriangleIcon className="w-4 h-4" />
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>
                    
                    {/* Connecting line to next step */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-1 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-timberwolf/20'
                      }`} style={{ transform: 'translateX(50%)', zIndex: -1 }} />
                    )}
                    
                    {/* Step Labels */}
                    <div className={`text-center mt-4 px-2 transition-all duration-300 ${
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
                      <div className="text-xs font-medium mb-1">{step.title}</div>
                      <div className="text-xs text-night/50 leading-tight">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
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
          {currentStep === 5 && renderStep5()}

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

            {currentStep < 5 ? (
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
                disabled={!validateStep(5) || isLoading}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  validateStep(5) && !isLoading
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
