'use client';

import { useSession, signOut } from 'next-auth/react';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useRecentTransactions } from '../../../hooks/useTransactions';
import { useAllUserAccounts } from '../../../hooks/useAccounts';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import PortalHeader from '../../../components/portal/PortalHeader';
import C1Dashboard from '../../../components/portal/C1Dashboard';
import C1PageBackground from '../../../components/portal/C1PageBackground';
import KYCInitiationModal from '../../../components/portal/KYCInitiationModal';
import type { PendingOnboardingDeposit } from '../../../components/portal/OnboardingDepositModal';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showKycModal, setShowKycModal] = useState(false);
  const [pendingDeposit, setPendingDeposit] = useState<PendingOnboardingDeposit | null>(null);

  const { data: userData, isLoading: isLoadingProfile, error: profileError } = useUserProfile();
  const {
    data: recentTransactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useRecentTransactions(userData?.id || '', 5);
  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useAllUserAccounts();

  useEffect(() => {
    document.documentElement.classList.add('c1-dashboard');
    document.body.classList.add('c1-dashboard');
    return () => {
      document.documentElement.classList.remove('c1-dashboard');
      document.body.classList.remove('c1-dashboard');
    };
  }, []);

  useEffect(() => {
    if (!userData) return;
    if (userData.kycStatus !== 'APPROVED') return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/onboarding/pending-deposit');
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (data.intent && !cancelled) {
          setPendingDeposit(data.intent);
        }
      } catch {
        // non-fatal
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userData]);

  const samaAccounts = useMemo(
    () =>
      accounts.filter(
        (a) => a.accountType === 'SAMA_NAFFA' || a.accountType === 'sama_naffa',
      ),
    [accounts],
  );

  const isLoading = isLoadingProfile || isLoadingTransactions || isLoadingAccounts;
  const error =
    profileError?.message || transactionsError?.message || accountsError?.message || '';

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

  if (isLoading) {
    return (
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <p className="text-night/70">Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <div className="text-center px-4">
          <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-night/70 mb-4">
            {error || 'Erreur lors du chargement de votre tableau de bord'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="c1-create"
            type="button"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const kycStatus = (userData.kycStatus as KYCStatus) || 'PENDING';

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
        activeTab="dashboard"
        onLogout={handleLogout}
      />

      <C1Dashboard
        firstName={userData.firstName || ''}
        kycStatus={kycStatus}
        accounts={samaAccounts}
        transactions={recentTransactions}
        pendingDepositAmount={pendingDeposit?.amount ?? null}
        onStartKyc={() => setShowKycModal(true)}
        onConfirmDeposit={() => router.push('/portal/sama-naffa?confirmDeposit=1')}
      />

      <KYCInitiationModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
        onComplete={() => window.location.reload()}
      />
    </div>
  );
}
