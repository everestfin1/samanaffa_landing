'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DiditKycStagePanels from '@/components/kyc/DiditKycStagePanels';
import { useDiditKycVerification } from '@/hooks/useDiditKycVerification';

interface T5KYCProps {
  firstName: string;
  depositAmount: number;
  onApproved: () => void;
  onBack?: () => void;
  /** Resume after Didit redirect (same-tab flow). */
  resumeSessionId?: string | null;
}

export default function T5KYC({
  firstName,
  depositAmount,
  onApproved,
  onBack,
  resumeSessionId,
}: T5KYCProps) {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const kyc = useDiditKycVerification({
    firstName,
    returnPath: '/onboarding',
    resumeSessionId,
    onApproved,
    autoAdvanceOnApproved: true,
  });

  const goToPortal = useCallback(() => {
    if (sessionStatus === 'authenticated') {
      router.push('/portal/dashboard');
      return;
    }
    router.push(`/login?callbackUrl=${encodeURIComponent('/portal/dashboard')}`);
  }, [router, sessionStatus]);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {kyc.stage === 'idle' && onBack && (
        <button
          onClick={onBack}
          className="text-sm text-night/60 hover:text-night mb-4 inline-flex items-center gap-1"
        >
          ← Retour
        </button>
      )}

      <div className="text-center mb-6">
        <span className="text-5xl">🪪</span>
        <p className="text-xl md:text-2xl font-bold text-night mt-3 mb-2 whitespace-nowrap">
          Vérification d&apos;identité
        </p>
        <p className="text-night/60 text-sm">2 minutes, et c&apos;est fait.</p>
        {depositAmount > 0 && kyc.stage !== 'success' && (
          <div className="mt-3 inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
            💸 Débloquez votre dépôt de{' '}
            <strong>{depositAmount.toLocaleString('fr-FR')} FCFA</strong>
          </div>
        )}
      </div>

      <DiditKycStagePanels
        stage={kyc.stage}
        error={kyc.error}
        declineReasons={kyc.declineReasons}
        verificationUrl={kyc.verificationUrl}
        useWebSdk={kyc.useWebSdk}
        tone="formal"
        buttonStyle="onboarding"
        depositAmount={kyc.stage === 'success' ? depositAmount : undefined}
        onStart={kyc.startVerification}
        onRetry={kyc.handleRetry}
        onResumeVerification={kyc.resumeVerification}
        onFinish={onApproved}
        onGoToPortal={goToPortal}
      />
    </div>
  );
}
