'use client';

import { useEffect } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DiditKycStagePanels from '@/components/kyc/DiditKycStagePanels';
import { useDiditKycVerification } from '@/hooks/useDiditKycVerification';

interface KYCInitiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export default function KYCInitiationModal({ isOpen, onClose, onComplete }: KYCInitiationModalProps) {
  const { data: userProfile } = useUserProfile();
  const firstName = userProfile?.firstName || '';

  const returnPath =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : '/portal/dashboard';

  const kyc = useDiditKycVerification({
    firstName,
    returnPath,
    active: isOpen,
  });

  useEffect(() => {
    if (!isOpen || !userProfile?.id) return;

    const checkExistingKYC = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (!res.ok) return;
        const data = await res.json();
        const user = data.user;

        const pendingKyc = user.kycDocuments?.find(
          (d: { documentType: string; verificationStatus: string; fileUrl: string }) =>
            d.documentType === 'didit_kyc_session' && d.verificationStatus === 'PENDING',
        );

        if (pendingKyc?.fileUrl) {
          kyc.resumePendingSession(pendingKyc.fileUrl);
        }
      } catch {
        // start fresh
      }
    };

    void checkExistingKYC();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userProfile?.id]);

  useEffect(() => {
    if (!isOpen) {
      kyc.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleComplete = () => {
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
