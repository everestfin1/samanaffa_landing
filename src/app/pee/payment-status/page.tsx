'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ProductPageShell from '@/components/APE/ProductPageShell';
import { SAMA_NAFFA_CONTACT } from '@/lib/contact';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [subscriptionData, setSubscriptionData] = useState<{
    prenom?: string;
    nom?: string;
    montantCfa?: string;
    status?: string;
    providerStatus?: string;
    providerTransactionId?: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasPollingTimedOut, setHasPollingTimedOut] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const referenceNumber = searchParams.get('referenceNumber');
  const amount = searchParams.get('amount');
  const transactionId = searchParams.get('transactionId');
  const source = searchParams.get('source') || 'intouch';

  // Fetch subscription details and monitor status changes
  useEffect(() => {
    if (!referenceNumber) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/pee/subscribe?referenceNumber=${encodeURIComponent(referenceNumber)}`);
        const data = await res.json();

        if (data.success && data.subscription) {
          setSubscriptionData(data.subscription);

          console.log('[PEE Status] User redirected to status page:', {
            referenceNumber,
            currentStatus: data.subscription.status,
            transactionId,
            amount,
            source,
          });

          if (data.subscription.status === 'PAYMENT_SUCCESS') {
            setIsProcessing(false);
            setIsPaymentConfirmed(true);
          } else if (data.subscription.status === 'PAYMENT_FAILED' || data.subscription.status === 'CANCELLED') {
            setIsProcessing(false);
            setIsPaymentConfirmed(false);
          } else {
            setIsProcessing(true);
          }
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setIsProcessing(false);
      }
    };

    fetchSubscription();

    const pollInterval = setInterval(fetchSubscription, 3000);
    const pollTimeout = setTimeout(() => {
      clearInterval(pollInterval);
      setIsProcessing(false);
      setHasPollingTimedOut(true);
    }, 60000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(pollTimeout);
    };
  }, [referenceNumber, transactionId, amount, source]);

  // Auto-redirect countdown - ONLY starts after payment is confirmed
  useEffect(() => {
    if (!isPaymentConfirmed) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/sama-naffa');
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

  // Get the appropriate icon based on payment status
  const getStatusIcon = () => {
    if (isProcessing) {
      return (
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (subscriptionData?.status === 'PAYMENT_SUCCESS') {
      return (
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-green-600" />
        </div>
      );
    }
    
    return (
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ExclamationTriangleIcon className="w-12 h-12 text-amber-600" />
      </div>
    );
  };

  // Get the appropriate title and message based on payment status
  const getStatusContent = () => {
    if (isProcessing) {
      return {
        title: 'Traitement en cours...',
        message: 'Nous confirmons votre paiement avec notre partenaire bancaire. Cette opération peut prendre quelques instants.',
        statusBadge: 'En cours de vérification',
        statusColor: 'blue'
      };
    }
    
    if (subscriptionData?.status === 'PAYMENT_SUCCESS') {
      return {
        title: 'Paiement Réussi !',
        message: 'Votre souscription Educ\'épargne a été enregistrée avec succès.',
        statusBadge: 'Confirmé',
        statusColor: 'green'
      };
    }
    
    if (subscriptionData?.status === 'PAYMENT_FAILED') {
      return {
        title: 'Paiement Échoué',
        message: 'Votre paiement n\'a pas pu être traité. Veuillez réessayer ou contacter notre support.',
        statusBadge: 'Échoué',
        statusColor: 'red'
      };
    }
    
    if (subscriptionData?.status === 'CANCELLED') {
      return {
        title: 'Paiement Annulé',
        message: 'Le paiement a été annulé. Vous pouvez initier une nouvelle souscription si vous le souhaitez.',
        statusBadge: 'Annulé',
        statusColor: 'gray'
      };
    }
    
    return {
      title: 'Confirmation en attente',
      message: 'Votre paiement est en cours de traitement. Si cette page persiste, contactez notre support.',
      statusBadge: subscriptionData?.status === 'PAYMENT_INITIATED' ? 'Paiement initié' :
                   subscriptionData?.status === 'PENDING' ? 'En attente' :
                   'En cours de vérification',
      statusColor: 'amber'
    };
  };

  const statusContent = getStatusContent();
  const statusIcon = getStatusIcon();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          {statusIcon}

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {statusContent.title}
          </h1>
          <p className="text-gray-600 mb-6">
            {statusContent.message}
          </p>

          {/* Transaction Details */}
          {subscriptionData && (
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

                {(transactionId || subscriptionData?.providerTransactionId) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-sm text-gray-900">
                      {transactionId || subscriptionData?.providerTransactionId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className={`font-bold ${
                    subscriptionData?.status === 'PAYMENT_SUCCESS' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {formatAmount(amount || subscriptionData?.montantCfa || null)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Produit</span>
                  <span className="font-medium text-gray-900">Educ'épargne</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusContent.statusColor}-100 text-${statusContent.statusColor}-800`}>
                    {statusContent.statusBadge}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps - Only show for successful payments */}
          {subscriptionData?.status === 'PAYMENT_SUCCESS' && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">Prochaines étapes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Un email de confirmation vous sera envoyé</li>
                <li>• Notre équipe vous contactera sous 48h</li>
                <li>• Conservez votre numéro de référence</li>
              </ul>
            </div>
          )}

          {/* Auto-redirect notice - Only show for successful payments */}
          {isPaymentConfirmed && (
            <p className="text-sm text-gray-500 mb-6">
              Redirection automatique dans {countdown} secondes...
            </p>
          )}

          {/* Support Info for processing/failed states */}
          {isProcessing && (
            <p className="text-sm text-gray-500 mb-6">
              Si cette page reste affichée plus de 60 secondes, veuillez contacter notre support.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/sama-naffa"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#C09037] text-white font-medium rounded-lg hover:bg-[#b3830f] transition-colors"
            >
              Retour à l'accueil
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
            
            {/* Show retry button for failed payments */}
            {subscriptionData?.status === 'PAYMENT_FAILED' && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Réessayer
              </button>
            )}
            
            {/* Show refresh button for processing/timeout states */}
            {(isProcessing || hasPollingTimedOut) && (
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Actualiser
              </button>
            )}
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href={SAMA_NAFFA_CONTACT.emailHref} className="text-[#C09037] hover:underline">
            {SAMA_NAFFA_CONTACT.email}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PeePaymentStatusPage() {
  return (
    <ProductPageShell product="pee">
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        </div>
      }>
        <PaymentStatusContent />
      </Suspense>
    </ProductPageShell>
  );
}
