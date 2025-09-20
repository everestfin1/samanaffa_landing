'use client';

import { 
  ShieldCheckIcon, 
  PencilIcon, 
  CheckCircleIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { useRef, useEffect } from 'react';

interface FormData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
  signature: string;
}

interface Step5TermsProps {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSignatureChange: (signatureData: string) => void;
  onClearSignature: () => void;
}

export default function Step5Terms({
  formData,
  errors,
  touched,
  onInputChange,
  onSignatureChange,
  onClearSignature
}: Step5TermsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || '' : '';
  };

  // Signature canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
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
    if (!isDrawingRef.current) return;

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
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      // Save signature to form data
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL();
        onSignatureChange(signatureData);
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClearSignature();
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
  }, []);

  return (
    <div className="space-y-6">
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
          Signature électronique
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

            {getFieldError('signature') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('signature')}</p>
            )}

            <p className="text-xs text-night/60 mt-2">En signant, vous confirmez l'exactitude des informations fournies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
