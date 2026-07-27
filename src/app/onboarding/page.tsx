'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { objectives } from '@/components/data/objectives';
import E0LegalFooter from '@/components/landing/E0LegalFooter';
import E0MarketingHeader from '@/components/landing/E0MarketingHeader';
import { type ProjectId, type T0Result } from '@/components/onboarding/T0Simulator';
import T1Phone, { type T1ProfileDraft } from '@/components/onboarding/T1Phone';
import T2PersonalInfo from '@/components/onboarding/T2PersonalInfo';
import E3CreateKondanne, { type E3CreateResult } from '@/components/onboarding/E3CreateKondanne';
import T4Deposit from '@/components/onboarding/T4Deposit';
import T5KYC from '@/components/onboarding/T5KYC';
import E6Payment from '@/components/onboarding/E6Payment';
import E8Mandate from '@/components/onboarding/E8Mandate';
import T6Dashboard from '@/components/onboarding/T6Dashboard';
import { ensureOnboardingDepositReleased } from '@/lib/onboarding-deposit-release';
import {
  DEFAULT_ONBOARDING_FORMULA,
  type OnboardingStep,
} from '@/lib/onboarding-progress';
import { normalizeSponsorCode } from '@/lib/sponsor-code-utils';
import { isApeDeprecated } from '@/lib/product-flags';
import { useSelection, type SamaNaffaSelection } from '@/lib/selection-context';

interface OnboardingState {
  simulation: (T0Result & { kondanneName?: string }) | null;
  userId: string | null;
  phone: string | null;
  displayPhone: string | null;
  countryCode: string | null;
  firstName: string | null;
  referralCode: string | null;
  formula: string | null;
  depositAmount: number | null;
  wallet: string | null;
}

const DEFAULT_SIMULATION: T0Result = {
  project: 'autres',
  monthlyAmount: 50_000,
  durationMonths: 120,
};

function simulationFromSelection(selection: SamaNaffaSelection | null): T0Result {
  if (!selection) return DEFAULT_SIMULATION;
  const objective = objectives.find((o) => o.id === selection.selectedObjective);
  const project = (objective?.slug ?? 'autres') as ProjectId;
  const durationMonths = Math.max(
    6,
    Math.round((selection.duration || 0) * 12) || DEFAULT_SIMULATION.durationMonths,
  );
  return {
    project,
    monthlyAmount: selection.monthlyAmount || DEFAULT_SIMULATION.monthlyAmount,
    durationMonths,
  };
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center">
          <p className="text-night/60 text-sm">Chargement de votre inscription…</p>
        </div>
      }
    >
      <OnboardingPageContent />
    </Suspense>
  );
}

function OnboardingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();
  const { selectionData } = useSelection();
  const kycResumeFromUrl = searchParams.get('verificationSessionId');
  // Mono-produit (APE off): ?ref / ?agent carries a Sama Naffa field-agent code.
  // Legacy mode: sponsor code from ?ref / ?parrain / ?code_parrainage.
  const referralFromUrl = isApeDeprecated()
    ? normalizeSponsorCode(searchParams.get('ref') || searchParams.get('agent') || '')
    : normalizeSponsorCode(
        searchParams.get('ref') ||
          searchParams.get('parrain') ||
          searchParams.get('code_parrainage') ||
          '',
      );
  const [kycResumeSessionId, setKycResumeSessionId] = useState<string | null>(null);
  // Momar: E1 (phone) is the first /onboarding step. Project sim lives on /sama-naffa.
  const [step, setStep] = useState<OnboardingStep>('T1');
  const [state, setState] = useState<OnboardingState>({
    simulation: null,
    userId: null,
    phone: null,
    displayPhone: null,
    countryCode: null,
    firstName: null,
    referralCode: referralFromUrl || null,
    formula: null,
    depositAmount: null,
    wallet: null,
  });
  const [authPending, setAuthPending] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [depositReady, setDepositReady] = useState(true);
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const activeUserId = state.userId ?? sessionUserId;

  // Prefer Nattukaay selection; fall back to a sensible default for direct /onboarding entry.
  useEffect(() => {
    const fromNattukaay =
      selectionData?.type === 'sama-naffa'
        ? simulationFromSelection(selectionData)
        : null;
    setState((s) => {
      if (s.simulation) return s;
      return { ...s, simulation: fromNattukaay ?? DEFAULT_SIMULATION };
    });
  }, [selectionData]);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    if (sessionStatus !== 'authenticated') {
      setResumeChecked(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/onboarding/progress');
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const p = data.progress;
        if (!p || cancelled) return;

        setState((s) => ({
          ...s,
          userId: sessionUserId ?? s.userId,
          simulation: (p.simulation as T0Result) ?? s.simulation,
          firstName: p.firstName ?? s.firstName,
          referralCode: p.referralCode ?? s.referralCode,
          formula: p.formula ?? s.formula,
          depositAmount: p.depositAmount ?? s.depositAmount,
          wallet: p.wallet ?? s.wallet,
        }));

        const resumeStep = p.step as OnboardingStep;
        if (resumeStep === 'C1' || resumeStep === 'T6') {
          // Onboarding finished — send to portal dashboard.
          router.replace('/portal/dashboard');
          return;
        }
        if (resumeStep === 'T0' || resumeStep === 'T1') {
          // Authenticated users never re-do phone; continue E2 personal info.
          setStep('T2');
        } else if (resumeStep === 'T2B') {
          setStep('E8');
        } else if (p.kycApproved && resumeStep === 'T5') {
          // Post-KYC → Intouch payment (still part of Momar E5).
          setStep('E6');
        } else if (resumeStep === 'T3') {
          // Legacy quiz step — Momar skips quiz → first deposit.
          if (!p.formula) {
            try {
              await fetch('/api/onboarding/apply-formula', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formulaName: DEFAULT_ONBOARDING_FORMULA }),
              });
              await fetch('/api/onboarding/progress', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  step: 'T4',
                  simulation: p.simulation,
                  firstName: p.firstName,
                  referralCode: p.referralCode,
                  formula: DEFAULT_ONBOARDING_FORMULA,
                  depositAmount: p.depositAmount,
                  wallet: p.wallet,
                }),
              });
              if (!cancelled) {
                setState((s) => ({ ...s, formula: DEFAULT_ONBOARDING_FORMULA }));
              }
            } catch {
              // Non-blocking — user can still deposit; formula retry on next E3 complete
            }
          }
          setStep('T4');
        } else if (resumeStep) {
          setStep(resumeStep);
        }
      } finally {
        if (!cancelled) setResumeChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, sessionUserId, router]);

  useEffect(() => {
    if (!kycResumeFromUrl || !resumeChecked) return;

    if (sessionStatus === 'unauthenticated') {
      const returnTo = `/onboarding?verificationSessionId=${encodeURIComponent(kycResumeFromUrl)}`;
      router.replace(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);
      return;
    }

    setKycResumeSessionId(kycResumeFromUrl);
    setStep('T5');
    router.replace('/onboarding', { scroll: false });
  }, [kycResumeFromUrl, resumeChecked, router, sessionStatus]);

  const saveProgress = useCallback(
    async (nextStep: OnboardingStep, patch: Partial<OnboardingState> = {}): Promise<boolean> => {
      const merged = { ...state, ...patch };
      setProgressError(null);
      try {
        const res = await fetch('/api/onboarding/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: nextStep,
            simulation: merged.simulation,
            firstName: merged.firstName,
            referralCode: merged.referralCode,
            formula: merged.formula,
            depositAmount: merged.depositAmount,
            wallet: merged.wallet,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setProgressError(
            (data as { error?: string }).error ||
              'Impossible d\'enregistrer votre progression. Réessayez.',
          );
          return false;
        }
        return true;
      } catch {
        setProgressError('Erreur de connexion. Vérifiez votre réseau et réessayez.');
        return false;
      }
    },
    [state],
  );

  const finishToPortal = useCallback(async () => {
    const saved = await saveProgress('C1', {
      depositAmount: state.depositAmount,
      wallet: state.wallet,
      formula: state.formula,
    });
    if (!saved) return;
    router.push('/portal/dashboard');
  }, [router, saveProgress, state.depositAmount, state.formula, state.wallet]);

  const handleT1Success = async (
    userId: string,
    phone: string,
    displayPhone: string,
    countryCode: string,
    sessionToken: string,
    profile: T1ProfileDraft,
  ) => {
    const next: Partial<OnboardingState> = {
      userId,
      phone,
      displayPhone,
      countryCode,
      firstName: profile.firstName || null,
      referralCode: profile.referralCode,
    };
    setState((s) => ({ ...s, ...next }));
    setAuthPending(true);
    try {
      const result = await signIn('credentials', {
        postSignupToken: sessionToken,
        type: 'post_signup',
        redirect: false,
      });
      if (result?.error) {
        router.push(`/login?callbackUrl=${encodeURIComponent('/onboarding')}&message=auto_login_failed`);
        return;
      }

      // Momar E1 collects identity before OTP — persist after session is live.
      if (profile.firstName) {
        try {
          await fetch('/api/onboarding/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: profile.firstName,
              lastName: profile.lastName || undefined,
              referralCode: profile.referralCode,
            }),
          });
        } catch {
          // Non-blocking — profile can still be completed on later steps
        }
      }

      // Next Momar step is E2 (profession / residence), not the quiz.
      const saved = await saveProgress('T2', {
        ...next,
        firstName: profile.firstName || next.firstName,
        referralCode: profile.referralCode,
      });
      if (saved) setStep('T2');
    } catch {
      router.push('/login?message=auto_login_failed');
    } finally {
      setAuthPending(false);
    }
  };

  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && !resumeChecked)) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-night/60 text-sm">Chargement de votre inscription…</p>
      </div>
    );
  }

  return (
    <div className="e0-page flex min-h-dvh flex-col bg-[linear-gradient(180deg,#edf0e6_0%,#ffffff_55%)] overflow-x-hidden">
      <E0MarketingHeader />

      {progressError && (
        <div className="shrink-0 max-w-md mx-auto w-full px-4 pt-3">
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {progressError}
          </p>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <OnboardingStepContainer step={step}>
          <AnimatePresence mode="wait">
            {step === 'T1' && (
              <motion.div
                key="T1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T1Phone
                  simulation={state.simulation ?? DEFAULT_SIMULATION}
                  referralCode={state.referralCode}
                  initialPhone={state.phone ?? undefined}
                  initialCountry={state.countryCode ?? undefined}
                  onBack={() => router.push('/sama-naffa')}
                  onSuccess={handleT1Success}
                />
                {authPending && (
                  <p className="mt-4 text-center text-sm text-night/60">
                    Connexion à votre espace…
                  </p>
                )}
              </motion.div>
            )}

            {step === 'T2' && activeUserId && (
              <motion.div
                key="T2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T2PersonalInfo
                  firstName={state.firstName ?? 'toi'}
                  onSuccess={async () => {
                    const saved = await saveProgress('E8', { firstName: state.firstName });
                    if (!saved) return;
                    setStep('E8');
                  }}
                />
              </motion.div>
            )}

            {step === 'E8' && activeUserId && state.firstName && (
              <motion.div
                key="E8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <E8Mandate
                  firstName={state.firstName}
                  onBack={() => setStep('T2')}
                  onSuccess={async () => {
                    const saved = await saveProgress('E3', { firstName: state.firstName });
                    if (!saved) return;
                    setStep('E3');
                  }}
                />
              </motion.div>
            )}

            {step === 'E3' && activeUserId && (
              <motion.div
                key="E3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <E3CreateKondanne
                  firstName={state.firstName}
                  initial={{
                    ...(state.simulation ?? DEFAULT_SIMULATION),
                    kondanneName:
                      state.simulation && 'kondanneName' in state.simulation
                        ? state.simulation.kondanneName
                        : selectionData?.type === 'sama-naffa'
                          ? selectionData.objective
                          : undefined,
                  }}
                  onBack={() => setStep('E8')}
                  onSuccess={async (result: E3CreateResult) => {
                    const simulation = {
                      project: result.project,
                      monthlyAmount: result.monthlyAmount,
                      durationMonths: result.durationMonths,
                      kondanneName: result.kondanneName,
                    };
                    const formula = DEFAULT_ONBOARDING_FORMULA;
                    try {
                      const formulaRes = await fetch('/api/onboarding/apply-formula', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ formulaName: formula }),
                      });
                      if (!formulaRes.ok) {
                        const data = (await formulaRes.json().catch(() => ({}))) as {
                          error?: string;
                        };
                        throw new Error(data.error || "Impossible d'appliquer la formule");
                      }
                    } catch (e) {
                      console.error('[onboarding E3→T4 apply-formula]', e);
                      return;
                    }
                    const saved = await saveProgress('T4', { simulation, formula });
                    if (!saved) return;
                    setState((s) => ({ ...s, simulation, formula }));
                    setStep('T4');
                  }}
                />
              </motion.div>
            )}

            {step === 'T4' && activeUserId && state.firstName && (
              <motion.div
                key="T4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T4Deposit
                  firstName={state.firstName}
                  initialAmount={state.depositAmount ?? undefined}
                  initialWallet={state.wallet}
                  onBack={() => setStep('E3')}
                  onSuccess={async (amount, wallet) => {
                    const saved = await saveProgress('T5', { depositAmount: amount, wallet });
                    if (!saved) return;
                    setState((s) => ({ ...s, depositAmount: amount, wallet }));
                    setStep('T5');
                  }}
                />
              </motion.div>
            )}

            {step === 'T5' && activeUserId && state.firstName && state.depositAmount && (
              <motion.div
                key="T5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T5KYC
                  firstName={state.firstName}
                  depositAmount={state.depositAmount}
                  resumeSessionId={kycResumeSessionId}
                  onBack={() => setStep('T4')}
                  onApproved={async () => {
                    const { ready } = await ensureOnboardingDepositReleased();
                    setDepositReady(ready);

                    const saved = await saveProgress('E6', {
                      depositAmount: state.depositAmount,
                      wallet: state.wallet,
                    });
                    if (!saved) {
                      throw new Error('Impossible de passer au paiement');
                    }
                    setStep('E6');
                  }}
                />
              </motion.div>
            )}

            {step === 'E6' && activeUserId && state.firstName && state.depositAmount && (
              <motion.div
                key="E6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <E6Payment
                  firstName={state.firstName}
                  initialAmount={state.depositAmount}
                  onBack={() => setStep('T5')}
                  onSkip={async () => {
                    await finishToPortal();
                  }}
                  onSuccess={async (amount, wallet) => {
                    setDepositReady(true);
                    setState((s) => ({ ...s, depositAmount: amount, wallet }));
                    const saved = await saveProgress('C1', {
                      depositAmount: amount,
                      wallet,
                      formula: state.formula,
                    });
                    if (!saved) return;
                    router.push('/portal/dashboard');
                  }}
                />
              </motion.div>
            )}

            {/* Legacy T6 resume — redirect handoff for older sessions */}
            {step === 'T6' && state.firstName && (
              <motion.div
                key="T6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T6Dashboard
                  firstName={state.firstName}
                  depositAmount={state.depositAmount ?? 0}
                  formula={state.formula ?? DEFAULT_ONBOARDING_FORMULA}
                  kondanneName={state.simulation?.kondanneName}
                  depositReady={depositReady}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </OnboardingStepContainer>
      </div>
      <E0LegalFooter />
    </div>
  );
}

function OnboardingStepContainer({
  children,
  step,
}: {
  children: React.ReactNode;
  step: OnboardingStep;
}) {
  const wide =
    step === 'T1' ||
    step === 'T2' ||
    step === 'E3' ||
    step === 'T4' ||
    step === 'T5' ||
    step === 'E6' ||
    step === 'E8' ||
    step === 'T6';
  return (
    <div
      className={
        wide
          ? 'flex w-full max-w-none flex-1 flex-col px-0 py-0'
          : 'my-auto mx-auto w-full max-w-md px-4 py-6 md:py-8'
      }
    >
      {children}
    </div>
  );
}
