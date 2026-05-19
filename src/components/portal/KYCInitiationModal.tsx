'use client';

import { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { navigateToDiditVerification } from '@/lib/kyc-navigation';

interface KYCInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type KycStage = 'idle' | 'loading' | 'verifying' | 'success' | 'in_review' | 'declined' | 'error';

const POLL_INTERVAL_MS = 5_000;

export default function KYCInitiationModal({ isOpen, onClose, onComplete }: KYCInitiationModalProps) {
  const { data: userProfile } = useUserProfile();
  const [stage, setStage] = useState<KycStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const firstName = userProfile?.firstName || '';

  const stopPolling = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  // Check for existing KYC session on mount
  useEffect(() => {
    if (!isOpen || !userProfile?.id) return;

    const checkExistingKYC = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user;

        const pendingKyc = user.kycDocuments?.find((d: any) => 
          d.documentType === 'didit_kyc_session' && d.verificationStatus === 'PENDING'
        );

        if (pendingKyc) {
          setDiditSessionId(pendingKyc.fileUrl);
          setStage('verifying');
          startPolling(pendingKyc.fileUrl);
        }
      } catch {
        // Ignore error, start fresh
      }
    };

    checkExistingKYC();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userProfile?.id]);

  const startPolling = (sessionId: string) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/onboarding/kyc/status?sessionId=${sessionId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'approved') {
          stopPolling();
          setStage('success');
        } else if (data.status === 'in_review') {
          stopPolling();
          setStage('in_review');
        } else if (data.status === 'declined') {
          stopPolling();
          setStage('declined');
        }
      } catch {
        // network hiccup — keep polling
      }
    }, POLL_INTERVAL_MS);
  };

  const startVerification = async () => {
    setStage('loading');
    setError(null);
    try {
      const res = await fetch('/api/onboarding/kyc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      const returnPath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/portal/dashboard';
      navigateToDiditVerification(data.verificationUrl, data.sessionId, returnPath);
    } catch (e: unknown) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const handleRetry = () => {
    stopPolling();
    setStage('idle');
    setError(null);
    setDiditSessionId(null);
  };

  const handleComplete = () => {
    onClose();
    onComplete?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-timberwolf/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-night">Vérification d'identité</h2>
            <p className="text-sm text-night/60 mt-1">2 minutes, et c'est fait</p>
          </div>
          <button
            onClick={onClose}
            className="text-night/50 hover:text-night transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {stage === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <span className="text-5xl">🪪</span>
                </div>
                <p className="text-sm text-night/70 text-center">
                  On utilise <strong>Didit</strong> — vérification certifiée, aucun document
                  stocké sur nos serveurs.
                </p>
                <div className="space-y-3">
                  {[
                    { emoji: '🪪', text: 'Ton CNI ou passeport' },
                    { emoji: '🤳', text: 'Un selfie rapide (détection de vivacité)' },
                    { emoji: '⚡', text: 'Résultat en moins de 2 minutes' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3 text-sm text-night/70">
                      <span className="text-xl w-8 text-center shrink-0">{item.emoji}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={startVerification}
                  className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Commencer la vérification →
                </button>
                <p className="text-[10px] text-center text-night/40 italic">
                  S'ouvre dans un nouvel onglet sécurisé
                </p>
              </motion.div>
            )}

            {stage === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mb-4" />
                <p className="text-night font-semibold">Préparation de la vérification…</p>
              </motion.div>
            )}

            {stage === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-5 py-8"
              >
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
                <div>
                  <p className="font-bold text-night mb-1">En attente de ta vérification</p>
                  <p className="text-sm text-night/60">
                    Complète la vérification dans l'onglet ouvert.
                  </p>
                  <p className="text-xs text-night/40 mt-2">
                    Cette page se met à jour automatiquement.
                  </p>
                </div>
                {diditSessionId && (
                  <button
                    onClick={() =>
                      window.open(
                        `https://verify.didit.me/session/${diditSessionId}`,
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    className="text-sm text-gold hover:text-gold/80 font-medium underline underline-offset-2"
                  >
                    Rouvrir le lien de vérification
                  </button>
                )}
              </motion.div>
            )}

            {(stage === 'success' || stage === 'in_review') && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-5"
              >
                <span className="text-6xl block">{stage === 'success' ? '✅' : '🔍'}</span>
                <div>
                  <h2 className="text-xl font-bold text-night mb-2">
                    {stage === 'success' ? 'Identité vérifiée !' : 'En cours d\'examen'}
                  </h2>
                  <p className="text-sm text-night/60">
                    {stage === 'success'
                      ? 'Ton dossier est approuvé. Bienvenue chez Sama Naffa !'
                      : 'Notre équipe finalise la vérification (généralement moins de 24h).'}
                  </p>
                </div>
                <button
                  onClick={handleComplete}
                  className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Terminer →
                </button>
              </motion.div>
            )}

            {stage === 'declined' && (
              <motion.div
                key="declined"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 py-8"
              >
                <span className="text-5xl block">❌</span>
                <div>
                  <h2 className="text-lg font-bold text-night mb-2">Vérification non aboutie</h2>
                  <p className="text-sm text-night/60">
                    Ça arrive ! Assure-toi que les photos sont nettes et l'éclairage correct.
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
                >
                  Réessayer →
                </button>
              </motion.div>
            )}

            {stage === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4 py-8"
              >
                <p className="text-sm text-red-600">{error || 'Une erreur est survenue.'}</p>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl"
                >
                  Réessayer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
