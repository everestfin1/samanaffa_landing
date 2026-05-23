'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import type { VerificationResult } from '@didit-protocol/sdk-web';
import { closeDiditSdkModal, openDiditSdkVerification } from '@/lib/didit-sdk-client';
import { shouldUseDiditWebSdk } from '@/lib/kyc-device';
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

export type DbKycStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

const POLL_INTERVAL_MS = 5_000;
const MAX_POLL_DURATION_MS = 10 * 60 * 1000;

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
  /** DB kycStatus — hydrates in_review / success without offering a fresh start (ONB-053). */
  dbKycStatus?: DbKycStatus;
  /** Latest Didit session id from profile — poll until terminal status. */
  existingDiditSessionId?: string | null;
}

async function fetchVerificationUrlForSession(sessionId: string): Promise<string | null> {
  const res = await fetch(
    `/api/onboarding/kyc/session-url?sessionId=${encodeURIComponent(sessionId)}`,
    { credentials: 'same-origin' },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return typeof data.verificationUrl === 'string' ? data.verificationUrl : null;
}

function notifyApproved(
  onApproved: (() => void) | undefined,
  autoAdvanceOnApproved: boolean,
  approvedHandledRef: MutableRefObject<boolean>,
) {
  if (!onApproved || approvedHandledRef.current) return;
  approvedHandledRef.current = true;
  if (autoAdvanceOnApproved) {
    window.setTimeout(() => onApproved(), 1200);
  } else {
    onApproved();
  }
}

export function useDiditKycVerification({
  firstName,
  returnPath,
  resumeSessionId,
  active = true,
  onApproved,
  autoAdvanceOnApproved = false,
  dbKycStatus,
  existingDiditSessionId,
}: UseDiditKycVerificationOptions) {
  const [stage, setStage] = useState<DiditKycStage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [diditSessionId, setDiditSessionId] = useState<string | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [declineReasons, setDeclineReasons] = useState<string[]>([]);
  const [useWebSdk, setUseWebSdk] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const approvedHandledRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);
  const forceFreshRef = useRef(false);
  const pollStartedAtRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    pollStartedAtRef.current = null;
  }, []);

  const isPollExpired = useCallback(() => {
    const started = pollStartedAtRef.current;
    return started != null && Date.now() - started > MAX_POLL_DURATION_MS;
  }, []);

  useEffect(() => {
    setUseWebSdk(shouldUseDiditWebSdk());
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
      void closeDiditSdkModal();
    };
  }, [stopPolling]);

  const applyStatus = useCallback(
    (status: string) => {
      if (status === 'approved') {
        stopPolling();
        setStage('success');
        notifyApproved(onApproved, autoAdvanceOnApproved, approvedHandledRef);
        return;
      }
      if (status === 'in_review') {
        setStage('in_review');
        return;
      }
      if (status === 'declined') {
        stopPolling();
        setStage('declined');
        return;
      }
      if (status === 'expired') {
        stopPolling();
        setStage('error');
        setError('Cette session de vérification a expiré. Relancez la vérification.');
        return;
      }
      if (status === 'abandoned') {
        stopPolling();
        setStage('error');
        setError('La vérification a été abandonnée. Relancez la vérification.');
      }
    },
    [autoAdvanceOnApproved, onApproved, stopPolling],
  );

  const pollOnce = useCallback(
    async (sessionId: string) => {
      if (isPollExpired()) {
        stopPolling();
        setStage('error');
        setError('Délai de vérification dépassé. Réessayez ou contactez le support.');
        return;
      }

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
    [applyStatus, isPollExpired, stopPolling],
  );

  const startPolling = useCallback(
    (sessionId: string) => {
      sessionIdRef.current = sessionId;
      stopPolling();
      pollStartedAtRef.current = Date.now();
      void pollOnce(sessionId);
      pollRef.current = setInterval(() => {
        void pollOnce(sessionId);
      }, POLL_INTERVAL_MS);
    },
    [pollOnce, stopPolling],
  );

  const handleSdkResult = useCallback(
    (result: VerificationResult) => {
      const sessionId = result.session?.sessionId ?? sessionIdRef.current;
      if (result.type === 'completed') {
        if (sessionId) {
          setDiditSessionId(sessionId);
          startPolling(sessionId);
        }
        return;
      }
      if (result.type === 'cancelled') {
        stopPolling();
        setStage('idle');
        setError(null);
        return;
      }
      if (result.type === 'failed') {
        stopPolling();
        setStage('error');
        setError(result.error?.message ?? 'La vérification a échoué. Réessayez.');
      }
    },
    [startPolling, stopPolling],
  );

  const launchWebSdk = useCallback(
    async (url: string, sessionId: string) => {
      setDiditSessionId(sessionId);
      setVerificationUrl(url);
      setKycVerificationUrl(url);
      setStage('verifying');
      setError(null);
      startPolling(sessionId);
      try {
        await openDiditSdkVerification(url, handleSdkResult);
      } catch (e: unknown) {
        stopPolling();
        setStage('error');
        setError(
          e instanceof Error
            ? e.message
            : "Impossible d'ouvrir la fenêtre de vérification. Réessayez.",
        );
      }
    },
    [handleSdkResult, startPolling, stopPolling],
  );

  const resolveVerificationUrl = useCallback(
    async (sessionId: string, knownUrl?: string | null) => {
      if (knownUrl) return knownUrl;
      return fetchVerificationUrlForSession(sessionId);
    },
    [],
  );

  /** Sync UI when DB kycStatus changes (login refresh, webhook, profile refetch). */
  useEffect(() => {
    if (!active || resumeSessionId) return;
    if (!dbKycStatus || dbKycStatus === 'PENDING') return;

    if (dbKycStatus === 'APPROVED') {
      stopPolling();
      setStage('success');
      notifyApproved(onApproved, autoAdvanceOnApproved, approvedHandledRef);
      return;
    }
    if (dbKycStatus === 'REJECTED') {
      stopPolling();
      setStage('declined');
      return;
    }
    if (dbKycStatus === 'UNDER_REVIEW') {
      setStage('in_review');
      const sid = existingDiditSessionId ?? sessionIdRef.current;
      if (sid && pollRef.current === null) {
        setDiditSessionId(sid);
        sessionIdRef.current = sid;
        startPolling(sid);
      }
    }
  }, [
    active,
    autoAdvanceOnApproved,
    dbKycStatus,
    existingDiditSessionId,
    onApproved,
    resumeSessionId,
    startPolling,
    stopPolling,
  ]);

  useEffect(() => {
    if (!active || !resumeSessionId) return;
    setDiditSessionId(resumeSessionId);
    setVerificationUrl(getKycVerificationUrl());
    setStage('verifying');
    startPolling(resumeSessionId);

    if (shouldUseDiditWebSdk()) {
      void (async () => {
        const url =
          getKycVerificationUrl() ?? (await fetchVerificationUrlForSession(resumeSessionId));
        if (url) setVerificationUrl(url);
      })();
    }
  }, [active, resumeSessionId, startPolling]);

  const startVerification = async () => {
    if (dbKycStatus === 'UNDER_REVIEW') return;
    setStage('loading');
    setError(null);
    const webSdk = shouldUseDiditWebSdk();
    setUseWebSdk(webSdk);

    try {
      const res = await fetch('/api/onboarding/kyc/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, forceFresh: forceFreshRef.current }),
      });
      forceFreshRef.current = false;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      if (data.bypass && data.sessionId) {
        setDiditSessionId(data.sessionId);
        sessionIdRef.current = data.sessionId;
        applyStatus('approved');
        return;
      }

      if (webSdk) {
        await launchWebSdk(data.verificationUrl, data.sessionId);
        return;
      }

      setVerificationUrl(data.verificationUrl);
      setDiditSessionId(data.sessionId);
      setKycVerificationUrl(data.verificationUrl);
      navigateToDiditVerification(data.verificationUrl, data.sessionId, returnPath);
    } catch (e: unknown) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const resumeVerification = async () => {
    const sessionId = diditSessionId ?? sessionIdRef.current;
    if (!sessionId) return;

    if (shouldUseDiditWebSdk()) {
      setUseWebSdk(true);
      const url = await resolveVerificationUrl(sessionId, verificationUrl);
      if (!url) {
        setError('Impossible de reprendre la vérification. Réessayez.');
        setStage('error');
        return;
      }
      await launchWebSdk(url, sessionId);
      return;
    }

    if (!verificationUrl) return;
    if (diditSessionId) {
      navigateToDiditVerification(verificationUrl, diditSessionId, returnPath);
    } else {
      window.location.href = verificationUrl;
    }
  };

  const handleRetry = () => {
    void closeDiditSdkModal();
    stopPolling();
    setStage('idle');
    setError(null);
    setDiditSessionId(null);
    setVerificationUrl(null);
    setDeclineReasons([]);
    approvedHandledRef.current = false;
    sessionIdRef.current = null;
    forceFreshRef.current = true;
  };

  /** Resume an in-flight Didit session (portal modal). */
  const resumePendingSession = useCallback(
    (sessionId: string, verificationStatus?: string) => {
      setDiditSessionId(sessionId);
      sessionIdRef.current = sessionId;

      if (verificationStatus === 'UNDER_REVIEW') {
        setStage('in_review');
      } else {
        setStage('verifying');
      }

      setUseWebSdk(shouldUseDiditWebSdk());
      startPolling(sessionId);

      if (shouldUseDiditWebSdk()) {
        void (async () => {
          const url = await fetchVerificationUrlForSession(sessionId);
          if (url) setVerificationUrl(url);
        })();
      }
    },
    [startPolling],
  );

  const reset = () => {
    void closeDiditSdkModal();
    stopPolling();
    setStage('idle');
    setError(null);
    setDiditSessionId(null);
    setVerificationUrl(null);
    setDeclineReasons([]);
    approvedHandledRef.current = false;
    sessionIdRef.current = null;
  };

  return {
    stage,
    error,
    diditSessionId,
    verificationUrl,
    declineReasons,
    useWebSdk,
    startVerification,
    resumeVerification,
    handleRetry,
    resumePendingSession,
    reset,
    stopPolling,
  };
}
