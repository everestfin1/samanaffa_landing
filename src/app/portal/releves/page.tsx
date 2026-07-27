'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '../../../hooks/useUserProfile';
import PortalHeader from '../../../components/portal/PortalHeader';
import C1PageBackground from '../../../components/portal/C1PageBackground';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

/** Stub for C6 Relevés — full Momar screen comes later. */
export default function RelevesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: userData, isLoading } = useUserProfile();

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
        activeTab="dashboard"
        onLogout={async () => {
          await signOut({ callbackUrl: '/login' });
        }}
      />
      <div className="c2-shell">
        <div className="c2-main">
          <button
            type="button"
            className="c2-back"
            onClick={() => router.back()}
          >
            ← Retour
          </button>
          <h1 className="c2-title">Relevés & documents</h1>
          <p className="c2-detail-note">Écran C6 Momar à venir.</p>
        </div>
      </div>
    </div>
  );
}
