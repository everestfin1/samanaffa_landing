'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { validateInternationalPhone } from '@/lib/utils';
import {
  UserIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CameraIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// Import registration step components
import Step1PersonalInfo from '@/components/registration/Step1PersonalInfo';
import Step2IdentityVerification from '@/components/registration/Step2IdentityVerification';
import Step3Address from '@/components/registration/Step3Address';
import Step4Documents from '@/components/registration/Step4Documents';
import Step5Terms from '@/components/registration/Step5Terms';
import OTPVerificationStep from '@/components/registration/OTPVerificationStep';
import type { FormData, Step } from '@/components/registration/types';

export default function RegisterPage() {
  const router = useRouter();
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
    statutEmploi: '',
    metiers: '',

    // Step 2
    nationality: 'Senegal',
    idType: 'cni',
    idNumber: '',
    idIssueDate: '',
    idExpiryDate: '',
    dateOfBirth: '',
    placeOfBirth: '',

    // Step 3
    country: 'Senegal',
    region: '',
    department: '',
    arrondissement: '',
    district: '',
    address: '',
    city: '',

    // Step 4
    selfieImage: null,
    idFrontImage: null,
    idBackImage: null,

    // Step 5
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    signature: '',
    signatureFile: null
  });

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: UserIcon, description: 'Civilité, nom, téléphone, email, statut d\'emploi' },
    { id: 2, title: 'Vérification d\'identité', icon: IdentificationIcon, description: 'Document d\'identité et dates' },
    { id: 3, title: 'Adresse', icon: DocumentTextIcon, description: 'Adresse complète' },
    { id: 4, title: 'Documents', icon: CameraIcon, description: 'Selfie et documents d\'identité' },
    { id: 5, title: 'Conditions et signature', icon: ShieldCheckIcon, description: 'Termes et signature électronique' },
    { id: 6, title: 'Vérification finale', icon: CheckCircleIcon, description: 'Code de vérification et création du compte' }
  ];



  // Fixed validation functions
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || typeof value !== 'string' || value.trim().length < 2) {
          return `${name === 'firstName' ? 'Prénom' : 'Nom'} doit contenir au moins 2 caractères`;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
          return `${name === 'firstName' ? 'Prénom' : 'Nom'} ne peut contenir que des lettres`;
        }
        return '';

      case 'email':
        if (!value || typeof value !== 'string') return 'Email est requis';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format d\'email invalide';
        }
        return '';

      case 'phone':
        // Don't validate phone here - let PhoneInput component handle it
        // This will be controlled by onValidationChange callback
        return '';

      case 'statutEmploi':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Statut d\'emploi est requis';
        return '';

      case 'metiers':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Métier est requis';
        return '';


      case 'idNumber':
        if (!value || typeof value !== 'string') return 'Numéro de pièce est requis';

        // Specific validation for Senegalese IDs
        if (formData.nationality === 'Senegal') {
          if (formData.idType === 'cni') {
            // National ID card: must be exactly 13 digits
            if (!/^[0-9]{13}$/.test(value)) {
              return 'La carte d\'identité nationale doit contenir exactement 13 chiffres';
            }
          } else if (formData.idType === 'passport') {
            // Passport: must be exactly 9 alphanumeric characters
            if (!/^[A-Za-z0-9]{9}$/.test(value)) {
              return 'Le passeport doit contenir exactement 9 caractères alphanumériques';
            }
          }
        } else {
          // For other nationalities, keep basic validation
          if (value.length < 5) {
            return 'Numéro de pièce trop court';
          }
        }
        return '';

      case 'idIssueDate':
        if (!value || typeof value !== 'string') return 'Date d\'émission est requise';
        return '';

      case 'idExpiryDate':
        if (!value || typeof value !== 'string') return 'Date d\'expiration est requise';

        const expiryDate = new Date(value);
        const now = new Date();

        // Expiry date must be in the future to ensure document validity
        if (expiryDate <= now) {
          return 'La date d\'expiration doit être postérieure à la date actuelle (document non expiré)';
        }

        // Specific validity period checks for Senegalese IDs - calculate based on issue date
        if (formData.nationality === 'Senegal') {
          if (formData.idIssueDate) {
            const issueDate = new Date(formData.idIssueDate);

            if (formData.idType === 'cni') {
              // National ID card: max 10 years from issue date
              const maxExpiryDateCNI = new Date(issueDate);
              maxExpiryDateCNI.setFullYear(issueDate.getFullYear() + 10);
              if (expiryDate > maxExpiryDateCNI) {
                return 'La carte d\'identité nationale ne peut pas être valide plus de 10 ans après sa date d\'émission';
              }
            } else if (formData.idType === 'passport') {
              // Passport: max 5 years from issue date
              const maxExpiryDatePassport = new Date(issueDate);
              maxExpiryDatePassport.setFullYear(issueDate.getFullYear() + 5);
              if (expiryDate > maxExpiryDatePassport) {
                return 'Le passeport ne peut pas être valide plus de 5 ans après sa date d\'émission';
              }
            }
          } else {
            return 'Veuillez d\'abord saisir la date d\'émission';
          }
        }

        return '';

      case 'dateOfBirth':
        if (!value || typeof value !== 'string') return 'Date de naissance est requise';
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
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Lieu de naissance est requis';
        return '';

      case 'region':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Région est requise';
        return '';

      case 'address':
        if (!value || typeof value !== 'string' || value.trim().length < 5) {
          return 'Adresse doit contenir au moins 5 caractères';
        }
        return '';

      case 'department':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Département est requis';
        return '';

      case 'arrondissement':
        // Arrondissement is only required if the department has arrondissements
        // This validation will be handled by the Step3Address component
        return '';

      case 'district':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'District/Commune est requis';
        return '';


      case 'signature':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Signature est requise';
        return '';

      case 'termsAccepted':
        if (typeof value !== 'boolean' || !value) return 'Vous devez accepter les conditions générales';
        return '';

      case 'privacyAccepted':
        if (typeof value !== 'boolean' || !value) return 'Vous devez accepter la politique de confidentialité';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Clear region, department, arrondissement and district when country changes away from Senegal
      if (name === 'country' && value !== 'Senegal') {
        newData.region = '';
        newData.department = '';
        newData.arrondissement = '';
        newData.district = '';
      }

      // Clear department, arrondissement and district when region changes
      if (name === 'region') {
        newData.department = '';
        newData.arrondissement = '';
        newData.district = '';
      }

      // Clear arrondissement and district when department changes
      if (name === 'department') {
        newData.arrondissement = '';
        newData.district = '';
      }

      // Clear district when arrondissement changes
      if (name === 'arrondissement') {
        newData.district = '';
      }

      // Auto-calculate expiry date when ID type or issue date changes
      if (name === 'idType' || name === 'idIssueDate') {
        const currentIdType = name === 'idType' ? value : prev.idType;
        const currentIssueDate = name === 'idIssueDate' ? value : prev.idIssueDate;
        
        if (currentIssueDate && currentIdType) {
          const issueDate = new Date(currentIssueDate);
          const validityYears = currentIdType === 'cni' ? 10 : 5; // 10 years for CNI, 5 years for passport
          const expiryDate = new Date(issueDate);
          expiryDate.setFullYear(expiryDate.getFullYear() + validityYears);
          
          newData.idExpiryDate = expiryDate.toISOString().split('T')[0];
        }
      }

      return newData;
    });

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

    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
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
    // Build step 1 fields dynamically based on employment status
    const step1Fields = ['civilite', 'firstName', 'lastName', 'phone', 'email', 'statutEmploi', 'metiers'];

    const stepFields = {
      1: step1Fields,
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth'],
      3: ['country', 'region', 'department', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];

    // Check if all required fields are filled and valid
    for (const field of fields) {
      const value = formData[field as keyof FormData];

      // Handle validation based on field type
      if (field === 'selfieImage' || field === 'idFrontImage') {
        if (!(value instanceof File)) return false;
      }
      if (field === 'idBackImage' && formData.idType === 'cni') {
        if (!(value instanceof File)) return false;
      }
      if ((field === 'termsAccepted' || field === 'privacyAccepted') && (!value || typeof value !== 'boolean')) {
        return false;
      }
      if (field === 'signature' && (!value || typeof value !== 'string' || value.trim() === '')) {
        return false;
      }

      // For string fields, check if not empty
      if (typeof value === 'string' && value.trim() === '') {
        return false;
      }

      // Check for validation errors
      if (errors[field]) return false;
    }

    // Special validation for step 3 (address) - check arrondissement requirement
    if (step === 3 && formData.country === 'Senegal') {
      // Import the regions data to check if department has arrondissements
      // This is a simplified check - in a real app, you might want to move this logic
      // to a utility function or use the same functions from Step3Address
      try {
        const regionsSenegal = require('../../../regions_senegal.json');
        const regionData = regionsSenegal.find((region: any) => 
          region.name.toLowerCase() === formData.region.toLowerCase()
        );
        
        if (regionData) {
          const department = regionData.departements.find((dept: any) => 
            dept.name.toLowerCase() === formData.department.toLowerCase()
          );
          
          // If department has arrondissements, arrondissement field is required
          if (department && department.arrondissements && department.arrondissements.length > 0) {
            if (!formData.arrondissement || formData.arrondissement.trim() === '') {
              return false;
            }
          }
        }
      } catch (error) {
        console.error('Error validating arrondissement requirement:', error);
      }
    }

    return true;
  };


  const handleNext = async () => {
    // Mark all fields in current step as touched to show validation errors
    // Build step 1 fields dynamically based on employment status
    const step1Fields = ['civilite', 'firstName', 'lastName', 'phone', 'email', 'statutEmploi', 'metiers'];

    const stepFields = {
      1: step1Fields,
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth'],
      3: ['country', 'region', 'department', 'arrondissement', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
    };

    const fields = stepFields[currentStep as keyof typeof stepFields] || [];
    const newTouched = { ...touched };
    fields.forEach(field => {
      newTouched[field] = true;
      const value = formData[field as keyof FormData];
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    });
    setTouched(newTouched);

    if (validateStep(currentStep)) {
      // Special handling for step 1: Check email/phone availability before proceeding
      if (currentStep === 1) {
        setIsLoading(true);
        try {
          const response = await fetch('/api/auth/check-availability', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              phone: formData.phone
            }),
          });

          const data = await response.json();

          if (!data.available) {
            // Set errors for unavailable email/phone
            const newErrors = { ...errors };
            if (!data.emailAvailable) {
              newErrors.email = 'Cet email est déjà associé à un compte existant. Veuillez vous connecter ou utiliser un autre email.';
            }
            if (!data.phoneAvailable) {
              newErrors.phone = 'Ce numéro de téléphone est déjà associé à un compte existant. Veuillez vous connecter ou utiliser un autre numéro.';
            }
            setErrors(newErrors);
            return; // Don't proceed to next step
          }

          // If available, proceed to step 2
          setCurrentStep(2);
        } catch (error) {
          console.error('Error checking availability:', error);
          setErrors(prev => ({
            ...prev,
            general: 'Erreur de connexion. Veuillez réessayer.'
          }));
        } finally {
          setIsLoading(false);
        }
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 6));
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Memoized callback functions to prevent unnecessary re-renders
  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }));
    // Don't call validateField here since PhoneInput handles its own validation
  }, []);

  const handlePhoneValidationChange = useCallback((isValid: boolean, error?: string) => {
    // Update the error state based on PhoneInput's validation
    setErrors(prev => ({
      ...prev,
      phone: isValid ? '' : (error || 'Numéro de téléphone invalide')
    }));
    // Mark the field as touched when validation changes
    setTouched(prev => ({ ...prev, phone: true }));
  }, []);



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
            <div className="w-full max-w-2xl">
              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 bg-timberwolf/20 rounded-full h-2 mr-4">
                  <div 
                    className="bg-gradient-to-r from-gold-dark to-gold-metallic h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-night/70">
                  Étape {currentStep} sur {steps.length}
                </div>
              </div>
              
              {/* Current Step Title */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-night">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-sm text-night/60 mt-1">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10">

          {currentStep === 1 && (
            <Step1PersonalInfo
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              onPhoneChange={handlePhoneChange}
              onPhoneValidationChange={handlePhoneValidationChange}
            />
          )}
          {currentStep === 2 && (
            <Step2IdentityVerification
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          )}
          {currentStep === 3 && (
            <Step3Address
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
            />
          )}
          {currentStep === 4 && (
            <Step4Documents
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              onFileChange={handleFileChange}
            />
          )}
          {currentStep === 5 && (
            <Step5Terms
              formData={formData}
              errors={errors}
              touched={touched}
              onInputChange={handleInputChange}
              onSignatureChange={(signatureData: string) => {
                setFormData(prev => ({
                  ...prev,
                  signature: signatureData
                }));
                setErrors(prev => ({
                  ...prev,
                  signature: ''
                }));
              }}
              onSignatureFileChange={(signatureFile: File | null) => {
                setFormData(prev => ({
                  ...prev,
                  signatureFile: signatureFile
                }));
              }}
              onClearSignature={() => {
                setFormData(prev => ({
                  ...prev,
                  signature: '',
                  signatureFile: null
                }));
              }}
            />
          )}
          {currentStep === 6 && (
            <OTPVerificationStep
              formData={formData}
              onSuccess={() => {
                // Account created successfully, redirect to success page or dashboard
                router.push('/login?message=account_created');
              }}
            />
          )}

          {/* General Errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 mb-6">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-timberwolf/20">
            {currentStep < 6 && (
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
            )}

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                disabled={uploadingFiles || !validateStep(currentStep) || isLoading}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  validateStep(currentStep) && !uploadingFiles && !isLoading
                    ? 'bg-gradient-to-r from-gold-dark to-gold-metallic text-white hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                {uploadingFiles ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : isLoading && currentStep === 1 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Vérification de la disponibilité...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === 5 ? 'Continuer' : 'Étape suivante'}</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-night/70 text-sm">
            Déjà un Naffa?{' '}
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
  );
}
