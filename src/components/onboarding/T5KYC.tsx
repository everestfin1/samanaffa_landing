'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface T5KYCProps {
  userId: string;
  firstName: string;
  depositAmount: number;
  onSuccess: () => void;
  onBack?: () => void;
}

type KycStage = 'idle' | 'loading' | 'verifying' | 'success' | 'in_review' | 'declined' | 'error';

const POLL_INTERVAL_MS = 5_000;

export default function T5KYC({ userId, firstName, depositAmount, onSuccess, onBack }: T5KYCProps) {
  const [stage, setStage] = useState<KycStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

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

      setDiditSessionId(data.sessionId);
      window.open(data.verificationUrl, '_blank', 'noopener,noreferrer');
      setStage('verifying');
      startPolling(data.sessionId);
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

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {stage === 'idle' && onBack && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}

      <div className="text-center mb-6">
        <span className="text-5xl">🪪</span>
        <p className="text-xl md:text-2xl font-bold text-night mt-3 mb-2 whitespace-nowrap">
          Vérification d&apos;identité
        </p>
        <p className="text-night/60 text-sm">2 minutes, et c&apos;est fait.</p>
        <div className="mt-3 inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
          💸 Libère ton dépôt de{' '}
          <strong>{depositAmount.toLocaleString('fr-FR')} FCFA</strong>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-5 shadow-xs">
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
                className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="relative z-10">Commencer la vérification</span>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
              <p className="text-[10px] text-center text-night/40 italic">
                S&apos;ouvre dans un nouvel onglet sécurisé
              </p>
            </div>
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
            className="bg-white border border-timberwolf/30 rounded-2xl p-8 text-center space-y-5 shadow-xs"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
            <div>
              <p className="font-bold text-night mb-1">En attente de ta vérification</p>
              <p className="text-sm text-night/60">
                Complète la vérification dans l&apos;onglet ouvert.
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
              onClick={onSuccess}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Terminer</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        )}

        {stage === 'declined' && (
          <motion.div
            key="declined"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-xs"
          >
            <span className="text-5xl block">❌</span>
            <div>
              <h2 className="text-lg font-bold text-night mb-2">Vérification non aboutie</h2>
              <p className="text-sm text-night/60">
                Ça arrive ! Assure-toi que les photos sont nettes et l&apos;éclairage correct.
              </p>
            </div>
            <button
              onClick={handleRetry}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Réessayer</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        )}

        {stage === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-xs"
          >
            <p className="text-sm text-red-600">{error || 'Une erreur est survenue.'}</p>
            <button
              onClick={handleRetry}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Réessayer</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
