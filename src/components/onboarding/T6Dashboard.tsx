'use client';

import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// @ts-ignore
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

interface T6DashboardProps {
  firstName: string;
  depositAmount: number;
  formula: string;
}

export default function T6Dashboard({ firstName, depositAmount, formula }: T6DashboardProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
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
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-center mb-8"
      >
        <span className="text-6xl inline-block mb-4">🎉</span>
        <h1 className="text-2xl md:text-3xl font-bold text-night mb-2">
          Bienvenue chez Sama Naffa, {firstName} !
        </h1>
        <p className="text-night/60 text-sm">
          Ton compte est créé. Voici où tu en es.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* Status Card 1 */}
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
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-blue-100 text-blue-800 rounded-full">En attente</span>
            </div>
            <p className="text-sm text-night/60 mb-2">
              {formatCurrency(depositAmount)} FCFA vers {formula}
            </p>
            <p className="text-xs text-night/40 italic">Sera prélevé après validation KYC</p>
          </div>
        </motion.div>

        {/* Status Card 2 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-timberwolf/30 rounded-2xl p-5 flex items-start gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <span className="text-xl">🔍</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-night">Vérification d'identité</h3>
              <span className="text-[10px] font-bold uppercase px-2 py-1 bg-orange-100 text-orange-800 rounded-full">En cours</span>
            </div>
            <p className="text-sm text-night/60">
              Tes documents sont en cours d'analyse (max 24h).
            </p>
          </div>
        </motion.div>

        {/* Referral CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm"
        >
          <span className="text-4xl mb-3 block">🎁</span>
          <h3 className="font-bold text-green-900 mb-2">Gagne 2 000 FCFA tout de suite</h3>
          <p className="text-sm text-green-800/80 mb-4">
            Invite un ami à découvrir Sama Naffa. S'il s'inscrit, vous gagnez tous les deux !
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
        transition={{ delay: 0.8 }}
        onClick={() => router.push('/portal/dashboard')}
        className="w-full mt-6 text-sm text-night/60 hover:text-night font-medium transition-colors"
      >
        Aller au tableau de bord complet →
      </motion.button>
    </div>
  );
}
