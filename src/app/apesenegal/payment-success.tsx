

import { Suspense, useEffect } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

function PaymentSuccessRedirect() {
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the canonical payment status page with all parameters
    const params = new URLSearchParams();
    Object.entries(searchParams || {}).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    // Ensure source parameter is set
    if (!params.has('source')) {
      params.append('source', 'intouch');
    }
    
    const statusUrl = `/apesenegal/payment-status?${params.toString()}`;
    
    console.log('[APE Success] Redirecting to canonical status page:', statusUrl);
    (navigate as any)({ to: statusUrl, replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirection en cours</h1>
          <p className="text-gray-600 mb-4">
            Nous vous dirigeons vers la page de suivi du paiement afin d'afficher le statut exact envoyé par notre backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/apesenegal/payment-success')({
  component: PaymentSuccessPage,
});

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessRedirect />
    </Suspense>
  );
}
