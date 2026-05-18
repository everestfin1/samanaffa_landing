'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import T0Simulator, { T0Result } from '@/components/onboarding/T0Simulator';
import T1Phone from '@/components/onboarding/T1Phone';
import T2FirstName from '@/components/onboarding/T2FirstName';
import T3Quiz from '@/components/onboarding/T3Quiz';
import T4Deposit from '@/components/onboarding/T4Deposit';
import T5KYC from '@/components/onboarding/T5KYC';
import T6Dashboard from '@/components/onboarding/T6Dashboard';
import type { OnboardingStep } from '@/lib/onboarding-progress';

interface OnboardingState {
  simulation: T0Result | null;
  userId: string | null;
  phone: string | null;
  displayPhone: string | null;
  countryCode: string | null;
  firstName: string | null;
  formula: string | null;
  depositAmount: number | null;
  wallet: string | null;
}

const VISIBLE_STEPS = 5;

const visibleStepIndex: Record<OnboardingStep, number> = {
  T0: 0,
  T1: 1,
  T2: 2,
  T3: 3,
  T4: 4,
  T5: 5,
  T6: 5,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState<OnboardingStep>('T0');
  const [state, setState] = useState<OnboardingState>({
    simulation: null,
    userId: null,
    phone: null,
    displayPhone: null,
    countryCode: null,
    firstName: null,
    formula: null,
    depositAmount: null,
    wallet: null,
  });
  const [authPending, setAuthPending] = useState(false);
  const [resumeChecked, setResumeChecked] = useState(false);
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const activeUserId = state.userId ?? sessionUserId;

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
          simulation: (p.simulation as T0Result) ?? s.simulation,
          firstName: p.firstName ?? s.firstName,
          formula: p.formula ?? s.formula,
          depositAmount: p.depositAmount ?? s.depositAmount,
          wallet: p.wallet ?? s.wallet,
        }));

        const resumeStep = p.step as OnboardingStep;
        if (resumeStep && resumeStep !== 'T0' && resumeStep !== 'T1') {
          setStep(resumeStep);
        } else if (resumeStep === 'T1') {
          setStep('T2');
        }
      } finally {
        if (!cancelled) setResumeChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);

  const saveProgress = useCallback(
    async (nextStep: OnboardingStep, patch: Partial<OnboardingState> = {}) => {
      const merged = { ...state, ...patch };
      try {
        await fetch('/api/onboarding/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            step: nextStep,
            simulation: merged.simulation,
            firstName: merged.firstName,
            formula: merged.formula,
            depositAmount: merged.depositAmount,
            wallet: merged.wallet,
            ...(nextStep === 'T6' ? { kycApproved: true } : {}),
          }),
        });
      } catch {
        // non-fatal
      }
    },
    [state],
  );

  const currentVisible = visibleStepIndex[step];
  const showProgress = step !== 'T0' && step !== 'T6';

  const handleT1Success = async (
    userId: string,
    phone: string,
    displayPhone: string,
    countryCode: string,
  ) => {
    const next: Partial<OnboardingState> = { userId, phone, displayPhone, countryCode };
    setState((s) => ({ ...s, ...next }));
    setAuthPending(true);
    try {
      const result = await signIn('credentials', {
        phone,
        type: 'register',
        redirect: false,
      });
      if (result?.error) {
        router.push('/login?message=auto_login_failed');
        return;
      }
      setStep('T2');
      await saveProgress('T2', next);
    } catch {
      router.push('/login?message=auto_login_failed');
    } finally {
      setAuthPending(false);
    }
  };

  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && !resumeChecked)) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
        <p className="text-night/60 text-sm">Chargement de votre inscription…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-8rem)] bg-linear-to-br from-timberwolf/10 to-white overflow-x-hidden">
      <AnimatePresence>
        {showProgress && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 bg-white/95 backdrop-blur border-b border-timberwolf/20 z-40"
          >
            <div className="max-w-md mx-auto px-4 py-3">
              <div className="flex items-center justify-between text-xs text-night/60 mb-2">
                <span className="font-medium">Sama Naffa</span>
                <span>
                  Étape {currentVisible} sur {VISIBLE_STEPS}
                </span>
              </div>
              <div className="w-full h-1.5 bg-timberwolf/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  animate={{ width: `${(currentVisible / VISIBLE_STEPS) * 100}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 flex-col">
        <OnboardingStepContainer step={step}>
          <AnimatePresence mode="wait">
            {step === 'T0' && (
              <motion.div
                key="T0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T0Simulator
                  initial={state.simulation}
                  onContinue={(result) => {
                    setState((s) => ({ ...s, simulation: result }));
                    setStep('T1');
                  }}
                />
              </motion.div>
            )}

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
                  simulation={state.simulation}
                  initialPhone={state.phone ?? undefined}
                  initialCountry={state.countryCode ?? undefined}
                  onBack={() => setStep('T0')}
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
                <T2FirstName
                  initialValue={state.firstName ?? undefined}
                  onSuccess={async (firstName) => {
                    setState((s) => ({ ...s, firstName }));
                    setStep('T3');
                    await saveProgress('T3', { firstName });
                  }}
                />
              </motion.div>
            )}

            {step === 'T3' && activeUserId && state.firstName && (
              <motion.div
                key="T3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <T3Quiz
                  firstName={state.firstName}
                  onBack={() => setStep('T2')}
                  onSuccess={async (formula) => {
                    setState((s) => ({ ...s, formula }));
                    setStep('T4');
                    await saveProgress('T4', { formula });
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
                  onBack={() => setStep('T3')}
                  onSuccess={async (amount, wallet) => {
                    setState((s) => ({ ...s, depositAmount: amount, wallet }));
                    setStep('T5');
                    await saveProgress('T5', { depositAmount: amount, wallet });
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
                  onBack={() => setStep('T4')}
                  onApproved={async () => {
                    setStep('T6');
                    await fetch('/api/onboarding/progress', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        step: 'T6',
                        firstName: state.firstName,
                        formula: state.formula,
                        depositAmount: state.depositAmount,
                        wallet: state.wallet,
                        kycApproved: true,
                      }),
                    });
                  }}
                />
              </motion.div>
            )}

            {step === 'T6' && state.firstName && state.depositAmount && state.formula && (
              <motion.div
                key="T6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full"
              >
                <T6Dashboard
                  firstName={state.firstName}
                  depositAmount={state.depositAmount}
                  formula={state.formula}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </OnboardingStepContainer>
      </div>
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
  return (
    <div
      className={`my-auto w-full mx-auto px-4 py-6 md:py-8 transition-all ${step === 'T0' ? 'max-w-xl' : 'max-w-md'}`}
    >
      {children}
    </div>
  );
}
