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

  // New state for OTP verification step
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    // Step 1
    civilite: 'mr',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    statutEmploi: '',
    metiers: '',
    otpMethod: 'email', // Keep for UI purposes in Step 1

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
    region: 'Dakar',
    department: '',
    district: '',
    address: '',
    city: 'Dakar',

    // Step 4
    selfieImage: null,
    idFrontImage: null,
    idBackImage: null,
    otp: '',

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
    { id: 4, title: 'Documents & vérification', icon: CameraIcon, description: 'Selfie, documents et code OTP' },
    { id: 5, title: 'Conditions et signature', icon: ShieldCheckIcon, description: 'Termes, signature et finalisation' }
  ];

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

  const getStepValidationStatus = (step: number) => {
    // Build step 1 fields dynamically based on employment status
    const step1Fields = ['civilite', 'firstName', 'lastName', 'phone', 'email', 'statutEmploi', 'metiers', 'otpMethod'];

    const stepFields = {
      1: step1Fields,
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth'],
      3: ['country', 'region', 'department', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage', 'otp'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];
    const hasErrors = fields.some(field => errors[field]);
    const allFilled = fields.every(field => {
      const value = formData[field as keyof FormData];

      // Handle different field types properly
      if (field === 'otp') {
        return typeof value === 'string' && value.length === 6;
      }
      if (field === 'selfieImage' || field === 'idFrontImage' || field === 'idBackImage') {
        return value instanceof File;
      }
      if (field === 'termsAccepted' || field === 'privacyAccepted' || field === 'marketingAccepted') {
        return typeof value === 'boolean' && value === true;
      }

      // For string fields, check if not empty
      return typeof value === 'string' && value.trim() !== '';
    });

    if (hasErrors) return 'error';
    if (allFilled) return 'valid';
    return 'pending';
  };

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

      case 'address':
        if (!value || typeof value !== 'string' || value.trim().length < 5) {
          return 'Adresse doit contenir au moins 5 caractères';
        }
        return '';

      case 'department':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'Département est requis';
        return '';

      case 'district':
        if (!value || typeof value !== 'string' || value.trim() === '') return 'District/Commune est requis';
        return '';

      case 'otp':
        if (!value || typeof value !== 'string') return 'Code OTP est requis';
        if (value.length !== 6) {
          return 'Code OTP doit contenir exactement 6 chiffres';
        }
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

      // Clear region, department and district when country changes away from Senegal
      if (name === 'country' && value !== 'Senegal') {
        newData.region = '';
        newData.department = '';
        newData.district = '';
      }

      // Clear department and district when region changes (in case user switches from Dakar to another region)
      if (name === 'region') {
        newData.department = '';
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
    const step1Fields = ['civilite', 'firstName', 'lastName', 'phone', 'email', 'statutEmploi', 'metiers', 'otpMethod'];

    const stepFields = {
      1: step1Fields,
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth'],
      3: ['country', 'region', 'department', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage', 'otp'],
      5: ['termsAccepted', 'privacyAccepted', 'signature']
    };

    const fields = stepFields[step as keyof typeof stepFields] || [];

    // Check if all required fields are filled and valid
    for (const field of fields) {
      const value = formData[field as keyof FormData];

      // Handle validation based on field type
      if (field === 'otp' && (!value || typeof value !== 'string' || value.length !== 6)) {
        return false;
      }
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

    return true;
  };

  const handleSendOTP = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          type: 'register',
          method: formData.otpMethod
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        startOtpTimer();
      } else {
        setErrors(prev => ({
          ...prev,
          otp: data.error || 'Erreur lors de l\'envoi du code OTP'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        otp: 'Erreur de connexion. Veuillez réessayer.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;

    await handleSendOTP();
  };

  const handleNext = async () => {
    // Mark all fields in current step as touched to show validation errors
    // Build step 1 fields dynamically based on employment status
    const step1Fields = ['civilite', 'firstName', 'lastName', 'phone', 'email', 'statutEmploi', 'metiers', 'otpMethod'];

    const stepFields = {
      1: step1Fields,
      2: ['nationality', 'idType', 'idNumber', 'idIssueDate', 'idExpiryDate', 'dateOfBirth', 'placeOfBirth'],
      3: ['country', 'region', 'department', 'district', 'address'],
      4: ['selfieImage', 'idFrontImage', 'otp'],
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
      } else if (currentStep === 3) {
        // Send OTP before moving to step 4
        handleSendOTP().then(() => {
          setCurrentStep(4);
        });
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 5));
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

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsLoading(true);

    try {
      // First, register the user by calling verify-otp API directly
      const registrationResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          otp: formData.otp,
          type: 'register',
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            nationality: formData.nationality,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            region: formData.region,
            district: formData.district,
            placeOfBirth: formData.placeOfBirth,
            statutEmploi: formData.statutEmploi,
            metiers: formData.metiers,
            idType: formData.idType,
            idNumber: formData.idNumber,
            idIssueDate: formData.idIssueDate ? new Date(formData.idIssueDate) : null,
            idExpiryDate: formData.idExpiryDate ? new Date(formData.idExpiryDate) : null,
            civilite: formData.civilite,
            termsAccepted: formData.termsAccepted,
            privacyAccepted: formData.privacyAccepted,
            signature: formData.signature
          }
        }),
      });

      const registrationData = await registrationResponse.json();

      if (!registrationResponse.ok || !registrationData.success) {
        setErrors(prev => ({
          ...prev,
          general: registrationData.error || 'Erreur lors de la finalisation de l\'inscription'
        }));
        return;
      }

      // Registration successful, user is now created and accounts are set up
      // We can proceed with document upload

      // After successful registration, upload documents if any exist
      if (formData.selfieImage || formData.idFrontImage || formData.idBackImage || formData.signatureFile) {
        setUploadingFiles(true);
        
        // Get the user ID from the registration response
        const userId = registrationData.user?.id;
        if (!userId) {
          throw new Error('Impossible de récupérer l\'ID utilisateur');
        }

        // Upload each document separately
        const uploadPromises = [];

        if (formData.selfieImage) {
          const selfieFormData = new FormData();
          selfieFormData.append('file', formData.selfieImage);
          selfieFormData.append('userId', userId);
          selfieFormData.append('documentType', 'selfie');
          
          uploadPromises.push(
            fetch('/api/kyc/upload', {
              method: 'POST',
              body: selfieFormData,
            })
          );
        }

        if (formData.idFrontImage) {
          const idFrontFormData = new FormData();
          idFrontFormData.append('file', formData.idFrontImage);
          idFrontFormData.append('userId', userId);
          idFrontFormData.append('documentType', formData.idType === 'cni' ? 'national_id' : 'passport');
          
          uploadPromises.push(
            fetch('/api/kyc/upload', {
              method: 'POST',
              body: idFrontFormData,
            })
          );
        }

        if (formData.idBackImage && formData.idType === 'cni') {
          const idBackFormData = new FormData();
          idBackFormData.append('file', formData.idBackImage);
          idBackFormData.append('userId', userId);
          idBackFormData.append('documentType', 'national_id_back');
          
          uploadPromises.push(
            fetch('/api/kyc/upload', {
              method: 'POST',
              body: idBackFormData,
            })
          );
        }

        if (formData.signatureFile) {
          const signatureFormData = new FormData();
          signatureFormData.append('file', formData.signatureFile);
          signatureFormData.append('userId', userId);
          signatureFormData.append('documentType', 'signature');
          
          uploadPromises.push(
            fetch('/api/kyc/upload', {
              method: 'POST',
              body: signatureFormData,
            })
          );
        }

        // Wait for all uploads to complete
        const uploadResults = await Promise.all(uploadPromises);
        
        // Check if any upload failed
        const failedUploads = uploadResults.filter(response => !response.ok);
        if (failedUploads.length > 0) {
          console.warn('Some document uploads failed, but registration was successful');
          // Don't fail the entire registration for document upload issues
        }
      }

      // Registration completed successfully
      // Redirect to login page with success message
      router.push('/login?message=registration_success');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Erreur de connexion. Veuillez réessayer.'
      }));
    } finally {
      setIsLoading(false);
      setUploadingFiles(false);
    }
  };


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
              otpSent={otpSent}
              otpTimer={otpTimer}
              isLoading={isLoading}
              onInputChange={handleInputChange}
              onBlur={handleBlur}
              onFileChange={handleFileChange}
              onSendOTP={handleSendOTP}
              onResendOTP={handleResendOTP}
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

          {/* General Errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 mb-6">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

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
                ) : isLoading && currentStep === 3 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi du code OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Étape suivante</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={uploadingFiles || !validateStep(5) || isLoading}
                className={`flex items-center space-x-4 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  validateStep(5) && !uploadingFiles && !isLoading
                    ? 'bg-sama-primary-green text-white hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-timberwolf/30 text-timberwolf/50 cursor-not-allowed'
                }`}
              >
                {uploadingFiles ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Téléchargement des documents...</span>
                  </>
                ) : isLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création du compte...</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon Naffa</span>
                    <CheckCircleIcon className="w-6 h-6" />
                  </>
                )}
              </button>
            )}
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
