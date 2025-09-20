'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ComparativeTools from '../../../components/portal/ComparativeTools';
import PortalHeader from '../../../components/portal/PortalHeader';

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

export default function ComparePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/login');
        return;
      }

      try {
        const profileResponse = await fetch('/api/users/profile');
        const profileData = await profileResponse.json();

        if (profileData.success) {
          setUserData({
            id: profileData.user.id,
            userId: profileData.user.id,
            firstName: profileData.user.firstName,
            lastName: profileData.user.lastName,
            email: profileData.user.email,
            phone: profileData.user.phone,
            kycStatus: profileData.user.kycStatus,
            isNewUser: profileData.user.isNewUser || false,
          });
        } else {
          setError('Erreur lors du chargement des données');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status, router]);

  const handleLogout = () => {
    router.push('/login');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-night/70">Chargement des outils de comparaison...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-night/70 mb-4">Erreur lors du chargement des données</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gold-metallic text-night px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors"
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
        userData={userData}
        kycStatus={userData.kycStatus}
        activeTab="compare"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ComparativeTools />
      </main>
    </div>
  );
}
