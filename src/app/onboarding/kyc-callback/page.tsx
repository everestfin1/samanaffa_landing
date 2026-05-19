'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearKycNavigationState, getKycReturnPath } from '@/lib/kyc-navigation';

function KycCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState('Finalisation de votre vérification…');

  useEffect(() => {
    const sessionId =
      params.get('verificationSessionId') ??
      params.get('sessionId') ??
      params.get('verification_session_id');
    const status = params.get('status') ?? '';
    const returnPath = getKycReturnPath();

    const finish = () => {
      clearKycNavigationState();
      if (returnPath.startsWith('/onboarding')) {
        const query = new URLSearchParams();
        if (sessionId) query.set('verificationSessionId', sessionId);
        if (status) query.set('status', status);
        const qs = query.toString();
        router.replace(qs ? `/onboarding?${qs}` : '/onboarding');
        return;
      }
      const separator = returnPath.includes('?') ? '&' : '?';
      router.replace(`${returnPath}${separator}kycReturn=1`);
    };

    if (!sessionId) {
      setMessage('Redirection…');
      const t = window.setTimeout(finish, 800);
      return () => window.clearTimeout(t);
    }

    let cancelled = false;
    (async () => {
      try {
        await fetch(`/api/onboarding/kyc/status?sessionId=${encodeURIComponent(sessionId)}`, {
          cache: 'no-store',
        });
      } catch {
        // destination page may poll again
      }
      if (!cancelled) {
        setMessage('Retour à votre inscription…');
        window.setTimeout(finish, 600);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-sm text-center space-y-4">
        <CallbackSpinner />
        <p className="text-night/70 text-sm">{message}</p>
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
