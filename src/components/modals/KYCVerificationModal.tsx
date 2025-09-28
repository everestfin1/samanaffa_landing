'use client';

import { useRouter } from 'next/navigation';
import KYCVerificationMessage from '../kyc/KYCVerificationMessage';

interface KYCVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  featureName?: string;
}

export default function KYCVerificationModal({ 
  isOpen, 
  onClose, 
  kycStatus,
  featureName = 'cette fonctionnalité'
}: KYCVerificationModalProps) {
  const router = useRouter();

  if (!isOpen || kycStatus === 'APPROVED') return null;

  const handleContactSupport = () => {
    router.push('/contact');
    onClose();
  };

  const handleRestartRegistration = () => {
    router.push('/register');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-night">
            Vérification d'identité requise
          </h3>
          <button 
            onClick={onClose}
            className="text-night/60 hover:text-night"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-night/70 mb-4">
            Pour accéder à {featureName}, votre identité doit être vérifiée. 
            {kycStatus === 'PENDING' && ' Vos documents sont en cours de traitement.'}
            {kycStatus === 'UNDER_REVIEW' && ' Nos équipes examinent actuellement vos documents.'}
            {kycStatus === 'REJECTED' && ' Vos documents précédents n\'ont pas été acceptés.'}
          </p>
        </div>

        <KYCVerificationMessage
          kycStatus={kycStatus}
          variant="modal"
          onContactSupport={handleContactSupport}
          onRestartRegistration={handleRestartRegistration}
        />

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-timberwolf/30 text-night rounded-lg font-medium hover:bg-timberwolf/10 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
