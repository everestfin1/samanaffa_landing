'use client';

import { 
  CameraIcon, 
  UserIcon, 
  DocumentTextIcon, 
  EnvelopeIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  TrashIcon,
  EyeIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface FormData {
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;
  otpMethod: 'email' | 'sms';
  otp: string;
  idType: 'cni' | 'passport';
  email: string;
  phone: string;
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

  // Helper function to create image preview URL
  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to remove uploaded file
  const removeFile = (fieldName: string) => {
    const event = {
      target: { files: [] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(event, fieldName);
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

        {formData.selfieImage ? (
          // Show uploaded image preview
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl p-4 border-2 border-green-400">
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={createImagePreview(formData.selfieImage)}
                    alt="Photo de profil"
                    className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <EyeIcon className="w-3 h-3" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <UserIcon className="w-4 h-4 text-green-600" />
                    <h5 className="font-semibold text-green-800 text-sm">Selfie de vérification</h5>
                  </div>
                  <p className="text-sm text-green-700 font-medium truncate">
                    {formData.selfieImage.name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatFileSize(formData.selfieImage.size)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-700 font-medium">Image téléchargée avec succès</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile('selfieImage')}
                  className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Supprimer l'image"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Replace/Change button */}
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => onFileChange(e, 'selfieImage')}
                className="hidden"
                id="selfie-replace"
              />
              <label
                htmlFor="selfie-replace"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-all duration-200"
              >
                <CameraIcon className="w-4 h-4" />
                Changer la photo
              </label>
            </div>
          </div>
        ) : (
          // Show upload area when no image is selected
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
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-blue-400/50 bg-white hover:bg-blue-100 text-night/70"
            >
              <UserIcon className="w-12 h-12 mb-3" />
              <span className="text-base font-medium mb-1">Ajouter votre photo</span>
              <span className="text-sm text-center">Prendre une photo ou télécharger depuis votre appareil</span>
            </label>
          </div>
        )}

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
          
          {formData.idFrontImage ? (
            // Show uploaded image preview
            <div className="space-y-3">
              <div className="relative bg-white rounded-xl p-3 border-2 border-green-400">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img
                      src={createImagePreview(formData.idFrontImage)}
                      alt="Recto pièce d'identité"
                      className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                      <EyeIcon className="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <DocumentTextIcon className="w-3.5 h-3.5 text-green-600" />
                      <h6 className="font-semibold text-green-800 text-xs">
                        {formData.idType === 'cni' ? 'CNI - Recto' : 'Passeport - Page principale'}
                      </h6>
                    </div>
                    <p className="text-xs text-green-700 font-medium truncate">
                      {formData.idFrontImage.name}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      {formatFileSize(formData.idFrontImage.size)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-700 font-medium">Téléchargé</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile('idFrontImage')}
                    className="flex-shrink-0 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Supprimer l'image"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              {/* Replace button */}
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => onFileChange(e, 'idFrontImage')}
                  className="hidden"
                  id="idFront-replace"
                />
                <label
                  htmlFor="idFront-replace"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-metallic bg-gold-metallic/10 border border-gold-metallic/30 rounded-lg hover:bg-gold-metallic/20 hover:border-gold-metallic/50 cursor-pointer transition-all duration-200"
                >
                  <CameraIcon className="w-3.5 h-3.5" />
                  Changer
                </label>
              </div>
            </div>
          ) : (
            // Show upload area when no image is selected
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
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70"
              >
                <CameraIcon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">Télécharger le recto</span>
                <span className="text-xs text-center">Photo nette et claire</span>
              </label>
            </div>
          )}
        </div>

        {/* Back of ID (only for CNI) */}
        {formData.idType === 'cni' && (
          <div>
            <label className="block text-sm font-semibold text-night mb-3">Verso de la pièce *</label>
            
            {formData.idBackImage ? (
              // Show uploaded image preview
              <div className="space-y-3">
                <div className="relative bg-white rounded-xl p-3 border-2 border-green-400">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={createImagePreview(formData.idBackImage)}
                        alt="Verso pièce d'identité"
                        className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                      />
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                        <EyeIcon className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <DocumentTextIcon className="w-3.5 h-3.5 text-green-600" />
                        <h6 className="font-semibold text-green-800 text-xs">CNI - Verso</h6>
                      </div>
                      <p className="text-xs text-green-700 font-medium truncate">
                        {formData.idBackImage.name}
                      </p>
                      <p className="text-xs text-green-600 mt-0.5">
                        {formatFileSize(formData.idBackImage.size)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-700 font-medium">Téléchargé</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('idBackImage')}
                      className="flex-shrink-0 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Supprimer l'image"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                {/* Replace button */}
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => onFileChange(e, 'idBackImage')}
                    className="hidden"
                    id="idBack-replace"
                  />
                  <label
                    htmlFor="idBack-replace"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-metallic bg-gold-metallic/10 border border-gold-metallic/30 rounded-lg hover:bg-gold-metallic/20 hover:border-gold-metallic/50 cursor-pointer transition-all duration-200"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                    Changer
                  </label>
                </div>
              </div>
            ) : (
              // Show upload area when no image is selected
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
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70"
                >
                  <DocumentTextIcon className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Télécharger le verso</span>
                  <span className="text-xs text-center">Photo de l'arrière</span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OTP Verification */}
      {!otpSent && (
        <div className="border-2 border-dashed border-purple-400/30 rounded-xl p-6 bg-purple-50">
          <h4 className="font-semibold text-night mb-4 flex items-center gap-2">
            {formData.otpMethod === 'email' ? (
              <EnvelopeIcon className="w-5 h-5" />
            ) : (
              <DevicePhoneMobileIcon className="w-5 h-5" />
            )}
            Vérification d'identité
          </h4>

          <p className="text-sm text-night/70 mb-4">
            Vos documents ont été téléchargés avec succès. Cliquez ci-dessous pour recevoir votre code de vérification {formData.otpMethod === 'email' ? 'par email' : 'par SMS'} :
          </p>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  formData.otpMethod === 'email' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                }`}>
                  {formData.otpMethod === 'email' ? (
                    <EnvelopeIcon className="w-4 h-4" />
                  ) : (
                    <DevicePhoneMobileIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h5 className="font-semibold text-sm">
                    {formData.otpMethod === 'email' ? 'Par email' : 'Par SMS'}
                  </h5>
                  <p className="text-xs text-night/60">
                    {formData.otpMethod === 'email' ? formData.email : formData.phone}
                  </p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                formData.otpMethod === 'email' ? 'bg-blue-500' : 'bg-green-500'
              }`}></div>
            </div>

            <button
              type="button"
              onClick={onSendOTP}
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                !isLoading
                  ? formData.otpMethod === 'email'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
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
                  {formData.otpMethod === 'email' ? <EnvelopeIcon className="w-4 h-4" /> : <DevicePhoneMobileIcon className="w-4 h-4" />}
                  <span>Envoyer le code {formData.otpMethod === 'email' ? 'par email' : 'par SMS'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification */}
      {otpSent && (
        <div className="border border-green-200 bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            {formData.otpMethod === 'email' ? (
              <EnvelopeIcon className="w-5 h-5 text-green-600" />
            ) : (
              <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
            )}
            <h4 className="font-semibold text-green-800">Code de vérification envoyé</h4>
          </div>

          <p className="text-sm text-green-700 mb-4">
            Un code de vérification a été envoyé {formData.otpMethod === 'email' ? 'par email à' : 'par SMS au'}{' '}
            <strong>{formData.otpMethod === 'email' ? formData.email : formData.phone}</strong>
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
