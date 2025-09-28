'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface FormData {
  // Step 1: Personal Information
  civilite: 'mr' | 'mme' | 'mlle';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  statutEmploi: string;
  metiers: string;

  // Step 2: Identity Verification
  nationality: string;
  idType: 'cni' | 'passport';
  idNumber: string;
  idIssueDate: string;
  idExpiryDate: string;
  dateOfBirth: string;
  placeOfBirth: string;

  // Step 3: Address
  country: string;
  region: string;
  department: string;
  district: string;
  address: string;
  city: string;

  // Step 4: Document Upload
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;

  // Step 5: Terms and Security
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
  signatureFile: File | null;
}

interface OTPVerificationStepProps {
  formData: FormData;
  onSuccess: () => void;
}

export default function OTPVerificationStep({ formData, onSuccess }: OTPVerificationStepProps) {
  const router = useRouter();
  const [otpMethod, setOtpMethod] = useState<'email' | 'sms'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer for OTP expiration
  const startOtpTimer = () => {
    setOtpTimer(300);
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
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

  // Send OTP with complete registration data
  const handleSendOTP = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare registration data for session storage
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        region: formData.region,
        department: formData.department,
        district: formData.district,
        placeOfBirth: formData.placeOfBirth,
        statutEmploi: formData.statutEmploi,
        metiers: formData.metiers,
        idType: formData.idType,
        idNumber: formData.idNumber,
        idIssueDate: formData.idIssueDate,
        idExpiryDate: formData.idExpiryDate,
        civilite: formData.civilite,
        termsAccepted: formData.termsAccepted,
        privacyAccepted: formData.privacyAccepted,
        marketingAccepted: formData.marketingAccepted,
        signature: formData.signature
      };

      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          type: 'registration',
          method: otpMethod,
          registrationData
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.sessionId);
        setOtpSent(true);
        startOtpTimer();
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload KYC files to Vercel Blob
  const uploadKYCFiles = async (userId: string) => {
    const uploadPromises = [];

    // Upload selfie
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

    // Upload ID front
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

    // Upload ID back (only for CNI)
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

    // Upload signature file if exists
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

    // Execute all uploads in parallel
    if (uploadPromises.length > 0) {
      const uploadResults = await Promise.all(uploadPromises);
      
      // Check if any upload failed
      for (const result of uploadResults) {
        if (!result.ok) {
          const errorData = await result.json();
          throw new Error(errorData.error || 'Erreur lors du téléchargement des documents');
        }
      }
    }
  };

  // Verify OTP and create account
  const handleVerifyAndCreate = async () => {
    if (!sessionId || !otpCode) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, verify OTP and create account
      const response = await fetch('/api/auth/verify-and-create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          otp: otpCode
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Upload KYC files after account creation
        setIsUploading(true);
        try {
          await uploadKYCFiles(data.user.id);
          // Success! Account created and files uploaded
          // Redirect to password setup for new users
          if (data.redirectUrl && data.redirectUrl.includes('password_setup_required')) {
            router.push(`/setup-password?userId=${data.user.id}`);
          } else {
            onSuccess();
          }
        } catch (uploadError) {
          console.error('Error uploading KYC files:', uploadError);
          setError('Compte créé mais erreur lors du téléchargement des documents. Veuillez les télécharger manuellement depuis votre profil.');
          // Still redirect to password setup since account was created
          if (data.redirectUrl && data.redirectUrl.includes('password_setup_required')) {
            router.push(`/setup-password?userId=${data.user.id}`);
          } else {
            onSuccess();
          }
        } finally {
          setIsUploading(false);
        }
      } else {
        setError(data.error || 'Erreur lors de la vérification du code OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    await handleSendOTP();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-night mb-2">Vérification finale</h2>
        <p className="text-night/70">
          Un dernier pas pour sécuriser votre compte Sama Naffa
        </p>
      </div>

      {/* OTP Method Selection */}
      {!otpSent && (
        <div className="border-2 border-dashed border-gold-metallic/30 rounded-xl p-6 bg-gold-metallic/5">
          <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-gold-metallic" />
            Choisissez votre méthode de vérification
          </h4>

          <p className="text-sm text-night/70 mb-4">
            Nous allons vous envoyer un code de vérification pour finaliser votre inscription.
          </p>

          <div className="space-y-3">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="otpMethod"
                value="email"
                checked={otpMethod === 'email'}
                onChange={(e) => setOtpMethod(e.target.value as 'email')}
                className="mt-1 w-5 h-5 text-gold-metallic border-timberwolf/30 rounded focus:ring-2 focus:ring-gold-metallic"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <EnvelopeIcon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-night">Par email</span>
                </div>
                <p className="text-xs text-night/60">Code envoyé à {formData.email}</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="otpMethod"
                value="sms"
                checked={otpMethod === 'sms'}
                onChange={(e) => setOtpMethod(e.target.value as 'sms')}
                className="mt-1 w-5 h-5 text-gold-metallic border-timberwolf/30 rounded focus:ring-2 focus:ring-gold-metallic"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <DevicePhoneMobileIcon className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-night">Par SMS</span>
                </div>
                <p className="text-xs text-night/60">Code envoyé au {formData.phone}</p>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSendOTP}
            disabled={isLoading}
            className={`w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              !isLoading
                ? 'bg-gold-metallic hover:bg-gold-metallic/90 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>Envoyer le code de vérification</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* OTP Input */}
      {otpSent && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            {otpMethod === 'email' ? (
              <EnvelopeIcon className="w-5 h-5 text-green-600" />
            ) : (
              <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
            )}
            <h4 className="font-semibold text-green-800">Code de vérification envoyé</h4>
          </div>

          <p className="text-sm text-green-700 mb-4">
            Un code de vérification a été envoyé {otpMethod === 'email' ? 'par email à' : 'par SMS au'}{' '}
            <strong>{otpMethod === 'email' ? formData.email : formData.phone}</strong>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-800 mb-2">
              Code de vérification (6 chiffres) *
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 text-center text-2xl font-mono border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors border-green-300 bg-white"
              placeholder="123456"
              required
            />
          </div>

          {otpTimer > 0 && (
            <div className="flex items-center justify-center space-x-2 text-green-700 mb-4">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                Expire dans {formatTime(otpTimer)}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleVerifyAndCreate}
              disabled={otpCode.length !== 6 || isLoading || isUploading}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                otpCode.length === 6 && !isLoading && !isUploading
                  ? 'bg-sama-primary-green hover:bg-sama-primary-green/90 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : isUploading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>Téléchargement des documents...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Créer mon compte</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={otpTimer > 0 || isLoading || isUploading}
              className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                otpTimer > 0 || isLoading || isUploading
                  ? 'text-green-400 cursor-not-allowed bg-green-100'
                  : 'text-gold-metallic hover:text-gold-metallic/80 bg-gold-metallic/10 hover:bg-gold-metallic/20'
              }`}
            >
              {otpTimer > 0
                ? `Renvoyer dans ${formatTime(otpTimer)}`
                : 'Renvoyer'
              }
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Change Method Option */}
      {otpSent && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setOtpSent(false);
              setOtpCode('');
              setError(null);
            }}
            className="text-sm text-gold-metallic hover:text-gold-metallic/80 font-medium"
          >
            Changer de méthode de vérification
          </button>
        </div>
      )}
    </div>
  );
}
