'use client';

import { useEffect, useMemo } from 'react';
import { useUserProfile, useInvalidateUserProfile } from '@/hooks/useUserProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DiditKycStagePanels from '@/components/kyc/DiditKycStagePanels';
import { useDiditKycVerification, type DbKycStatus } from '@/hooks/useDiditKycVerification';
import { getLatestDiditSession } from '@/lib/kyc-session';

interface KYCInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function KYCInitiationModal({ isOpen, onClose, onComplete }: KYCInitiationModalProps) {
  const { data: userProfile } = useUserProfile();
  const invalidateProfile = useInvalidateUserProfile();
  const firstName = userProfile?.firstName || '';

  const returnPath =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/portal/dashboard';

  const latestDidit = useMemo(
    () => getLatestDiditSession(userProfile?.kycDocuments ?? [], 'poll'),
    [userProfile?.kycDocuments],
  );

  const kyc = useDiditKycVerification({
    firstName,
    returnPath,
    active: isOpen,
    openDiditInNewTab: true,
    dbKycStatus: userProfile?.kycStatus as DbKycStatus | undefined,
    existingDiditSessionId: latestDidit?.sessionId ?? null,
  });

  useEffect(() => {
    if (!isOpen || !userProfile?.id) return;

    const activeDidit = getLatestDiditSession(userProfile.kycDocuments ?? [], 'resumable');

    if (activeDidit?.sessionId) {
      kyc.resumePendingSession(activeDidit.sessionId, activeDidit.verificationStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userProfile?.id, userProfile?.kycDocuments]);

  useEffect(() => {
    if (!isOpen) {
      kyc.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleComplete = () => {
    invalidateProfile();
    onClose();
    onComplete?.();
  };

  if (!isOpen) return null;

  const showFinish =
    kyc.stage === 'success' || kyc.stage === 'in_review';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-timberwolf/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-night">Vérification d&apos;identité</h2>
            <p className="text-sm text-night/60 mt-1">2 minutes, et c&apos;est fait</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-night/50 hover:text-night transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <DiditKycStagePanels
            stage={kyc.stage}
            error={kyc.error}
            declineReasons={kyc.declineReasons}
            verificationUrl={kyc.verificationUrl}
            useWebSdk={kyc.useWebSdk}
            tone="informal"
            buttonStyle="portal"
            onStart={kyc.startVerification}
            onRetry={kyc.handleRetry}
            onResumeVerification={kyc.resumeVerification}
            onFinish={showFinish ? handleComplete : undefined}
          />
        </div>
      </div>
    </div>
  );
}
