'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getKycVerificationUrl,
  navigateToDiditVerification,
  setKycVerificationUrl,
} from '@/lib/kyc-navigation';

export type DiditKycStage =
  | 'idle'
  | 'loading'
  | 'verifying'
  | 'success'
  | 'in_review'
  | 'declined'
  | 'error';

const POLL_INTERVAL_MS = 5_000;

export interface UseDiditKycVerificationOptions {
  firstName: string;
  /** Path Didit redirects back to (e.g. `/onboarding` or current portal path). */
  returnPath: string;
  resumeSessionId?: string | null;
  /** When false, polling and resume effects are paused (e.g. closed modal). */
  active?: boolean;
  onApproved?: () => void;
  /** Auto-call onApproved after success animation (onboarding T5). */
  autoAdvanceOnApproved?: boolean;
}

export function useDiditKycVerification({
  firstName,
  returnPath,
  resumeSessionId,
  active = true,
  onApproved,
  autoAdvanceOnApproved = false,
}: UseDiditKycVerificationOptions) {
  const [stage, setStage] = useState<DiditKycStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [declineReasons, setDeclineReasons] = useState<string[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const approvedHandledRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const applyStatus = useCallback(
    (status: string) => {
      if (status === 'approved') {
        stopPolling();
        setStage('success');
        if (onApproved && !approvedHandledRef.current) {
          approvedHandledRef.current = true;
          if (autoAdvanceOnApproved) {
            window.setTimeout(() => onApproved(), 1200);
          }
        }
      } else if (status === 'in_review') {
        stopPolling();
        setStage('in_review');
      } else if (status === 'declined') {
        stopPolling();
        setStage('declined');
      }
    },
    [autoAdvanceOnApproved, onApproved, stopPolling],
  );

  const pollOnce = useCallback(
    async (sessionId: string) => {
      const res = await fetch(`/api/onboarding/kyc/status?sessionId=${sessionId}`, {
        credentials: 'same-origin',
      });
      if (!res.ok) {
        setError('Impossible de vérifier le statut KYC. Réessayez dans un instant.');
        return;
      }
      const data = await res.json();
      if (data.status === 'declined' && Array.isArray(data.declineReasons)) {
        setDeclineReasons(data.declineReasons);
      }
      applyStatus(data.status);
    },
    [applyStatus],
  );

  const startPolling = useCallback(
    (sessionId: string) => {
      stopPolling();
      void pollOnce(sessionId);
      pollRef.current = setInterval(() => {
        void pollOnce(sessionId);
      }, POLL_INTERVAL_MS);
    },
    [pollOnce, stopPolling],
  );

  useEffect(() => {
    if (!active || !resumeSessionId) return;
    setDiditSessionId(resumeSessionId);
    setVerificationUrl(getKycVerificationUrl());
    setStage('verifying');
    startPolling(resumeSessionId);
  }, [active, resumeSessionId, startPolling]);

  const startVerification = async () => {
    setStage('loading');
    setError(null);
    try {
      const res = await fetch('/api/onboarding/kyc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      setVerificationUrl(data.verificationUrl);
      setDiditSessionId(data.sessionId);
      setKycVerificationUrl(data.verificationUrl);
      navigateToDiditVerification(data.verificationUrl, data.sessionId, returnPath);
    } catch (e: unknown) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const resumeVerification = () => {
    if (!verificationUrl) return;
    if (diditSessionId) {
      navigateToDiditVerification(verificationUrl, diditSessionId, returnPath);
    } else {
      window.location.href = verificationUrl;
    }
  };

  const handleRetry = () => {
    stopPolling();
    setStage('idle');
    setError(null);
    setDiditSessionId(null);
    setVerificationUrl(null);
    setDeclineReasons([]);
    approvedHandledRef.current = false;
  };

  /** Resume an in-flight Didit session (portal modal). */
  const resumePendingSession = useCallback(
    (sessionId: string) => {
      setDiditSessionId(sessionId);
      setStage('verifying');
      startPolling(sessionId);
    },
    [startPolling],
  );

  const reset = () => {
    stopPolling();
    setStage('idle');
    setError(null);
    setDiditSessionId(null);
    setVerificationUrl(null);
    setDeclineReasons([]);
    approvedHandledRef.current = false;
  };

  return {
    stage,
    error,
    diditSessionId,
    verificationUrl,
    declineReasons,
    startVerification,
    resumeVerification,
    handleRetry,
    resumePendingSession,
    reset,
    stopPolling,
  };
}
