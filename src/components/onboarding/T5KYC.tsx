'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const WebcamCapture = dynamic(() => import('@/components/common/WebcamCaptureFixed'), { ssr: false });

interface T5KYCProps {
  userId: string;
  firstName: string;
  depositAmount: number;
  onSuccess: () => void;
  onBack?: () => void;
}

type CaptureStage = 'idle' | 'recto' | 'verso' | 'ocr' | 'done';

interface OCRResult {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
}

export default function T5KYC({ userId, firstName, depositAmount, onSuccess, onBack }: T5KYCProps) {
  const [stage, setStage] = useState<CaptureStage>('idle');
  const [rectoFile, setRectoFile] = useState<File | null>(null);
  const [versoFile, setVersoFile] = useState<File | null>(null);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [webcamMode, setWebcamMode] = useState<'recto' | 'verso'>('recto');
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWebcam = (mode: 'recto' | 'verso') => {
    setWebcamMode(mode);
    setWebcamOpen(true);
  };

  const handleCapture = (file: File) => {
    setWebcamOpen(false);
    if (webcamMode === 'recto') {
      setRectoFile(file);
      setStage('verso');
    } else {
      setVersoFile(file);
      runFakeOCR();
    }
  };

  // Fake OCR — 2s animation, then pre-fill with mock data.
  // In production this would be a call to Didit / Smile ID with confidence scoring.
  const runFakeOCR = () => {
    setStage('ocr');
    setTimeout(() => {
      setOcrResult({
        firstName,
        lastName: 'DIALLO',
        dateOfBirth: '1995-04-15',
        idNumber: '1234567890123',
      });
      setStage('done');
    }, 2000);
  };

  const uploadFile = async (file: File, documentType: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', userId);
    fd.append('documentType', documentType);
    const res = await fetch('/api/kyc/upload', { method: 'POST', body: fd });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Upload failed');
    }
  };

  const handleConfirm = async () => {
    if (!rectoFile || !versoFile) return;
    setUploading(true);
    setError(null);
    try {
      await uploadFile(rectoFile, 'national_id');
      await uploadFile(versoFile, 'national_id_back');
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleBackInKyc = () => {
    if (stage === 'idle') {
      onBack?.();
      return;
    }
    if (stage === 'verso') {
      setRectoFile(null);
      setStage('idle');
      return;
    }
    if (stage === 'done') {
      setVersoFile(null);
      setOcrResult(null);
      setStage('verso');
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {stage !== 'ocr' && (onBack || stage !== 'idle') && (
        <button
          onClick={handleBackInKyc}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}
      <div className="text-center mb-6">
        <span className="text-5xl">🪪</span>
        <h1 className="text-2xl md:text-3xl font-bold text-night mt-3 mb-2">
          Dernière étape — on protège ton argent 🔒
        </h1>
        <p className="text-night/60 text-sm">
          2 minutes, et c&apos;est fait.
        </p>
        <div className="mt-3 inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
          💸 Il ne reste que la vérification pour libérer ton dépôt de{' '}
          <strong>{depositAmount.toLocaleString('fr-FR')} FCFA</strong>
        </div>
      </div>

      {stage === 'idle' && (
        <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 text-center space-y-4">
          <p className="text-night/80">Prends une photo de ta CNI — recto puis verso.</p>
          <button
            onClick={() => openWebcam('recto')}
            className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl"
          >
            📷 Photo recto CNI
          </button>
        </div>
      )}

      {stage === 'verso' && (
        <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 text-center space-y-4">
          <p className="text-green-700 font-semibold">✓ Recto capturé</p>
          <p className="text-night/80">Maintenant le verso.</p>
          <button
            onClick={() => openWebcam('verso')}
            className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl"
          >
            📷 Photo verso CNI
          </button>
        </div>
      )}

      {stage === 'ocr' && (
        <div className="bg-white border border-timberwolf/30 rounded-2xl p-10 text-center shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mb-6" />
          <p className="text-night font-bold text-lg mb-2">{OCR_STEPS[ocrStep]}</p>
          <div className="w-full h-1.5 bg-timberwolf/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((ocrStep + 1) / OCR_STEPS.length) * 100}%` }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {stage === 'done' && ocrResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-10 bg-timberwolf/20 rounded border border-timberwolf/40 flex items-center justify-center overflow-hidden">
              {rectoFile && <img src={URL.createObjectURL(rectoFile)} alt="Recto" className="w-full h-full object-cover opacity-50" />}
            </div>
            <div className="w-16 h-10 bg-timberwolf/20 rounded border border-timberwolf/40 flex items-center justify-center overflow-hidden">
              {versoFile && <img src={URL.createObjectURL(versoFile)} alt="Verso" className="w-full h-full object-cover opacity-50" />}
            </div>
          </div>
          <p className="text-green-700 font-semibold text-center flex items-center justify-center gap-2">
            <span className="text-xl">✓</span> Documents analysés avec succès
          </p>
          <div className="space-y-3 text-sm bg-gray-50/50 p-4 rounded-xl border border-timberwolf/20">
            <Row label="Prénom" value={ocrResult.firstName} />
            <Row label="Nom" value={ocrResult.lastName} />
            <Row label="Date de naissance" value={ocrResult.dateOfBirth} />
            <Row label="N° CNI" value={ocrResult.idNumber} />
          </div>
          <p className="text-xs text-night/50 text-center flex items-center justify-center gap-1">
            <span>🤖</span> Extraction automatique — zéro ressaisie
          </p>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={uploading}
            className="w-full bg-gold hover:bg-gold/90 disabled:opacity-50 text-night font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            {uploading ? 'Envoi des documents...' : 'Confirmer et finaliser →'}
          </button>
        </motion.div>
      )}

      <WebcamCapture
        isOpen={webcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={handleCapture}
        facingMode="environment"
        title={webcamMode === 'recto' ? 'Photo recto CNI' : 'Photo verso CNI'}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-timberwolf/20 pb-2">
      <span className="text-night/60">{label}</span>
      <span className="font-semibold text-night">{value}</span>
    </div>
  );
}
