'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import PortalHeader from '../../../components/portal/PortalHeader';
import C8Aide from '../../../components/portal/C8Aide';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export default function AidePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: userData, isLoading, error: profileError } = useUserProfile();

  useEffect(() => {
    document.documentElement.classList.add('c1-dashboard');
    document.body.classList.add('c1-dashboard');
    return () => {
      document.documentElement.classList.remove('c1-dashboard');
      document.body.classList.remove('c1-dashboard');
    };
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="c1-page c1-page--soft c1-page--center">
        <p className="text-night/70">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  if (profileError || !userData) {
    return (
      <div className="c1-page c1-page--soft c1-page--center">
        <div className="text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement</p>
          <button type="button" className="c1-create" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = (userData.kycStatus as KYCStatus) || 'PENDING';

  return (
    <div className="c1-page c1-page--soft">
      <PortalHeader
        variant="momar"
        userData={{
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          userId: userData.id || '',
          isNewUser: false,
          kycStatus,
        }}
        kycStatus={kycStatus}
        activeTab="dashboard"
        onLogout={async () => {
          await signOut({ callbackUrl: '/login' });
        }}
      />
      <C8Aide />
    </div>
  );
}
