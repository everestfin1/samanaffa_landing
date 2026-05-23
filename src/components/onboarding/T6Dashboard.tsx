'use client';

import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';

interface T6DashboardProps {
  firstName: string;
  depositAmount: number;
  formula: string;
  /** When false, KYC is approved but deposit intent release may still be syncing (ONB-047). */
  depositReady?: boolean;
}

export default function T6Dashboard({
  firstName,
  depositAmount,
  formula,
  depositReady = true,
}: T6DashboardProps) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [showConfetti, setShowConfetti] = useState(true);

  const goToPortal = () => {
    if (sessionStatus === 'authenticated') {
      router.push('/portal/dashboard');
      return;
    }
    router.push(`/login?callbackUrl=${encodeURIComponent('/portal/dashboard')}`);
  };
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      `Salut ! Je viens de rejoindre Sama Naffa pour épargner intelligemment. Rejoins-moi : https://samanaffa.com`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} colors={['#FFD700', '#1CB5E0', '#FF7900']} />}
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <OnboardingStepHeader
          title={`Bienvenue chez Sama Naffa, ${firstName} !`}
          description="Votre compte est créé. Voici où vous en êtes."
        />
      </motion.div>

      <div className="space-y-4">
        {/* Deposit Status Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-timberwolf/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xl">⏳</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-night">Dépôt programmé</h3>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                  depositReady
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {depositReady ? 'Prêt' : 'En préparation'}
              </span>
            </div>
            <p className="text-sm text-night/60 mb-2">
              {formatCurrency(depositAmount)} FCFA vers {formula}
            </p>
            <p className="text-xs text-night/40 italic">
              {depositReady
                ? 'Identité validée. Confirmez ce dépôt via Intouch depuis votre tableau de bord Sama Naffa.'
                : 'Identité validée. Votre dépôt programmé est en cours de finalisation — ouvrez Sama Naffa dans quelques instants pour le confirmer via Intouch.'}
            </p>
          </div>
        </motion.div>

        {/* Referral CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm"
        >
          <span className="text-4xl mb-3 block">🎁</span>
          <h3 className="font-bold text-green-900 mb-2">Invitez vos proches</h3>
          <p className="text-sm text-green-800/80 mb-4">
            Partagez Sama Naffa avec vos amis et votre famille.
          </p>
          <button 
            onClick={shareViaWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          >
            <span>Partager sur WhatsApp</span>
          </button>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={goToPortal}
        className="group relative w-full mt-8 px-8 py-4 bg-gradient-to-r from-[#344925] to-[#435933] hover:from-[#2a3a1e] hover:to-[#364529] text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
      >
        <span className="relative z-10">Aller au tableau de bord complet</span>
        <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
      </motion.button>
    </div>
  );
}
