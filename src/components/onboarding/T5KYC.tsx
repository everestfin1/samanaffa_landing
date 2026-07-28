'use client';

import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DiditKycStagePanels from '@/components/kyc/DiditKycStagePanels';
import { useDiditKycVerification, type DbKycStatus } from '@/hooks/useDiditKycVerification';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getLatestDiditSession } from '@/lib/kyc-session';

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

  const greetingName = firstName.trim() || 'toi';
  const showIntro = kyc.stage === 'idle';
  const showOutcome =
    kyc.stage === 'success' ||
    kyc.stage === 'in_review' ||
    kyc.stage === 'declined' ||
    kyc.stage === 'error';
  return (
    <div className="e1-shell e5-shell">
      <div className="e1-layout e5-layout">
        <div className="e5-col">
          {showIntro && onBack && (
            <button type="button" onClick={onBack} className="e1-back e5-back">
              ← Retour
            </button>
          )}

          {showIntro && (
            <>
              <h1 className="e1-title e5-title">
                {greetingName}, protège ton Naffa.
              </h1>
              <p className="e5-body">
                Une dernière étape pour que ton Naffa soit à toi seul&nbsp;: ta
                pièce, un selfie, avec notre partenaire sécurisé.
                <br />
                Prépare ta CNI ou ton passeport en cours de validité.
              </p>
            </>
          )}

          {showIntro && (
            <>
              <button
                type="button"
                onClick={() => void kyc.startVerification()}
                className="e1-cta e5-cta"
              >
                Je protège mon Naffa
              </button>
              <p className="e5-legal">
                <span className="e5-legal-label">Mention légale</span>
                {' '}
                Tes documents et données d&apos;identité sont transmis à Didit,
                agissant pour le compte de EVEREST Finance, dans le cadre de nos
                obligations légales d&apos;identification. Ils sont traités de
                manière sécurisée et confidentielle, conformément à notre{' '}
                <Link href="/privacy" className="e5-legal-link">
                  Politique de confidentialité
                </Link>
                . Ils ne sont jamais utilisés à d&apos;autres fins.
              </p>
            </>
          )}

          {(kyc.stage === 'loading' || kyc.stage === 'verifying') && (
            <p className="e5-progress-hint" role="status" aria-live="polite">
              {kyc.stage === 'loading'
                ? 'Ouverture de la vérification sécurisée…'
                : 'La vérification est en cours dans la fenêtre Didit.'}
            </p>
          )}

          {showOutcome && (
            <DiditKycStagePanels
              stage={kyc.stage}
              error={kyc.error}
              declineReasons={kyc.declineReasons}
              verificationUrl={kyc.verificationUrl}
              useWebSdk={kyc.useWebSdk}
              tone="informal"
              buttonStyle="onboarding"
              depositAmount={kyc.stage === 'success' ? depositAmount : undefined}
              onStart={kyc.startVerification}
              onRetry={kyc.handleRetry}
              onResumeVerification={kyc.resumeVerification}
              onFinish={onApproved}
              onGoToPortal={goToPortal}
            />
          )}
        </div>
      </div>
    </div>
  );
}
