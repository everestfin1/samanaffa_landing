'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function KycCallbackContent() {
  const params = useSearchParams();
  const status = params.get('status') ?? '';

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
            ? 'Vous pouvez fermer cet onglet et revenir sur votre page d\'inscription.'
            : status === 'Declined'
              ? 'Retournez sur la page d\'inscription pour réessayer.'
              : 'Revenez sur la page d\'inscription pour suivre l\'avancement.'}
        </p>
        <Link
          href="/onboarding"
          className="inline-block mt-4 px-6 py-3 bg-gold-metallic text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
        >
          Retourner à l&apos;inscription
        </Link>
        <button
          type="button"
          onClick={() => window.close()}
          className="block w-full mt-2 text-sm text-gold hover:text-gold/80 underline underline-offset-2"
        >
          Fermer cet onglet
        </button>
      </div>
    </div>
  );
}

export default function KycCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="max-w-sm text-center space-y-4">
            <CallbackSpinner />
            <p className="text-night/60">Chargement…</p>
          </div>
        </div>
      }
    >
      <KycCallbackContent />
    </Suspense>
  );
}

function CallbackSpinner() {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent mx-auto" />
  );
}
