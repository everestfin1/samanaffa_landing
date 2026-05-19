'use client';

import { Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserProfile } from '../../../hooks/useUserProfile';
import SamaNaffaPortal from '../../../components/portal/SamaNaffaPortal';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

function SamaNaffaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const autoConfirmDeposit =
    searchParams.get('confirmDeposit') === '1' || searchParams.get('kycReturn') === '1';

  const { data: userData, isLoading, error } = useUserProfile();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-night/70">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-night/70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || (!isLoading && !userData)) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-night/70">Erreur lors du chargement des données</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors mt-4"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={{
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          userId: userData?.id || '',
          isNewUser: false,
          kycStatus: (userData?.kycStatus as KYCStatus) || 'PENDING',
        }}
        kycStatus={userData?.kycStatus as KYCStatus}
        activeTab="sama-naffa"
        setActiveTab={() => {}}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SamaNaffaPortal
          kycStatus={(userData?.kycStatus as KYCStatus) || 'PENDING'}
          autoConfirmDeposit={autoConfirmDeposit}
        />
      </main>
    </div>
  );
}

export default function SamaNaffaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-light flex items-center justify-center">
          <p className="text-night/70">Chargement…</p>
        </div>
      }
    >
      <SamaNaffaPageContent />
    </Suspense>
  );
}
