'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircleIcon, ArrowPathIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Map common error codes to user-friendly messages
const errorMessages: Record<string, string> = {
  insufficient_funds: 'Fonds insuffisants sur votre compte',
  card_declined: 'Carte refusée par votre banque',
  expired_card: 'Carte expirée',
  invalid_card: 'Numéro de carte invalide',
  timeout: 'La transaction a expiré',
  cancelled: 'Transaction annulée',
  network_error: 'Erreur de connexion',
  default: 'Une erreur est survenue lors du paiement',
};

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(15);

  const referenceNumber = searchParams.get('referenceNumber');
  const reason = searchParams.get('reason');

  // Update status as fallback if callback hasn't processed it yet
  useEffect(() => {
    if (!referenceNumber) return;

    const updateFailedStatus = async () => {
      try {
        // Fetch current status
        const res = await fetch(`/api/ape/subscribe?referenceNumber=${encodeURIComponent(referenceNumber)}`);
        const data = await res.json();
        
        if (data.success && data.subscription) {
          // If status is still PAYMENT_INITIATED or PENDING, update to FAILED
          if (data.subscription.status === 'PAYMENT_INITIATED' || data.subscription.status === 'PENDING') {
            console.log('[APE Failed] Callback not received yet, updating status via fallback');
            await fetch('/api/ape/subscribe', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                referenceNumber,
                status: 'PAYMENT_FAILED',
                providerStatus: reason || 'failed_redirect',
              }),
            });
          }
        }
      } catch (err) {
        console.error('Error updating subscription status:', err);
      }
    };

    updateFailedStatus();
  }, [referenceNumber, reason]);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/apesenegal');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const getErrorMessage = () => {
    if (reason && errorMessages[reason]) {
      return errorMessages[reason];
    }
    return errorMessages.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircleIcon className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement Échoué
          </h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>

          {/* Error Details */}
          <div className="bg-red-50 rounded-xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-red-900 mb-4">Détails de l'erreur</h2>
            
            <div className="space-y-3">
              {referenceNumber && (
                <div className="flex justify-between">
                  <span className="text-red-700">Référence</span>
                  <span className="font-mono text-sm text-red-900">{referenceNumber}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-red-700">Statut</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Échoué
                </span>
              </div>
              
              {reason && (
                <div className="flex justify-between">
                  <span className="text-red-700">Raison</span>
                  <span className="text-red-900">{reason}</span>
                </div>
              )}
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-amber-900 mb-2">Que faire ?</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Vérifiez que vous avez suffisamment de fonds</li>
              <li>• Assurez-vous que votre carte est valide</li>
              <li>• Essayez avec un autre moyen de paiement</li>
              <li>• Contactez votre banque si le problème persiste</li>
            </ul>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-sm text-gray-500 mb-6">
            Redirection vers la page APE dans {countdown} secondes...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/apesenegal"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gold-metallic text-white font-medium rounded-lg hover:bg-gold-dark transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Réessayer
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour à l'accueil
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href="mailto:support@everestfin.com" className="text-gold-metallic hover:underline">
            support@everestfin.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ApePaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
