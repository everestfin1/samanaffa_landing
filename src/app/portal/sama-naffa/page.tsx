'use client';

import { Suspense, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useSamaNaffaAccounts } from '../../../hooks/useAccounts';
import { usePendingOnboardingDeposit } from '../../../hooks/usePendingOnboardingDeposit';
import PortalHeader from '../../../components/portal/PortalHeader';
import C1PageBackground from '../../../components/portal/C1PageBackground';
import C2KondanneList from '../../../components/portal/C2KondanneList';
import PendingOnboardingDepositCard from '../../../components/portal/PendingOnboardingDepositCard';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

function SamaNaffaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const autoConfirmDeposit =
    searchParams.get('confirmDeposit') === '1' || searchParams.get('kycReturn') === '1';

  const { data: userData, isLoading, error } = useUserProfile();
  const {
    data: samaAccounts = [],
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useSamaNaffaAccounts();
  const kycStatus = (userData?.kycStatus as KYCStatus) || 'PENDING';
  const {
    pendingDeposit,
    refresh: refreshPendingDeposit,
    clearPending,
  } = usePendingOnboardingDeposit(kycStatus === 'APPROVED');

  useEffect(() => {
    document.documentElement.classList.add('c1-dashboard');
    document.body.classList.add('c1-dashboard');
    return () => {
      document.documentElement.classList.remove('c1-dashboard');
      document.body.classList.remove('c1-dashboard');
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <p className="text-night/70">Vérification de l&apos;authentification...</p>
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

  if (isLoading || isLoadingAccounts) {
    return (
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <p className="text-night/70">Chargement...</p>
      </div>
    );
  }

  if (error || accountsError || !userData) {
    return (
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <div className="text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">Erreur lors du chargement des Kondannés</p>
          <button
            type="button"
            className="c1-create"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="c1-page">
      <C1PageBackground />
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
        onLogout={handleLogout}
      />

      {pendingDeposit && (
        <div className="c2-pending">
          <PendingOnboardingDepositCard
            intent={pendingDeposit}
            autoOpenConfirm={autoConfirmDeposit}
            onBeforeConfirm={() => true}
            onUpdated={refreshPendingDeposit}
            onCancelled={clearPending}
            onPaymentComplete={async () => {
              clearPending();
              await queryClient.invalidateQueries({ queryKey: ['samaNaffaAccounts'] });
            }}
          />
        </div>
      )}

      <C2KondanneList accounts={samaAccounts} />
    </div>
  );
}

export default function SamaNaffaPage() {
  return (
    <Suspense
      fallback={
        <div className="c1-page c1-page--center">
          <C1PageBackground />
          <p className="text-night/70">Chargement…</p>
        </div>
      }
    >
      <SamaNaffaPageContent />
    </Suspense>
  );
}
