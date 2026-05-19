'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigateToDiditVerification } from '@/lib/kyc-navigation';

interface T5KYCProps {
  firstName: string;
  depositAmount: number;
  onApproved: () => void;
  onBack?: () => void;
  /** Resume after Didit redirect (same-tab flow). */
  resumeSessionId?: string | null;
}

type KycStage = 'idle' | 'loading' | 'verifying' | 'success' | 'in_review' | 'declined' | 'error';

const POLL_INTERVAL_MS = 5_000;

export default function T5KYC({
  firstName,
  depositAmount,
  onApproved,
  onBack,
  resumeSessionId,
}: T5KYCProps) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [stage, setStage] = useState<KycStage>('idle');
  const approvedHandledRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [declineReasons, setDeclineReasons] = useState<string[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => stopPolling(), []);

  const goToPortal = useCallback(() => {
    if (sessionStatus === 'authenticated') {
      router.push('/portal/dashboard');
      return;
    }
    router.push(`/login?callbackUrl=${encodeURIComponent('/portal/dashboard')}`);
  }, [router, sessionStatus]);

  const applyStatus = useCallback((status: string) => {
    if (status === 'approved') {
      stopPolling();
      setStage('success');
      if (!approvedHandledRef.current) {
        approvedHandledRef.current = true;
        window.setTimeout(() => onApproved(), 1200);
      }
    } else if (status === 'in_review') {
      stopPolling();
      setStage('in_review');
    } else if (status === 'declined') {
      stopPolling();
      setStage('declined');
    }
  }, [onApproved]);

  const pollOnce = async (sessionId: string) => {
    const res = await fetch(`/api/onboarding/kyc/status?sessionId=${sessionId}`, {
      credentials: 'same-origin',
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.status === 'declined' && Array.isArray(data.declineReasons)) {
      setDeclineReasons(data.declineReasons);
    }
    applyStatus(data.status);
  };

  const startPolling = (sessionId: string) => {
    stopPolling();
    void pollOnce(sessionId);
    pollRef.current = setInterval(() => {
      void pollOnce(sessionId);
    }, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    if (!resumeSessionId) return;
    setDiditSessionId(resumeSessionId);
    setStage('verifying');
    startPolling(resumeSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeSessionId]);

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

      setVerificationUrl(data.verificationUrl);
      setDiditSessionId(data.sessionId);
      navigateToDiditVerification(data.verificationUrl, data.sessionId, '/onboarding');
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
    setVerificationUrl(null);
    setDeclineReasons([]);
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
        <KycDepositBadge amount={depositAmount} />
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
                Nous utilisons <strong>Didit</strong> — vérification certifiée, aucun document
                stocké sur nos serveurs.
              </p>
              <div className="space-y-3">
                {[
                  { emoji: '🪪', text: 'Votre CNI ou passeport' },
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
                Vous serez redirigé vers Didit puis de retour ici automatiquement
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
              <p className="font-bold text-night mb-1">En attente de votre vérification</p>
              <p className="text-sm text-night/60">
                Si vous avez quitté Didit, utilisez le bouton ci-dessous pour reprendre.
              </p>
              <p className="text-xs text-night/40 mt-2">
                Cette page se met à jour automatiquement.
              </p>
            </div>
            {verificationUrl && (
              <button
                type="button"
                onClick={() => {
                  if (diditSessionId) {
                    navigateToDiditVerification(verificationUrl, diditSessionId, '/onboarding');
                  } else {
                    window.location.href = verificationUrl;
                  }
                }}
                className="w-full px-4 py-3 bg-gold/10 text-gold font-medium rounded-xl border border-gold/30 hover:bg-gold/20 transition-colors"
              >
                Reprendre la vérification
              </button>
            )}
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-5"
          >
            <span className="text-6xl block">✅</span>
            <div>
              <p className="text-xl font-bold text-night mb-2">Identité vérifiée !</p>
              <p className="text-sm text-night/60">
                Votre dossier est approuvé. Bienvenue chez Sama Naffa !
              </p>
            </div>
            <button
              onClick={onApproved}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Terminer</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
          </motion.div>
        )}

        {stage === 'in_review' && (
          <motion.div
            key="in_review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-5"
          >
            <span className="text-6xl block">🔍</span>
            <KycInReviewCopy />
            <button
              type="button"
              onClick={goToPortal}
              className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Accéder à votre espace</span>
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
              <p className="text-lg font-bold text-night mb-2">Vérification non aboutie</p>
              <p className="text-sm text-night/60">
                Cela arrive. Assurez-vous que les photos sont nettes et l&apos;éclairage correct.
              </p>
              {declineReasons.length > 0 && (
                <ul className="mt-3 text-left text-sm text-red-700/90 space-y-1 list-disc list-inside">
                  {declineReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
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

function KycDepositBadge({ amount }: { amount: number }) {
  return (
    <div className="mt-3 inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
      💸 Débloquez votre dépôt de <strong>{amount.toLocaleString('fr-FR')} FCFA</strong>
    </div>
  );
}

function KycInReviewCopy() {
  return (
    <div>
      <p className="text-xl font-bold text-night mb-2">En cours d&apos;examen</p>
      <p className="text-sm text-night/60">
        Notre équipe finalise la vérification (généralement moins de 24 h). Vous pouvez accéder à
        votre espace en attendant.
      </p>
    </div>
  );
}
