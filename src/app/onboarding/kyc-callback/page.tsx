'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function KycCallbackContent() {
  const params = useSearchParams();
  const status = params.get('status') ?? '';

  useEffect(() => {
    // Attempt to close the tab automatically after a short delay
    const timer = setTimeout(() => {
      window.close();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isSuccess = ['Approved', 'In Review'].includes(status);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm text-center space-y-4">
        <span className="text-6xl block">{isSuccess ? '✅' : status === 'Declined' ? '❌' : '⏳'}</span>
        <h1 className="text-xl font-bold text-night">
          {isSuccess
            ? 'Vérification terminée !'
            : status === 'Declined'
            ? 'Vérification non aboutie'
            : 'Vérification en cours…'}
        </h1>
        <p className="text-sm text-night/60">
          {isSuccess
            ? 'Tu peux fermer cet onglet et revenir sur ta page d\'inscription.'
            : status === 'Declined'
            ? 'Retourne sur la page d\'inscription pour réessayer.'
            : 'Cet onglet va se fermer automatiquement.'}
        </p>
        <button
          onClick={() => window.close()}
          className="mt-2 text-sm text-gold hover:text-gold/80 underline underline-offset-2"
        >
          Fermer cet onglet
        </button>
      </div>
    </div>
  );
}

export default function KycCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto" />
          <p className="text-night/60">Chargement…</p>
        </div>
      </div>
    }>
      <KycCallbackContent />
    </Suspense>
  );
}
