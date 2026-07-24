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

type ProgressStepStatus = 'done' | 'active' | 'upcoming';

const PROGRESS_STEPS: { id: string; label: string; icon: string }[] = [
  { id: 'recto', label: "Pièce d'identité (recto)", icon: '✓' },
  { id: 'verso', label: "Pièce d'identité (verso)", icon: '📷' },
  { id: 'selfie', label: 'Selfie', icon: '🎥' },
];

function progressStatuses(stage: string): ProgressStepStatus[] {
  if (stage === 'success' || stage === 'in_review') {
    return ['done', 'done', 'done'];
  }
  if (stage === 'verifying' || stage === 'loading') {
    // Figma sibling 10:2344 shows recto done / verso active / selfie upcoming.
    return ['done', 'active', 'upcoming'];
  }
  return ['upcoming', 'upcoming', 'upcoming'];
}

function statusLabel(status: ProgressStepStatus): string {
  if (status === 'done') return 'Terminé';
  if (status === 'active') return 'En cours';
  return 'À venir';
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
  const showProgress =
    kyc.stage === 'loading' || kyc.stage === 'verifying';
  const showOutcome =
    kyc.stage === 'success' ||
    kyc.stage === 'in_review' ||
    kyc.stage === 'declined' ||
    kyc.stage === 'error';
  const stepStatuses = progressStatuses(kyc.stage);

  return (
    <div className="e1-shell e5-shell">
      <div className="e1-layout e5-layout">
        <div className="e5-col">
          {showIntro && onBack && (
            <button type="button" onClick={onBack} className="e1-back e5-back">
              ← Retour
            </button>
          )}

          {(showIntro || showProgress) && (
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

          {showProgress && (
            <div className="e5-progress" role="status" aria-live="polite">
              {PROGRESS_STEPS.map((step, index) => {
                const status = stepStatuses[index] ?? 'upcoming';
                return (
                  <div
                    key={step.id}
                    className={`e5-progress-row e5-progress-row--${status}`}
                  >
                    <div className="e5-progress-icon" aria-hidden>
                      {status === 'done' ? '✓' : step.icon}
                    </div>
                    <div className="e5-progress-copy">
                      <p className="e5-progress-label">{step.label}</p>
                      <p className="e5-progress-status">{statusLabel(status)}</p>
                    </div>
                    {status === 'active' && (
                      <span className="e5-progress-chevron" aria-hidden>
                        ›
                      </span>
                    )}
                  </div>
                );
              })}

              {kyc.stage === 'loading' && (
                <p className="e5-progress-hint">Préparation de la vérification…</p>
              )}

              {kyc.stage === 'verifying' && (
                <>
                  <p className="e5-progress-hint">
                    Complète les étapes avec Didit. Cette page se met à jour
                    automatiquement.
                  </p>
                  {(kyc.verificationUrl || kyc.useWebSdk) && (
                    <button
                      type="button"
                      onClick={() => void kyc.resumeVerification()}
                      className="e5-resume"
                    >
                      Reprendre la vérification
                    </button>
                  )}
                </>
              )}

              {kyc.error && <p className="e1-error">{kyc.error}</p>}
            </div>
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
