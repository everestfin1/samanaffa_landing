'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '../../../hooks/useUserProfile';
import SamaNaffaPortal from '../../../components/portal/SamaNaffaPortal';
import PortalHeader from '../../../components/portal/PortalHeader';
import KYCProtection from '../../../components/kyc/KYCProtection';

type KYCStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

export default function SamaNaffaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Use Tanstack Query hook for data fetching (same as dashboard)
  const { data: userData, isLoading, error } = useUserProfile();

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Vérification de l'authentification...</p>
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || (!isLoading && !userData)) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-night/70">Erreur lors du chargement des données</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors mt-4"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <KYCProtection kycStatus={(userData?.kycStatus as KYCStatus) || 'PENDING'}>
      <div className="min-h-screen bg-gray-light">
        <PortalHeader
          userData={{
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || '',
            phone: userData?.phone || '',
            userId: userData?.id || '',
            isNewUser: false,
            kycStatus: (userData?.kycStatus as KYCStatus) || 'PENDING'
          }}
          kycStatus={userData?.kycStatus as KYCStatus}
          activeTab="sama-naffa"
          setActiveTab={() => {}} // Not used with navigation
          onLogout={handleLogout}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SamaNaffaPortal />
        </main>
      </div>
    </KYCProtection>
  );
}
