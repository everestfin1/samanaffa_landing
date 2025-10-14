'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [processing, setProcessing] = useState(true);
  const [processingStatus, setProcessingStatus] = useState<'checking' | 'processing' | 'completed' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const transactionId = searchParams.get('transactionId');
  const referenceNumber = searchParams.get('referenceNumber');
  const amount = searchParams.get('amount');
  const status = searchParams.get('status');
  
  // InTouch specific parameters
  const errorCode = searchParams.get('errorCode');
  const numTransactionFromGu = searchParams.get('num_transaction_from_gu');

  // Check if callback was received and process if not
  useEffect(() => {
    const checkAndProcessPayment = async () => {
      if (!referenceNumber) {
        console.error('[Payment Success] No reference number in URL');
        setProcessing(false);
        setProcessingStatus('error');
        setErrorMessage('Référence de transaction manquante');
        return;
      }

      console.log('[Payment Success] Checking transaction status:', {
        referenceNumber,
        errorCode,
        numTransactionFromGu,
      });

      try {
        // Wait 3 seconds to allow callback to arrive
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check transaction status
        const response = await fetch(`/api/transactions?referenceNumber=${referenceNumber}`);
        const data = await response.json();

        if (data.success && data.transactions && data.transactions.length > 0) {
          const transaction = data.transactions[0];
          
          console.log('[Payment Success] Transaction status:', transaction.status);

          if (transaction.status === 'COMPLETED') {
            // Already processed by callback
            console.log('[Payment Success] Transaction already completed via callback');
            setProcessingStatus('completed');
            setProcessing(false);
            return;
          }

          // Transaction still pending - process manually
          if (transaction.status === 'PENDING' && errorCode) {
            console.log('[Payment Success] Transaction pending, processing manually');
            setProcessingStatus('processing');

            const manualResponse = await fetch('/api/payments/intouch/manual-callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                referenceNumber,
                errorCode,
                num_transaction_from_gu: numTransactionFromGu,
                amount,
              }),
            });

            const manualResult = await manualResponse.json();

            if (manualResult.success) {
              console.log('[Payment Success] Manual processing successful');
              setProcessingStatus('completed');
            } else {
              console.error('[Payment Success] Manual processing failed:', manualResult);
              setProcessingStatus('error');
              setErrorMessage(manualResult.error || 'Erreur lors du traitement du paiement');
            }
          } else {
            setProcessingStatus('completed');
          }
        } else {
          console.error('[Payment Success] Transaction not found');
          setProcessingStatus('error');
          setErrorMessage('Transaction non trouvée');
        }
      } catch (error) {
        console.error('[Payment Success] Error checking/processing payment:', error);
        setProcessingStatus('error');
        setErrorMessage('Erreur lors de la vérification du paiement');
      } finally {
        setProcessing(false);
      }
    };

    checkAndProcessPayment();
  }, [referenceNumber, errorCode, numTransactionFromGu, amount]);

  useEffect(() => {
    // Countdown timer - only start after processing complete
    if (!processing) {
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
    }
  }, [router, processing]);

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

          {/* Processing Status Messages */}
          {processing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-blue-900">
                  {processingStatus === 'checking' && 'Vérification du paiement...'}
                  {processingStatus === 'processing' && 'Traitement du paiement en cours...'}
                </p>
              </div>
            </div>
          )}

          {!processing && processingStatus === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-900">
                ✓ Paiement confirmé ! Votre compte a été mis à jour. Vous recevrez un email de confirmation.
              </p>
            </div>
          )}

          {!processing && processingStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-900 font-medium mb-1">
                Erreur de traitement
              </p>
              <p className="text-xs text-red-800">
                {errorMessage || 'Une erreur est survenue lors du traitement. Veuillez contacter le support.'}
              </p>
            </div>
          )}

          {/* Countdown */}
          {!processing && (
            <p className="text-sm text-gold-dark/60 mb-6">
              Redirection automatique dans <span className="font-bold text-gold-metallic">{countdown}</span> secondes...
            </p>
          )}

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

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gold-light/10 via-white to-gold-light/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gold-metallic/20 p-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full mb-6"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
