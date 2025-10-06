'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const transactionId = searchParams.get('transactionId');
  const referenceNumber = searchParams.get('referenceNumber');
  const amount = searchParams.get('amount');
  const status = searchParams.get('status');

  useEffect(() => {
    // Countdown timer
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-light/10 via-white to-gold-light/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gold-metallic/20 p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-night mb-2">
            Paiement réussi !
          </h1>
          <p className="text-gold-dark/80 mb-6">
            Votre transaction a été effectuée avec succès.
          </p>

          {/* Transaction Details */}
          <div className="bg-gold-light/10 rounded-lg p-4 mb-6 text-left space-y-3">
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Montant</span>
                <span className="font-semibold text-night">
                  {Number(amount).toLocaleString()} FCFA
                </span>
              </div>
            )}
            {referenceNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Référence</span>
                <span className="font-mono text-xs text-night">
                  {referenceNumber}
                </span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Transaction ID</span>
                <span className="font-mono text-xs text-night">
                  {transactionId}
                </span>
              </div>
            )}
            {status && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-dark/70">Statut</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {status}
                </span>
              </div>
            )}
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              Votre compte sera mis à jour sous peu. Vous recevrez un email de confirmation.
            </p>
          </div>

          {/* Countdown */}
          <p className="text-sm text-gold-dark/60 mb-6">
            Redirection automatique dans <span className="font-bold text-gold-metallic">{countdown}</span> secondes...
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/portal/sama-naffa')}
              className="w-full bg-gold-metallic hover:bg-gold-dark text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Retour au portail
            </button>
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="w-full border border-gold-metallic/30 text-gold-dark hover:bg-gold-light/10 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Voir le tableau de bord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
