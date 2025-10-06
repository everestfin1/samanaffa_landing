'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const referenceNumber = searchParams.get('referenceNumber');
  const status = searchParams.get('status');
  const reason = searchParams.get('reason');

  useEffect(() => {
    // Countdown timer (longer for failed payments)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/portal/sama-naffa');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const getReasonMessage = (reason: string | null) => {
    if (!reason) return 'Le paiement n\'a pas pu être finalisé.';
    
    const reasonMap: Record<string, string> = {
      'insufficient_funds': 'Solde insuffisant',
      'declined': 'Paiement refusé par votre banque',
      'timeout': 'La transaction a expiré',
      'cancelled': 'Paiement annulé',
      'invalid_card': 'Carte invalide',
      'network_error': 'Erreur de connexion',
    };

    return reasonMap[reason.toLowerCase()] || reason;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-red-50/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-night mb-2">
            Paiement échoué
          </h1>
          <p className="text-gold-dark/80 mb-6">
            {getReasonMessage(reason)}
          </p>

          {/* Transaction Details */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 text-left space-y-3">
            {referenceNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Référence</span>
                <span className="font-mono text-xs text-night">
                  {referenceNumber}
                </span>
              </div>
            )}
            {status && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Statut</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {status}
                </span>
              </div>
            )}
            {reason && (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gold-dark/70">Raison</span>
                <span className="text-sm text-night">
                  {getReasonMessage(reason)}
                </span>
              </div>
            )}
          </div>

          {/* Help Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">
              Que faire maintenant ?
            </h3>
            <ul className="text-sm text-blue-800 text-left space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Vérifiez votre solde et réessayez</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Utilisez un autre moyen de paiement</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contactez notre support si le problème persiste</span>
              </li>
            </ul>
          </div>

          {/* Countdown */}
          <p className="text-sm text-gold-dark/60 mb-6">
            Redirection automatique dans <span className="font-bold text-red-600">{countdown}</span> secondes...
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/portal/sama-naffa')}
              className="w-full bg-gold-metallic hover:bg-gold-dark text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Réessayer le paiement
            </button>
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="w-full border border-gold-metallic/30 text-gold-dark hover:bg-gold-light/10 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Retour au tableau de bord
            </button>
            <button
              onClick={() => router.push('/assistance')}
              className="w-full text-sm text-gold-dark hover:text-gold-metallic font-medium py-2 transition-colors"
            >
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-red-50/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-200 p-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
