'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface IntouchPaymentProps {
  amount: number;
  userId: string;
  accountId?: string | null;
  accountType: 'sama_naffa' | 'ape_investment';
  intentType: 'deposit' | 'investment' | 'withdrawal';
  referenceNumber: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  investmentTranche?: 'A' | 'B' | 'C' | 'D';
  investmentTerm?: 3 | 5 | 7 | 10;
}

interface IntouchPaymentData {
  transactionId: string;
  amount: number;
  referenceNumber: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
}

type TransactionIntentResponse =
  | {
      success: true;
      transactionId: string;
      transactionIntent: {
        id: string;
        referenceNumber: string;
        amount: number;
        status: string;
        createdAt: string;
      };
    }
  | {
      success: false;
      error: string;
      code?: string;
      kycStatus?: string;
    };

declare global {
  interface Window {
    sendPaymentInfos: (
      orderNumber: string | number,
      agencyCode: string,
      secureCode: string,
      domainName: string,
      urlRedirectionSuccess: string,
      urlRedirectionFailed: string,
      amount: number,
      city: string,
      email: string,
      clientFirstName: string,
      clientLastName: string,
      clientPhone: string
    ) => void;
  }
}

const INTOUCH_SCRIPT_URL =
  'https://touchpay.gutouch.net/touchpayv2/script/touchpaynr/prod_touchpay-0.0.1.js';

export default function IntouchPayment({
  amount,
  userId,
  accountId,
  accountType,
  intentType,
  referenceNumber,
  onSuccess,
  onError,
  onCancel,
  investmentTranche,
  investmentTerm,
}: IntouchPaymentProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<IntouchPaymentData | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  const paymentStartedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Determine environment (test or production)
  const isTestEnvironment = process.env.NODE_ENV !== 'production';

  // Use test or production credentials based on environment
  const merchantId = isTestEnvironment
    ? process.env.NEXT_PUBLIC_INTOUCH_TEST_MERCHANT_ID
    : process.env.NEXT_PUBLIC_INTOUCH_MERCHANT_ID;
  
  const domain = isTestEnvironment
    ? process.env.NEXT_PUBLIC_INTOUCH_TEST_DOMAIN
    : process.env.NEXT_PUBLIC_INTOUCH_DOMAIN;

  const [apiKey, setApiKey] = useState<string>('');
  const [environment, setEnvironment] = useState<'test' | 'production'>('production');

  const resetPaymentState = useCallback(() => {
    paymentStartedRef.current = false;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  }, []);

  const handleIntentError = useCallback(
    (payload: TransactionIntentResponse | null, fallbackMessage?: string) => {
      const defaultMessage =
        fallbackMessage || 'Erreur lors de la création de la transaction Intouch';

      if (payload && payload.success === false) {
        let errorMessage =
          payload.error ||
          defaultMessage ||
          'Erreur lors de la création de la transaction Intouch';

        switch (payload.code) {
          case 'kyc_required':
            errorMessage =
              payload.error ||
              "Votre identité doit être vérifiée avant d'effectuer cette transaction.";
            setStatusMessage(
              intentType === 'withdrawal'
                ? "Vérification d'identité requise pour les retraits. Veuillez attendre la validation de vos documents."
                : "Erreur inattendue: vérification KYC requise pour ce type de transaction."
            );
            break;
          case 'account_not_found':
            errorMessage =
              "Aucun compte associé n'a été trouvé. Merci de contacter le support.";
            setStatusMessage(errorMessage);
            break;
          case 'invalid_intent_type':
            errorMessage =
              'Type de transaction non pris en charge. Veuillez réessayer ou contacter le support.';
            setStatusMessage(errorMessage);
            break;
          case 'invalid_account_type':
            errorMessage =
              'Type de compte invalide pour ce paiement. Vérifiez vos informations.';
            setStatusMessage(errorMessage);
            break;
          case 'missing_fields':
            errorMessage =
              'Informations manquantes pour initier le paiement. Veuillez réessayer.';
            setStatusMessage(errorMessage);
            break;
          case 'invalid_investment_tranche':
            errorMessage =
              'Tranche d’investissement invalide. Vérifiez les détails saisis.';
            setStatusMessage(errorMessage);
            break;
          case 'invalid_investment_term':
            errorMessage =
              'Durée d’investissement invalide. Veuillez sélectionner une durée autorisée.';
            setStatusMessage(errorMessage);
            break;
          default:
            setStatusMessage(errorMessage);
        }

        onError(errorMessage);
      } else {
        onError(defaultMessage);
        setStatusMessage(defaultMessage);
      }

      resetPaymentState();
    },
    [onError, resetPaymentState, intentType]
  );

  const handlePayment = useCallback(async () => {
    console.log('handlePayment called - starting payment process');
    if (paymentStartedRef.current) {
      console.log('Payment already started, returning');
      return;
    }

    if (!merchantId || !apiKey || !domain) {
      console.log(`Intouch configuration check (${environment.toUpperCase()} mode):`, {
        environment: environment,
        merchantId: merchantId ? 'SET' : 'MISSING',
        apiKey: apiKey ? 'SET' : 'MISSING',
        domain: domain ? 'SET' : 'MISSING',
        merchantIdValue: merchantId,
        apiKeyValue: apiKey ? '***' : 'MISSING',
        domainValue: domain
      });
      const message =
        `Configuration Intouch manquante pour l'environnement ${environment} (merchantId, apiKey ou domain).`;
      setStatusMessage(message);
      onError(message);
      return;
    }

    paymentStartedRef.current = true;
    setIsLoading(true);
    setStatusMessage('Initialisation du paiement Intouch...');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/transactions/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          accountId,
          accountType,
          intentType,
          amount,
          paymentMethod: 'intouch',
          referenceNumber,
          userNotes: `Paiement via Intouch - ${intentType}`,
          ...(investmentTranche && { investmentTranche }),
          ...(investmentTerm && { investmentTerm }),
        }),
        signal: controller.signal,
      });

      const result = (await response
        .json()
        .catch(() => null)) as TransactionIntentResponse | null;

      if (!response.ok || !result || result.success === false) {
        const errorPayload = !result
          ? null
          : result.success === false
          ? result
          : null;

        const fallbackMessage =
          result && result.success === false && result.error
            ? result.error
            : 'Impossible de créer la transaction Intouch';

        handleIntentError(errorPayload, fallbackMessage);
        return;
      }

      const transactionId = result.transactionId;

      setPaymentData({
        transactionId,
        amount,
        referenceNumber,
        status: 'pending',
      });
      setStatusMessage(
        'Paiement initié. Veuillez finaliser dans la fenêtre Intouch.'
      );

      if (typeof window.sendPaymentInfos !== 'function') {
        throw new Error(
          'Système de paiement Intouch non disponible dans le navigateur.'
        );
      }

      const customerFirstName = (session?.user as any)?.firstName || session?.user?.name?.split(' ')[0] || 'Client';
      const customerLastName = (session?.user as any)?.lastName || session?.user?.name?.split(' ')[1] || 'Sama Naffa';
      const customerEmail = session?.user?.email || '';
      const customerPhone = (session?.user as any)?.phone || '';

      // Construct redirect URLs with query parameters
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://samanaffa.com';
      const successUrl = `${baseUrl}/portal/sama-naffa/payment-success?transactionId=${transactionId}&referenceNumber=${encodeURIComponent(referenceNumber)}&amount=${amount}&status=success&accountType=${accountType}`;
      const failedUrl = `${baseUrl}/portal/sama-naffa/payment-failed?referenceNumber=${encodeURIComponent(referenceNumber)}&status=failed&accountType=${accountType}`;

      console.log('[InTouch Payment] Constructing redirect URLs');
      console.log('[InTouch Payment] Success URL:', successUrl);
      console.log('[InTouch Payment] Failed URL:', failedUrl);
      console.log('[InTouch Payment] Transaction Details:', {
        transactionId,
        referenceNumber,
        amount,
        accountType,
        intentType,
        userId,
      });

      console.log('[InTouch Payment] Calling sendPaymentInfos with parameters:', {
        orderNumber: referenceNumber,
        agencyCode: merchantId,
        secureCode: apiKey ? '***' : 'MISSING',
        domainName: domain,
        urlRedirectionSuccess: successUrl,
        urlRedirectionFailed: failedUrl,
        amount: Number(amount),
        city: 'Dakar',
        email: customerEmail,
        clientFirstName: customerFirstName,
        clientLastName: customerLastName,
        clientPhone: customerPhone
      });

      window.sendPaymentInfos(
        referenceNumber,
        merchantId,
        apiKey,
        domain,
        successUrl,
        failedUrl,
        Number(amount),
        'Dakar',
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone
      );
    } catch (error) {
      console.error('Intouch payment error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors du traitement du paiement Intouch';

      setPaymentData((prev) =>
        prev ? { ...prev, status: 'failed' } : prev
      );
      setStatusMessage(message);
      onError(message);
      resetPaymentState();
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    accountType,
    accountId,
    amount,
    apiKey,
    domain,
    handleIntentError,
    intentType,
    investmentTerm,
    investmentTranche,
    merchantId,
    onError,
    referenceNumber,
    resetPaymentState,
    session?.user,
    userId,
  ]);

  // Fetch API key from server
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/payments/intouch/config');
        const data = await response.json();
        setApiKey(data.apiKey);
        setEnvironment(data.environment || 'production');
        
        console.log(`[InTouch Payment] Loaded ${data.environment?.toUpperCase()} configuration`);
      } catch (error) {
        console.error('Failed to fetch Intouch API key:', error);
        setLoadError('Erreur de configuration Intouch');
      } finally {
        setConfigLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    console.log(`IntouchPayment component mounted - checking configuration (${isTestEnvironment ? 'TEST' : 'PRODUCTION'} mode):`);
    console.log('Environment:', isTestEnvironment ? 'TEST/DEVELOPMENT' : 'PRODUCTION');
    console.log('Merchant ID:', merchantId ? 'SET' : 'MISSING');
    console.log('API Key:', apiKey ? 'SET' : 'MISSING');
    console.log('Domain:', domain ? 'SET' : 'MISSING');

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.sendPaymentInfos === 'function') {
      setScriptReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-intouch-script="true"]'
    );

    const handleLoad = () => {
      console.log('Intouch script loaded successfully');
      setLoadError(null);
      setScriptReady(true);
    };

    const handleError = () => {
      console.log('Intouch script failed to load');
      const message =
        'Erreur lors du chargement du système de paiement Intouch.';
      setLoadError(message);
      setStatusMessage(message);
      onError(message);
    };

    if (existingScript) {
      if (existingScript.getAttribute('data-loaded') === 'true') {
        handleLoad();
      } else {
        existingScript.addEventListener('load', handleLoad);
        existingScript.addEventListener('error', handleError);
      }

      return () => {
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
    }

    const script = document.createElement('script');
    script.src = INTOUCH_SCRIPT_URL;
    script.type = 'text/javascript';
    script.async = true;
    script.dataset.intouchScript = 'true';
    script.onload = () => {
      script.setAttribute('data-loaded', 'true');
      handleLoad();
    };
    script.onerror = handleError;

    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [onError, apiKey, domain, merchantId]);

  useEffect(() => {
    if (scriptReady && !loadError && !configLoading && !paymentStartedRef.current) {
      handlePayment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, loadError, configLoading, apiKey, domain, merchantId]);

  useEffect(() => {
    const handlePaymentResult = (event: MessageEvent) => {
      console.log('[InTouch Payment] Received message event:', event.data);
      
      if (!event.data || event.data.type !== 'INTOUCH_PAYMENT_RESULT') {
        return;
      }

      const { status, transactionId } = event.data;
      console.log('[InTouch Payment] Payment result:', { status, transactionId });

      if (status === 'success') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'success' } : null
        );
        setStatusMessage('Paiement réussi.');
        onSuccess(transactionId);
      } else if (status === 'failed') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'failed' } : null
        );
        setStatusMessage('Paiement échoué. Veuillez réessayer.');
        onError('Paiement échoué');
        resetPaymentState();
      } else if (status === 'cancelled') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'cancelled' } : null
        );
        setStatusMessage('Paiement annulé.');
        onCancel();
        resetPaymentState();
      }
    };

    const handleIntouchEvent = (event: CustomEvent) => {
      console.log('[InTouch Payment] Received InTouch event:', event.detail);
      
      if (!event.detail) {
        return;
      }

      const { status, transactionId } = event.detail;
      console.log('[InTouch Payment] InTouch event status:', { status, transactionId });

      if (status === 'success' || status === 'completed') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'success' } : null
        );
        setStatusMessage('Paiement réussi.');
        onSuccess(transactionId);
      } else if (status === 'failed' || status === 'error') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'failed' } : null
        );
        setStatusMessage('Paiement échoué. Veuillez réessayer.');
        onError('Paiement échoué');
        resetPaymentState();
      } else if (status === 'cancelled') {
        setPaymentData((prev) =>
          prev ? { ...prev, status: 'cancelled' } : null
        );
        setStatusMessage('Paiement annulé.');
        onCancel();
        resetPaymentState();
      }
    };

    window.addEventListener('message', handlePaymentResult);
    window.addEventListener(
      'intouch-payment-result',
      handleIntouchEvent as EventListener
    );

    return () => {
      window.removeEventListener('message', handlePaymentResult);
      window.removeEventListener(
        'intouch-payment-result',
        handleIntouchEvent as EventListener
      );
      abortControllerRef.current?.abort();
    };
  }, [onCancel, onError, onSuccess, resetPaymentState]);

  const handleRetry = () => {
    setPaymentData(null);
    setStatusMessage(null);
    resetPaymentState();
    if (scriptReady && !loadError) {
      handlePayment();
    }
  };

  const disableAction =
    isLoading ||
    !scriptReady ||
    loadError !== null ||
    configLoading ||
    (paymentData?.status === 'pending' && paymentStartedRef.current);

  return (
    <div className="space-y-4">
      <div className="bg-gold-light/20 border border-gold-metallic rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gold-metallic rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gold-dark">Paiement via Intouch</h3>
              {environment === 'test' && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">
                  TEST
                </span>
              )}
            </div>
            <p className="text-sm text-gold-dark/80">
              Montant: {amount.toLocaleString()} FCFA
            </p>
            <p className="text-xs text-gold-dark/60">
              Référence: {referenceNumber}
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          {statusMessage}
        </div>
      )}

      {paymentData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                paymentData.status === 'success'
                  ? 'bg-green-500'
                  : paymentData.status === 'failed'
                  ? 'bg-red-500'
                  : paymentData.status === 'cancelled'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500 animate-pulse'
              }`}
            />
            <span className="text-sm font-medium">
              {paymentData.status === 'success'
                ? 'Paiement réussi'
                : paymentData.status === 'failed'
                ? 'Paiement échoué'
                : paymentData.status === 'cancelled'
                ? 'Paiement annulé'
                : 'En cours de traitement...'}
            </span>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handlePayment}
          disabled={disableAction}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            disableAction
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gold-metallic hover:bg-gold-dark text-white'
          }`}
        >
          {configLoading
            ? 'Configuration...'
            : isLoading
            ? 'Traitement...'
            : 'Payer avec Intouch'}
        </button>

        <button
          onClick={onCancel}
          className="flex-1 border border-timberwolf/30 text-night py-3 px-4 rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
        >
          Annuler
        </button>
      </div>

      {(paymentData?.status === 'failed' || paymentData?.status === 'cancelled') && (
        <button
          onClick={handleRetry}
          className="w-full py-2 px-4 text-sm font-medium text-gold-dark border border-gold-metallic rounded-lg hover:bg-gold-light/20 transition-colors"
        >
          Réessayer le paiement
        </button>
      )}
    </div>
  );
}
