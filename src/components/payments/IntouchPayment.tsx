'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface IntouchPaymentProps {
  amount: number;
  userId: string;
  accountType: 'sama_naffa' | 'ape_investment';
  intentType: 'deposit' | 'investment' | 'withdrawal';
  referenceNumber: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

interface IntouchPaymentData {
  transactionId: string;
  amount: number;
  referenceNumber: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
}

declare global {
  interface Window {
    sendPaymentInfos: (
      transactionId: string | number,
      merchantId: string,
      apiKey: string,
      domain: string,
      customerName: string,
      param6: string,
      amount: number,
      city: string,
      phone: string,
      email: string,
      description: string,
      param12: string,
      param13: string
    ) => void;
  }
}

export default function IntouchPayment({
  amount,
  userId,
  accountType,
  intentType,
  referenceNumber,
  onSuccess,
  onError,
  onCancel
}: IntouchPaymentProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<IntouchPaymentData | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Create transaction intent first
      const response = await fetch('/api/transactions/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountType,
          intentType,
          amount,
          paymentMethod: 'intouch',
          referenceNumber,
          userNotes: `Paiement via Intouch - ${intentType}`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la transaction');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la création de la transaction');
      }

      // Store payment data
      const transactionData: IntouchPaymentData = {
        transactionId: result.transactionId,
        amount,
        referenceNumber,
        status: 'pending'
      };
      setPaymentData(transactionData);

      // Call Intouch payment function
      if (window.sendPaymentInfos) {
        const customerName = session?.user?.name || 'Client';
        const customerEmail = session?.user?.email || '';
        const customerPhone = (session?.user as any)?.phone || '';
        
        window.sendPaymentInfos(
          parseInt(result.transactionId) || new Date().getTime(),
          process.env.NEXT_PUBLIC_INTOUCH_MERCHANT_ID || '***REMOVED***',
          process.env.NEXT_PUBLIC_INTOUCH_API_KEY || '***REMOVED***',
          process.env.NEXT_PUBLIC_INTOUCH_DOMAIN || 'everestfin.com',
          '', // customerName - empty like HTML example
          '', // param6 - empty like HTML example
          amount, // amount in position 7 like HTML example
          'Dakar', // city
          '', // phone - empty like HTML example
          '', // email - empty like HTML example
          `${intentType.toUpperCase()} - ${referenceNumber}`, // description
          '', // extra param12 like HTML
          ''  // extra param13 like HTML
        );
      } else {
        throw new Error('Système de paiement Intouch non disponible');
      }

    } catch (error) {
      console.error('Payment error:', error);
      onError(error instanceof Error ? error.message : 'Erreur lors du traitement du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  // Load Intouch script and auto-initiate payment
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      console.log('Intouch payment script loaded');
      // Auto-initiate payment after script loads
      setTimeout(() => {
        handlePayment();
      }, 500); // Small delay for better UX
    };

    script.onerror = () => {
      onError('Erreur lors du chargement du système de paiement Intouch');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="touchpay"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []); // Empty dependency array since handlePayment doesn't depend on changing props

  // Listen for payment completion
  useEffect(() => {
    const handlePaymentResult = (event: MessageEvent) => {
      if (event.data && event.data.type === 'INTOUCH_PAYMENT_RESULT') {
        const { status, transactionId } = event.data;
        
        if (status === 'success') {
          setPaymentData(prev => prev ? { ...prev, status: 'success' } : null);
          onSuccess(transactionId);
        } else if (status === 'failed') {
          setPaymentData(prev => prev ? { ...prev, status: 'failed' } : null);
          onError('Paiement échoué');
        } else if (status === 'cancelled') {
          setPaymentData(prev => prev ? { ...prev, status: 'cancelled' } : null);
          onCancel();
        }
      }
    };

    // Also listen for Intouch-specific events
    const handleIntouchResult = (event: any) => {
      console.log('Intouch payment event:', event);
      if (event.detail) {
        const { status, transactionId } = event.detail;
        
        if (status === 'success' || status === 'completed') {
          setPaymentData(prev => prev ? { ...prev, status: 'success' } : null);
          onSuccess(transactionId);
        } else if (status === 'failed' || status === 'error') {
          setPaymentData(prev => prev ? { ...prev, status: 'failed' } : null);
          onError('Paiement échoué');
        } else if (status === 'cancelled') {
          setPaymentData(prev => prev ? { ...prev, status: 'cancelled' } : null);
          onCancel();
        }
      }
    };

    window.addEventListener('message', handlePaymentResult);
    window.addEventListener('intouch-payment-result', handleIntouchResult);
    
    return () => {
      window.removeEventListener('message', handlePaymentResult);
      window.removeEventListener('intouch-payment-result', handleIntouchResult);
    };
  }, [onSuccess, onError, onCancel]);

  return (
    <div className="space-y-4">
      <div className="bg-gold-light/20 border border-gold-metallic rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gold-metallic rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <div>
            <h3 className="font-semibold text-gold-dark">Paiement via Intouch</h3>
            <p className="text-sm text-gold-dark/80">
              Montant: {amount.toLocaleString()} FCFA
            </p>
            <p className="text-xs text-gold-dark/60">
              Référence: {referenceNumber}
            </p>
          </div>
        </div>
      </div>

      {paymentData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              paymentData.status === 'success' ? 'bg-green-500' :
              paymentData.status === 'failed' ? 'bg-red-500' :
              paymentData.status === 'cancelled' ? 'bg-yellow-500' :
              'bg-blue-500 animate-pulse'
            }`} />
            <span className="text-sm font-medium">
              {paymentData.status === 'success' ? 'Paiement réussi' :
               paymentData.status === 'failed' ? 'Paiement échoué' :
               paymentData.status === 'cancelled' ? 'Paiement annulé' :
               'En cours de traitement...'}
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handlePayment}
          disabled={isLoading || (paymentData?.status !== 'pending')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            isLoading || (paymentData?.status !== 'pending')
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gold-metallic hover:bg-gold-dark text-white'
          }`}
        >
          {isLoading ? 'Traitement...' : 'Payer avec Intouch'}
        </button>
        
        <button
          onClick={onCancel}
          className="flex-1 border border-timberwolf/30 text-night py-3 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
