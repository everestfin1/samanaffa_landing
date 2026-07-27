'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useUserProfile } from '../../../../hooks/useUserProfile';
import { useSamaNaffaAccounts } from '../../../../hooks/useAccounts';
import PortalHeader from '../../../../components/portal/PortalHeader';
import C1PageBackground from '../../../../components/portal/C1PageBackground';
import { formatCurrency } from '@/lib/utils';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

/**
 * Temporary C2 detail shell so list cards don’t 404.
 * Full Momar détail (10:2878) is the next portal step.
 */
export default function KondanneDetailPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = typeof params.accountId === 'string' ? params.accountId : '';
  const { data: session, status } = useSession();
  const { data: userData, isLoading: isLoadingProfile } = useUserProfile();
  const { data: accounts = [], isLoading: isLoadingAccounts } = useSamaNaffaAccounts();

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
      <div className="c1-page c1-page--center">
        <C1PageBackground />
        <p className="text-night/70">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const account = accounts.find((a) => a.id === accountId);
  const kycStatus = (userData?.kycStatus as KYCStatus) || 'PENDING';

  return (
    <div className="c1-page">
      <C1PageBackground />
      <PortalHeader
        variant="momar"
        userData={{
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
          userId: userData?.id || '',
          isNewUser: false,
          kycStatus,
        }}
        kycStatus={kycStatus}
        activeTab="sama-naffa"
        onLogout={async () => {
          await signOut({ callbackUrl: '/login' });
        }}
      />

      <div className="c2-shell">
        <div className="c2-main">
          <button
            type="button"
            className="c2-back"
            onClick={() => router.push('/portal/sama-naffa')}
          >
            ← Mes Kondannés
          </button>

          {!account ? (
            <p className="c2-empty">Kondanné introuvable.</p>
          ) : (
            <>
              <h1 className="c2-title">{account.productName?.trim() || 'Mon Kondanné'}</h1>
              <p className="c2-detail-balance">{formatCurrency(account.balance)}</p>
              <p className="c2-detail-note">
                Détail Momar (C2) à venir — Alimente / Retire / historique.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
