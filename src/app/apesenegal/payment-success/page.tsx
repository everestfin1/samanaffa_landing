'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [subscriptionData, setSubscriptionData] = useState<{
    prenom?: string;
    nom?: string;
    trancheInteresse?: string;
    montantCfa?: string;
  } | null>(null);

  const referenceNumber = searchParams.get('referenceNumber');
  const amount = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');

  // Fetch subscription details
  useEffect(() => {
    if (referenceNumber) {
      fetch(`/api/ape/subscribe?referenceNumber=${encodeURIComponent(referenceNumber)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.subscription) {
            setSubscriptionData(data.subscription);
          }
        })
        .catch(err => console.error('Error fetching subscription:', err));

      // Update subscription status to success
      fetch('/api/ape/subscribe', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber,
          status: 'PAYMENT_SUCCESS',
          providerTransactionId: transactionId,
        }),
      }).catch(err => console.error('Error updating subscription status:', err));
    }
  }, [referenceNumber, transactionId]);

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatAmount = (value: string | null) => {
    if (!value) return '—';
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement Réussi !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre souscription APE a été enregistrée avec succès.
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">Détails de la transaction</h2>
            
            <div className="space-y-3">
              {subscriptionData?.prenom && subscriptionData?.nom && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionData.prenom} {subscriptionData.nom}
                  </span>
                </div>
              )}
              
              {referenceNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence</span>
                  <span className="font-mono text-sm text-gray-900">{referenceNumber}</span>
                </div>
              )}
              
              {transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-sm text-gray-900">{transactionId}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="font-bold text-green-600">
                  {formatAmount(amount || subscriptionData?.montantCfa || null)}
                </span>
              </div>
              
              {subscriptionData?.trancheInteresse && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tranche</span>
                  <span className="font-medium text-gray-900">{subscriptionData.trancheInteresse}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Statut</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Confirmé
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Un email de confirmation vous sera envoyé</li>
              <li>• Notre équipe vous contactera sous 48h</li>
              <li>• Conservez votre numéro de référence</li>
            </ul>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-sm text-gray-500 mb-6">
            Redirection automatique dans {countdown} secondes...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gold-metallic text-white font-medium rounded-lg hover:bg-gold-dark transition-colors"
            >
              Retour à l'accueil
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/ape"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Nouvelle souscription
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Des questions ? Contactez-nous à{' '}
          <a href="mailto:support@everestfin.com" className="text-gold-metallic hover:underline">
            support@everestfin.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ApePaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
