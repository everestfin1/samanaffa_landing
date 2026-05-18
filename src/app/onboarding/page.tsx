'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import T0Simulator, { T0Result } from '@/components/onboarding/T0Simulator';
import T1Phone from '@/components/onboarding/T1Phone';
import T2FirstName from '@/components/onboarding/T2FirstName';
import T3Quiz from '@/components/onboarding/T3Quiz';
import T4Deposit from '@/components/onboarding/T4Deposit';
import T5KYC from '@/components/onboarding/T5KYC';
import T6Dashboard from '@/components/onboarding/T6Dashboard';

type Step = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';

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

const VISIBLE_STEPS = 4; // per docx: progress shown as "Step X of 4"

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>('T0');
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

  // Guard: if we land on T6 without formula, bounce back to T3
  useEffect(() => {
    if (step === 'T6' && !state.formula) {
      setStep('T3');
    }
  }, [step, state.formula]);

  // Progress mapping
  const visibleStepIndex: Record<Step, number> = {
    T0: 0, T1: 1, T2: 1, T3: 2, T4: 3, T5: 4, T6: 4,
  };
  const currentVisible = visibleStepIndex[step];

  const showProgress = step !== 'T0' && step !== 'T6';

  return (
    // min-height fills one screen below the sticky nav; section grows with tall steps.
    // No nested overflow-y-auto — window scroll reaches the global Footer below this block.
    <div className="flex flex-col min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-8rem)] bg-linear-to-br from-timberwolf/10 to-white overflow-x-hidden">

      {/* Progress bar — only rendered when needed, no reserved space */}
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
                <span>Étape {currentVisible} sur {VISIBLE_STEPS}</span>
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

      {/* Centers vertically when short; grows so document scroll shows Footer */}
      <div className="flex flex-1 flex-col">
        <div className="my-auto w-full max-w-md mx-auto px-4 py-6 md:py-8">
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
                onSuccess={(userId, phone, displayPhone, countryCode) => {
                  setState((s) => ({ ...s, userId, phone, displayPhone, countryCode }));
                  setStep('T2');
                }}
              />
            </motion.div>
          )}

          {step === 'T2' && state.userId && (
            <motion.div
              key="T2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <T2FirstName
                userId={state.userId}
                initialValue={state.firstName ?? undefined}
                onSuccess={(firstName) => {
                  setState((s) => ({ ...s, firstName }));
                  setStep('T3');
                }}
              />
            </motion.div>
          )}

          {step === 'T3' && state.userId && state.firstName && (
            <motion.div
              key="T3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <T3Quiz
                userId={state.userId}
                firstName={state.firstName}
                onBack={() => setStep('T2')}
                onSuccess={(formula) => {
                  setState((s) => ({ ...s, formula }));
                  setStep('T4');
                }}
              />
            </motion.div>
          )}

          {step === 'T4' && state.userId && state.firstName && (
            <motion.div
              key="T4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <T4Deposit
                userId={state.userId}
                firstName={state.firstName}
                initialAmount={state.depositAmount ?? undefined}
                initialWallet={state.wallet}
                onBack={() => setStep('T3')}
                onSuccess={(amount, wallet) => {
                  setState((s) => ({ ...s, depositAmount: amount, wallet }));
                  setStep('T5');
                }}
              />
            </motion.div>
          )}

          {step === 'T5' && state.userId && state.firstName && state.depositAmount && (
            <motion.div
              key="T5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <T5KYC
                userId={state.userId}
                firstName={state.firstName}
                depositAmount={state.depositAmount}
                onBack={() => setStep('T4')}
                onSuccess={() => setStep('T6')}
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
        </div>
      </div>
    </div>
  );
}
