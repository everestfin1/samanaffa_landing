'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface KYCProtectionProps {
  kycStatus: KYCStatus;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function KYCProtection({ kycStatus, children, fallback }: KYCProtectionProps) {
  const router = useRouter();

  // If KYC is approved, render children
  if (kycStatus === 'APPROVED') {
    return <>{children}</>;
  }

  // If fallback is provided, render it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default KYC pending UI
  const getStatusInfo = () => {
    switch (kycStatus) {
      case 'PENDING':
        return {
          title: 'Vérification en attente',
          message: 'Vos documents sont en cours de traitement par nos équipes.',
          color: 'yellow',
          icon: ClockIcon
        };
      case 'UNDER_REVIEW':
        return {
          title: 'Vérification en cours',
          message: 'Nos experts examinent vos documents. Vous serez notifié dès que possible.',
          color: 'blue',
          icon: DocumentTextIcon
        };
      case 'REJECTED':
        return {
          title: 'Documents rejetés',
          message: 'Vos documents n\'ont pas été acceptés. Veuillez contacter le support.',
          color: 'red',
          icon: ExclamationTriangleIcon
        };
      default:
        return {
          title: 'Vérification requise',
          message: 'Veuillez compléter votre vérification d\'identité pour accéder à cette fonctionnalité.',
          color: 'yellow',
          icon: ClockIcon
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-timberwolf/10 text-center">
          <div className={`bg-${statusInfo.color}-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center`}>
            <statusInfo.icon className={`w-8 h-8 text-${statusInfo.color}-600`} />
          </div>
          
          <h2 className={`text-2xl font-bold text-${statusInfo.color}-800 mb-4`}>
            {statusInfo.title}
          </h2>
          
          <p className={`text-${statusInfo.color}-700 mb-8`}>
            {statusInfo.message}
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/portal/dashboard')}
              className="w-full bg-gold-metallic text-white py-3 px-6 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
            >
              Retour au tableau de bord
            </button>
            
            {kycStatus === 'REJECTED' && (
              <button
                onClick={() => router.push('/contact')}
                className="w-full border border-red-600 text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Contacter le support
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
