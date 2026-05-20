'use client';

import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DiditKycStage } from '@/hooks/useDiditKycVerification';

export type DiditKycTone = 'formal' | 'informal';
export type DiditKycButtonStyle = 'onboarding' | 'portal';

const COPY = {
  formal: {
    provider: (
      <>
        Nous utilisons <strong>Didit</strong> — vérification certifiée, aucun document stocké sur
        nos serveurs.
      </>
    ),
    checklist: [
      { emoji: '🪪', text: 'Votre CNI ou passeport' },
      { emoji: '🤳', text: 'Un selfie rapide (détection de vivacité)' },
      { emoji: '⚡', text: 'Résultat en moins de 2 minutes' },
    ],
    start: 'Commencer la vérification',
    redirectHint: 'Vous serez redirigé vers Didit puis de retour ici automatiquement',
    verifyingTitle: 'En attente de votre vérification',
    verifyingBody: 'Si vous avez quitté Didit, utilisez le bouton ci-dessous pour reprendre.',
    resume: 'Reprendre la vérification',
    successTitle: 'Identité vérifiée !',
    successBody: 'Votre dossier est approuvé. Bienvenue chez Sama Naffa !',
    inReviewTitle: "En cours d'examen",
    inReviewBody:
      'Notre équipe finalise la vérification (généralement moins de 24 h). Vous pouvez accéder à votre espace en attendant.',
    declinedTitle: 'Vérification non aboutie',
    declinedBody:
      "Cela arrive. Assurez-vous que les photos sont nettes et l'éclairage correct.",
    retry: 'Réessayer',
    finish: 'Terminer',
    portalCta: 'Accéder à votre espace',
  },
  informal: {
    provider: (
      <>
        On utilise <strong>Didit</strong> — vérification certifiée, aucun document stocké sur nos
        serveurs.
      </>
    ),
    checklist: [
      { emoji: '🪪', text: 'Ton CNI ou passeport' },
      { emoji: '🤳', text: 'Un selfie rapide (détection de vivacité)' },
      { emoji: '⚡', text: 'Résultat en moins de 2 minutes' },
    ],
    start: 'Commencer la vérification →',
    redirectHint: "S'ouvre dans un nouvel onglet sécurisé",
    verifyingTitle: 'En attente de ta vérification',
    verifyingBody: "Complète la vérification dans l'onglet ouvert.",
    resume: 'Rouvrir le lien de vérification',
    successTitle: 'Identité vérifiée !',
    successBody: 'Ton dossier est approuvé. Bienvenue chez Sama Naffa !',
    inReviewTitle: "En cours d'examen",
    inReviewBody: 'Notre équipe finalise la vérification (généralement moins de 24h).',
    declinedTitle: 'Vérification non aboutie',
    declinedBody: "Ça arrive ! Assure-toi que les photos sont nettes et l'éclairage correct.",
    retry: 'Réessayer →',
    finish: 'Terminer →',
    portalCta: 'Terminer →',
  },
} as const;

interface DiditKycStagePanelsProps {
  stage: DiditKycStage;
  error: string | null;
  declineReasons: string[];
  verificationUrl: string | null;
  tone?: DiditKycTone;
  buttonStyle?: DiditKycButtonStyle;
  onStart: () => void;
  onRetry: () => void;
  onResumeVerification: () => void;
  onFinish?: () => void;
  onGoToPortal?: () => void;
  depositAmount?: number;
}

export default function DiditKycStagePanels({
  stage,
  error,
  declineReasons,
  verificationUrl,
  tone = 'formal',
  buttonStyle = 'onboarding',
  onStart,
  onRetry,
  onResumeVerification,
  onFinish,
  onGoToPortal,
  depositAmount,
}: DiditKycStagePanelsProps) {
  const t = COPY[tone];

  return (
    <AnimatePresence mode="wait">
      {stage === 'idle' && (
        <motion.div
          key="idle"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={
            buttonStyle === 'onboarding'
              ? 'bg-white border border-timberwolf/30 rounded-2xl p-6 space-y-5 shadow-xs'
              : 'space-y-5'
          }
        >
          {buttonStyle === 'portal' && (
            <div className="text-center mb-6">
              <span className="text-5xl">🪪</span>
            </div>
          )}
          <p className="text-sm text-night/70 text-center">{t.provider}</p>
          <div className="space-y-3">
            {t.checklist.map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-night/70">
                <span className="text-xl w-8 text-center shrink-0">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
          <KycActionButton style={buttonStyle} onClick={onStart}>
            {t.start}
          </KycActionButton>
          <p className="text-[10px] text-center text-night/40 italic">{t.redirectHint}</p>
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
          className={
            buttonStyle === 'onboarding'
              ? 'bg-white border border-timberwolf/30 rounded-2xl p-8 text-center space-y-5 shadow-xs'
              : 'text-center space-y-5 py-8'
          }
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent" />
          <div>
            <p className="font-bold text-night mb-1">{t.verifyingTitle}</p>
            <p className="text-sm text-night/60">{t.verifyingBody}</p>
            <p className="text-xs text-night/40 mt-2">Cette page se met à jour automatiquement.</p>
          </div>
          {verificationUrl && (
            <button
              type="button"
              onClick={onResumeVerification}
              className={
                buttonStyle === 'onboarding'
                  ? 'w-full px-4 py-3 bg-gold/10 text-gold font-medium rounded-xl border border-gold/30 hover:bg-gold/20 transition-colors'
                  : 'text-sm text-gold hover:text-gold/80 font-medium underline underline-offset-2'
              }
            >
              {t.resume}
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
            <p className="text-xl font-bold text-night mb-2">{t.successTitle}</p>
            <p className="text-sm text-night/60">{t.successBody}</p>
          </div>
          {depositAmount != null && depositAmount > 0 && (
            <div className="inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
              💸 Débloquez votre dépôt de{' '}
              <strong>{depositAmount.toLocaleString('fr-FR')} FCFA</strong>
            </div>
          )}
          {onFinish && (
            <KycActionButton style={buttonStyle} onClick={onFinish}>
              {t.finish}
            </KycActionButton>
          )}
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
          <div>
            <p className="text-xl font-bold text-night mb-2">{t.inReviewTitle}</p>
            <p className="text-sm text-night/60">{t.inReviewBody}</p>
          </div>
          {onGoToPortal && (
            <KycActionButton style={buttonStyle} onClick={onGoToPortal}>
              {t.portalCta}
            </KycActionButton>
          )}
        </motion.div>
      )}

      {stage === 'declined' && (
        <motion.div
          key="declined"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={
            buttonStyle === 'onboarding'
              ? 'bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-xs'
              : 'text-center space-y-4 py-8'
          }
        >
          <span className="text-5xl block">❌</span>
          <div>
            <p className="text-lg font-bold text-night mb-2">{t.declinedTitle}</p>
            <p className="text-sm text-night/60">{t.declinedBody}</p>
            {declineReasons.length > 0 && (
              <ul className="mt-3 text-left text-sm text-red-700/90 space-y-1 list-disc list-inside">
                {declineReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
          <KycActionButton style={buttonStyle} onClick={onRetry}>
            {t.retry}
          </KycActionButton>
        </motion.div>
      )}

      {stage === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            buttonStyle === 'onboarding'
              ? 'bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-xs'
              : 'text-center space-y-4 py-8'
          }
        >
          <p className="text-sm text-red-600">{error || 'Une erreur est survenue.'}</p>
          <KycActionButton style={buttonStyle} onClick={onRetry}>
            {t.retry}
          </KycActionButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KycActionButton({
  style,
  onClick,
  children,
}: {
  style: DiditKycButtonStyle;
  onClick: () => void;
  children: ReactNode;
}) {
  if (style === 'portal') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full bg-gold hover:bg-gold/90 text-night font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
    >
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
        →
      </span>
    </button>
  );
}
