'use client';

import { 
  CameraIcon, 
  UserIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface FormData {
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;
  otp: string;
  idType: 'cni' | 'passport';
  email: string;
}

interface Step4DocumentsProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  otpSent: boolean;
  otpTimer: number;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  onSendOTP: () => void;
  onResendOTP: () => void;
}

export default function Step4Documents({
  formData,
  errors,
  touched,
  otpSent,
  otpTimer,
  isLoading,
  onInputChange,
  onBlur,
  onFileChange,
  onSendOTP,
  onResendOTP
}: Step4DocumentsProps) {
  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CameraIcon className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-night">Documents & vérification</h3>
        </div>
        <p className="text-sm text-night/70">Étape 4 sur 5 - Selfie, documents et code de vérification</p>
      </div>

      {/* Selfie Upload */}
      <div className="border-2 border-dashed border-blue-400/30 rounded-xl p-6 bg-blue-50">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Photo de profil pour vérification d'identité
        </h4>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={(e) => onFileChange(e, 'selfieImage')}
            className="hidden"
            id="selfie-upload"
          />
          <label
            htmlFor="selfie-upload"
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
              formData.selfieImage
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-blue-400/50 bg-white hover:bg-blue-100 text-night/70'
            }`}
          >
            <UserIcon className="w-12 h-12 mb-3" />
            <span className="text-base font-medium mb-1">
              {formData.selfieImage ? 'Photo sélectionnée' : 'Ajouter votre photo'}
            </span>
            <span className="text-sm text-center">
              {formData.selfieImage ? 'Prêt à continuer' : 'Prendre une photo ou télécharger depuis votre appareil'}
            </span>
          </label>
        </div>

        {/* Tips for selfie */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <div className="flex items-start gap-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1 text-yellow-800">Conseils pour un bon selfie :</p>
              <ul className="text-xs space-y-1 text-yellow-700">
                <li>• Éclairage naturel de face</li>
                <li>• Visage bien visible</li>
                <li>• Pas de lunettes de soleil</li>
                <li>• Image nette et non floue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ID Document Upload */}
      <div className="border-2 border-dashed border-gold-metallic/30 rounded-xl p-6 bg-gold-metallic/5">
        <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5" />
          Documents d'identité
        </h4>

        {/* Front of ID */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-night mb-3">Recto de la pièce *</label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => onFileChange(e, 'idFrontImage')}
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
              <CameraIcon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Télécharger le recto</span>
              <span className="text-xs text-center">Photo nette et claire</span>
            </label>
          </div>
          {formData.idFrontImage && (
            <div className="mt-2 text-center">
              <span className="text-xs text-green-600 font-medium">✓ Recto téléchargé</span>
            </div>
          )}
        </div>

        {/* Back of ID (only for CNI) */}
        {formData.idType === 'cni' && (
          <div>
            <label className="block text-sm font-semibold text-night mb-3">Verso de la pièce *</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => onFileChange(e, 'idBackImage')}
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
                <DocumentTextIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Télécharger le verso</span>
                <span className="text-xs text-center">Photo de l'arrière</span>
              </label>
            </div>
            {formData.idBackImage && (
              <div className="mt-2 text-center">
                <span className="text-xs text-green-600 font-medium">✓ Verso téléchargé</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OTP Verification */}
      {otpSent && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <EnvelopeIcon className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Code de vérification envoyé</h4>
          </div>

          <p className="text-sm text-green-700 mb-4">
            Un code de vérification a été envoyé à <strong>{formData.email}</strong>
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-800 mb-2">
              Code de vérification (6 chiffres) *
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={onInputChange}
              onBlur={onBlur}
              maxLength={6}
              className={`w-full px-4 py-3 text-center text-2xl font-mono border rounded-xl focus:ring-2 focus:ring-gold-metallic focus:border-transparent transition-colors ${
                hasFieldError('otp') ? 'border-red-400 bg-red-50' : 'border-green-300 bg-white'
              }`}
              placeholder="123456"
              required
            />
            {getFieldError('otp') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('otp')}</p>
            )}
          </div>

          {otpTimer > 0 && (
            <div className="flex items-center justify-center space-x-2 text-green-700 mb-4">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                Expire dans {formatTime(otpTimer)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onResendOTP}
            disabled={otpTimer > 0 || isLoading}
            className={`text-sm transition-colors ${
              otpTimer > 0 || isLoading
                ? 'text-green-400 cursor-not-allowed'
                : 'text-gold-metallic hover:text-gold-metallic/80'
            }`}
          >
            {otpTimer > 0
              ? `Renvoyer dans ${formatTime(otpTimer)}`
              : 'Renvoyer le code'
            }
          </button>
        </div>
      )}
    </div>
  );
}
