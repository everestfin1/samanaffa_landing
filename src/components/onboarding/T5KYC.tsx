'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DiditKycStagePanels from '@/components/kyc/DiditKycStagePanels';
import { useDiditKycVerification, type DbKycStatus } from '@/hooks/useDiditKycVerification';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getLatestDiditSession } from '@/lib/kyc-session';
import OnboardingStepHeader from '@/components/onboarding/OnboardingStepHeader';

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
  const { data: profile } = useUserProfile();

  const latestDidit = useMemo(
    () => getLatestDiditSession(profile?.kycDocuments ?? [], 'poll'),
    [profile?.kycDocuments],
  );

  const kyc = useDiditKycVerification({
    firstName,
    returnPath: '/onboarding',
    resumeSessionId,
    onApproved,
    autoAdvanceOnApproved: true,
    dbKycStatus: profile?.kycStatus as DbKycStatus | undefined,
    existingDiditSessionId: latestDidit?.sessionId ?? null,
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

      <div className="mb-6">
        <OnboardingStepHeader
          title="Vérification d'identité"
          description="2 minutes, et c'est fait."
        />
        {depositAmount > 0 && kyc.stage !== 'success' && (
          <div className="mt-3 text-center">
            <div className="inline-block bg-gold/10 border border-gold/30 rounded-full px-4 py-2 text-sm text-night">
              Débloquez votre dépôt de{' '}
              <strong>{depositAmount.toLocaleString('fr-FR')} FCFA</strong>
            </div>
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
