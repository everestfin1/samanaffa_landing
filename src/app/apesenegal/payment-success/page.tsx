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
    status?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const referenceNumber = searchParams.get('referenceNumber');
  const amount = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');

  // Fetch subscription details and monitor status changes
  useEffect(() => {
    if (!referenceNumber) return;

    const fetchSubscription = async () => {
      try {
        // First, fetch current subscription status
        const res = await fetch(`/api/ape/subscribe?referenceNumber=${encodeURIComponent(referenceNumber)}`);
        const data = await res.json();

        if (data.success && data.subscription) {
          setSubscriptionData(data.subscription);

          // Log the redirect for debugging - DO NOT update status
          console.log('[APE Success] User redirected to success page:', {
            referenceNumber,
            currentStatus: data.subscription.status,
            transactionId,
            amount,
          });

          // Check if payment is actually confirmed
          if (data.subscription.status === 'PAYMENT_SUCCESS') {
            setIsProcessing(false);
            setIsPaymentConfirmed(true);
          } else if (data.subscription.status === 'PAYMENT_FAILED' || data.subscription.status === 'CANCELLED') {
            // Payment failed or cancelled - stop processing
            setIsProcessing(false);
            setIsPaymentConfirmed(false);
          } else {
            // Still processing - status will be updated by callback
            setIsProcessing(true);
          }
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setIsProcessing(false); // Show error state
      }
    };

    fetchSubscription();

    // Set up polling to check for status updates (every 3 seconds for 60 seconds)
    // Extended from 30s to 60s to give more time for Intouch callbacks
    const pollInterval = setInterval(fetchSubscription, 3000);
    const pollTimeout = setTimeout(() => {
      clearInterval(pollInterval);
      setIsProcessing(false); // Stop polling after 60 seconds
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(pollTimeout);
    };
  }, [referenceNumber, transactionId, amount]);

  // Auto-redirect countdown - ONLY starts after payment is confirmed
  useEffect(() => {
    // Don't start countdown until payment is confirmed
    if (!isPaymentConfirmed) return;

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
  }, [router, isPaymentConfirmed]);

  const formatAmount = (value: string | null) => {
    if (!value) return '—';
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num.toLocaleString('fr-FR') + ' FCFA';
  };

  // Show processing state while waiting for callback
  if (isProcessing || !subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Processing Icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Traitement en cours...
            </h1>
            <p className="text-gray-600 mb-6">
              Nous confirmons votre paiement avec notre partenaire bancaire.
              Cette opération peut prendre quelques instants.
            </p>

            {/* Transaction Details (if available) */}
            {subscriptionData && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                <h2 className="font-semibold text-gray-900 mb-4">Détails de la transaction</h2>
                <div className="space-y-3">
                  {referenceNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Référence</span>
                      <span className="font-mono text-sm text-gray-900">{referenceNumber}</span>
                    </div>
                  )}
                  {subscriptionData?.prenom && subscriptionData?.nom && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom</span>
                      <span className="font-medium text-gray-900">
                        {subscriptionData.prenom} {subscriptionData.nom}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      En cours de vérification
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Support Info */}
            <p className="text-sm text-gray-500 mb-6">
              Si cette page reste affichée plus de 60 secondes, veuillez contacter notre support.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/apesenegal"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour à l'accueil
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

  // Show success state only when payment is actually confirmed
  if (subscriptionData?.status === 'PAYMENT_SUCCESS') {
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/apesenegal"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gold-metallic text-white font-medium rounded-lg hover:bg-gold-dark transition-colors"
              >
                Retour à l'accueil
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
              {/* <Link
                href="/apesenegal"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nouvelle souscription
              </Link> */}
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

  // Show error state for failed payments or timeouts
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Confirmation en attente
          </h1>
          <p className="text-gray-600 mb-6">
            Votre paiement est en cours de traitement. Si cette page persiste, contactez notre support.
          </p>

          {/* Transaction Details (if available) */}
          {subscriptionData && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-4">Détails de la transaction</h2>
              <div className="space-y-3">
                {referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Référence</span>
                    <span className="font-mono text-sm text-gray-900">{referenceNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    {subscriptionData.status === 'PAYMENT_INITIATED' ? 'Paiement initié' :
                     subscriptionData.status === 'PENDING' ? 'En attente' :
                     'En cours de vérification'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/apesenegal"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gold-metallic text-white font-medium rounded-lg hover:bg-gold-dark transition-colors"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Actualiser
            </button>
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
