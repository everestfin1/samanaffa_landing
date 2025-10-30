'use client';

import { useState } from 'react';
import {
  CameraIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import WebcamCapture from '../common/WebcamCaptureFixed';
import Image from 'next/image';

interface FormData {
  selfieImage: File | null;
  idFrontImage: File | null;
  idBackImage: File | null;
  idType: 'cni' | 'passport';
}

interface Step4DocumentsProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

export default function Step4Documents({
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  onFileChange
}: Step4DocumentsProps) {
  // Webcam modal states
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamType, setWebcamType] = useState<'selfie' | 'idFront' | 'idBack'>('selfie');
  const [webcamTitle, setWebcamTitle] = useState('Prendre une photo');
  const [webcamFacing, setWebcamFacing] = useState<'user' | 'environment'>('user');

  // Check if device supports webcam
  const isWebcamSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  // Open webcam modal
  const openWebcam = (type: 'selfie' | 'idFront' | 'idBack') => {
    setWebcamType(type);
    
    switch (type) {
      case 'selfie':
        setWebcamTitle('Prendre un selfie');
        setWebcamFacing('user');
        break;
      case 'idFront':
        setWebcamTitle(`Photo ${formData.idType === 'cni' ? 'recto CNI' : 'passeport'}`);
        setWebcamFacing('environment');
        break;
      case 'idBack':
        setWebcamTitle('Photo verso CNI');
        setWebcamFacing('environment');
        break;
    }
    
    setWebcamOpen(true);
  };

  // Handle webcam capture
  const handleWebcamCapture = (file: File) => {
    const event = {
      target: { files: [file] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    switch (webcamType) {
      case 'selfie':
        onFileChange(event, 'selfieImage');
        break;
      case 'idFront':
        onFileChange(event, 'idFrontImage');
        break;
      case 'idBack':
        onFileChange(event, 'idBackImage');
        break;
    }
  };

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  const hasFieldError = (fieldName: string): boolean => {
    return touched[fieldName] && !!errors[fieldName];
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
                  <Image
                    src={createImagePreview(formData.selfieImage)}
                    alt="Photo de profil"
                    className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                    width={100}
                    height={100}
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
            
            {/* Replace/Change buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {/* Webcam button (desktop/supported devices) */}
              {isWebcamSupported() && (
                <button
                  type="button"
                  onClick={() => openWebcam('selfie')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gold-metallic border border-gold-metallic rounded-lg hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200"
                >
                  <CameraIcon className="w-4 h-4" />
                  Caméra
                </button>
              )}
              
              {/* File upload button */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onFileChange(e, 'selfieImage')}
                className="hidden"
                id="selfie-replace"
              />
              <label
                htmlFor="selfie-replace"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-all duration-200"
              >
                <CameraIcon className="w-4 h-4" />
                Galerie
              </label>
            </div>
          </div>
        ) : (
          // Show upload area when no image is selected
          <div className="space-y-4">
            {/* Upload options */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {/* Webcam button (desktop/supported devices) */}
              {isWebcamSupported() && (
                <button
                  type="button"
                  onClick={() => openWebcam('selfie')}
                  className="flex-1 sm:flex-initial flex flex-col items-center justify-center px-6 py-4 text-white bg-gold-metallic border-2 border-gold-metallic rounded-xl hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200 min-h-[120px]"
                >
                  <CameraIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium mb-1">Caméra</span>
                  <span className="text-xs text-center opacity-90">Prendre une photo maintenant</span>
                </button>
              )}
              
              {/* File upload option */}
              <div className="flex-1 sm:flex-initial">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'selfieImage')}
                  className="hidden"
                  id="selfie-upload"
                />
                <label
                  htmlFor="selfie-upload"
                  className="flex flex-col items-center justify-center w-full px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-blue-400/50 bg-white hover:bg-blue-100 text-night/70 min-h-[120px]"
                >
                  <UserIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium mb-1">Galerie</span>
                  <span className="text-xs text-center">Télécharger depuis votre appareil</span>
                </label>
              </div>
            </div>
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
                    <Image
                      src={createImagePreview(formData.idFrontImage)}
                      alt="Recto pièce d'identité"
                      className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                      width={100}
                      height={100}
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
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {/* Webcam button (desktop/supported devices) */}
                {isWebcamSupported() && (
                  <button
                    type="button"
                    onClick={() => openWebcam('idFront')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gold-metallic border border-gold-metallic rounded-lg hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                    Caméra
                  </button>
                )}
                
                {/* File upload button */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'idFrontImage')}
                  className="hidden"
                  id="idFront-replace"
                />
                <label
                  htmlFor="idFront-replace"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-metallic bg-gold-metallic/10 border border-gold-metallic/30 rounded-lg hover:bg-gold-metallic/20 hover:border-gold-metallic/50 cursor-pointer transition-all duration-200"
                >
                  <CameraIcon className="w-3.5 h-3.5" />
                  Galerie
                </label>
              </div>
            </div>
          ) : (
            // Show upload area when no image is selected
            <div className="space-y-3">
              {/* Upload options */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {/* Webcam button (desktop/supported devices) */}
                {isWebcamSupported() && (
                  <button
                    type="button"
                    onClick={() => openWebcam('idFront')}
                    className="flex-1 sm:flex-initial flex flex-col items-center justify-center px-4 py-3 text-white bg-gold-metallic border-2 border-gold-metallic rounded-xl hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200 min-h-[100px]"
                  >
                    <CameraIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Caméra</span>
                    <span className="text-xs text-center opacity-90">Prendre une photo</span>
                  </button>
                )}
                
                {/* File upload option */}
                <div className="flex-1 sm:flex-initial">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e, 'idFrontImage')}
                    className="hidden"
                    id="idFront-upload"
                  />
                  <label
                    htmlFor="idFront-upload"
                    className="flex flex-col items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70 min-h-[100px]"
                  >
                    <DocumentTextIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Galerie</span>
                    <span className="text-xs text-center">Télécharger depuis votre appareil</span>
                  </label>
                </div>
              </div>
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
                      <Image
                        src={createImagePreview(formData.idBackImage)}
                        alt="Verso pièce d'identité"
                        className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                        width={100}
                        height={100}
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
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {/* Webcam button (desktop/supported devices) */}
                  {isWebcamSupported() && (
                    <button
                      type="button"
                      onClick={() => openWebcam('idBack')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-gold-metallic border border-gold-metallic rounded-lg hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200"
                    >
                      <CameraIcon className="w-3.5 h-3.5" />
                      Caméra
                    </button>
                  )}
                  
                  {/* File upload button */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e, 'idBackImage')}
                    className="hidden"
                    id="idBack-replace"
                  />
                  <label
                    htmlFor="idBack-replace"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gold-metallic bg-gold-metallic/10 border border-gold-metallic/30 rounded-lg hover:bg-gold-metallic/20 hover:border-gold-metallic/50 cursor-pointer transition-all duration-200"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                    Galerie
                  </label>
                </div>
              </div>
            ) : (
              // Show upload area when no image is selected
              <div className="space-y-3">
                {/* Upload options */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {/* Webcam button (desktop/supported devices) */}
                  {isWebcamSupported() && (
                    <button
                      type="button"
                      onClick={() => openWebcam('idBack')}
                      className="flex-1 sm:flex-initial flex flex-col items-center justify-center px-4 py-3 text-white bg-gold-metallic border-2 border-gold-metallic rounded-xl hover:bg-gold-metallic/90 cursor-pointer transition-all duration-200 min-h-[100px]"
                    >
                      <CameraIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">Caméra</span>
                      <span className="text-xs text-center opacity-90">Prendre une photo</span>
                    </button>
                  )}
                  
                  {/* File upload option */}
                  <div className="flex-1 sm:flex-initial">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e, 'idBackImage')}
                      className="hidden"
                      id="idBack-upload"
                    />
                    <label
                      htmlFor="idBack-upload"
                      className="flex flex-col items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 border-gold-metallic/50 bg-gold-metallic/10 hover:bg-gold-metallic/20 text-night/70 min-h-[100px]"
                    >
                      <DocumentTextIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">Galerie</span>
                      <span className="text-xs text-center">Télécharger depuis votre appareil</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Webcam Capture Modal */}
      <WebcamCapture
        isOpen={webcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={handleWebcamCapture}
        facingMode={webcamFacing}
        title={webcamTitle}
      />
    </div>
  );
}
