'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const STATUS_PAGE_PATH = '/apesenegal/payment-status';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serializedParams = searchParams.toString();
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null);

  const statusUrl = useMemo(() => {
    if (!serializedParams) {
      return STATUS_PAGE_PATH;
    }
    return `${STATUS_PAGE_PATH}?${serializedParams}`;
  }, [serializedParams]);

  useEffect(() => {
    setRedirectTarget(statusUrl);
    router.replace(statusUrl);
  }, [router, statusUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirection en cours</h1>
          <p className="text-gray-600 mb-4">
            Nous vous dirigeons vers la page de suivi du paiement afin d'afficher le statut exact envoyé par notre backend.
          </p>
          {redirectTarget && (
            <p className="text-sm text-gray-500">
              Si la redirection ne fonctionne pas, <a href={redirectTarget} className="text-gold-metallic underline">cliquez ici</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApePaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
