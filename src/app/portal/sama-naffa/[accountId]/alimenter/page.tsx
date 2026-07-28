'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useUserProfile } from '../../../../../hooks/useUserProfile';
import { useSamaNaffaAccounts } from '../../../../../hooks/useAccounts';
import PortalHeader from '../../../../../components/portal/PortalHeader';
import C3Alimenter from '../../../../../components/portal/C3Alimenter';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export default function AlimenterPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = typeof params.accountId === 'string' ? params.accountId : '';
  const { data: session, status } = useSession();
  const { data: userData, isLoading: isLoadingProfile, error: profileError } = useUserProfile();
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useSamaNaffaAccounts();

  useEffect(() => {
    document.documentElement.classList.add('c1-dashboard');
    document.body.classList.add('c1-dashboard');
    return () => {
      document.documentElement.classList.remove('c1-dashboard');
      document.body.classList.remove('c1-dashboard');
    };
  }, []);

  if (status === 'loading' || isLoadingProfile || isLoadingAccounts) {
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

  if (profileError || accountsError || !userData) {
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

  const account = accounts.find((a) => a.id === accountId);
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
        activeTab="sama-naffa"
        onLogout={async () => {
          await signOut({ callbackUrl: '/login' });
        }}
      />

      {!account ? (
        <div className="c2-shell">
          <div className="c2-main">
            <button
              type="button"
              className="c2-back"
              onClick={() => router.push('/portal/sama-naffa')}
            >
              ← Mes Kondannés
            </button>
            <p className="c2-empty">Kondanné introuvable.</p>
          </div>
        </div>
      ) : (
        <C3Alimenter account={account} kycStatus={kycStatus} />
      )}
    </div>
  );
}
