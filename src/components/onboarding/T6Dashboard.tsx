'use client';

import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface T6DashboardProps {
  firstName: string;
  depositAmount: number;
  formula: string;
  kondanneName?: string | null;
  /** When false, KYC is approved but deposit intent release may still be syncing (ONB-047). */
  depositReady?: boolean;
}

/**
 * Momar has no dedicated T6 frame — after E8 the Figma flow lands on C1.
 * This step is a branded handoff into `/portal/dashboard`.
 */
export default function T6Dashboard({
  firstName,
  depositAmount,
  formula,
  kondanneName,
  depositReady = true,
}: T6DashboardProps) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const greetingName = firstName.trim() || 'toi';
  const projectLabel = kondanneName?.trim() || formula;

  const goToPortal = () => {
    if (sessionStatus === 'authenticated') {
      router.push('/portal/dashboard');
      return;
    }
    router.push(`/login?callbackUrl=${encodeURIComponent('/portal/dashboard')}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Salut ! Je viens de rejoindre Sama Naffa pour épargner intelligemment. Rejoins-moi : https://samanaffa.com`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="e1-shell t6-shell">
      <div className="e1-layout t6-layout">
        <div className="t6-col">
          <motion.h1
            className="e1-title t6-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {greetingName}, ton Naffa est prêt
          </motion.h1>

          <motion.p
            className="t6-lead"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            Compte ouvert, mandat signé. Voici où tu en es.
          </motion.p>

          <motion.div
            className="t6-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="t6-row">
              <span className="t6-label">Kondanné</span>
              <span className="t6-value">{projectLabel}</span>
            </div>
            <div className="t6-row">
              <span className="t6-label">Versement</span>
              <span className="t6-value">{formatCurrency(depositAmount)}</span>
            </div>
            <div className="t6-row t6-row--last">
              <span className="t6-label">Statut</span>
              <span
                className={
                  depositReady ? 't6-status t6-status--ready' : 't6-status t6-status--pending'
                }
              >
                {depositReady ? 'Prêt à confirmer' : 'En préparation'}
              </span>
            </div>
            <p className="t6-hint">
              {depositReady
                ? 'Confirme ton versement via Intouch depuis ton tableau de bord.'
                : 'Ton versement programmé finalise — ouvre le tableau de bord dans un instant.'}
            </p>
          </motion.div>

          <motion.button
            type="button"
            className="e1-cta t6-cta"
            onClick={goToPortal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Voir mon tableau de bord
          </motion.button>

          <button type="button" className="t6-share" onClick={shareViaWhatsApp}>
            Partager avec un proche
          </button>
        </div>
      </div>
    </div>
  );
}
