'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ComparativeTools from '../../../components/portal/ComparativeTools';
import PortalHeader from '../../../components/portal/PortalHeader';

type KYCStatus = 'pending' | 'in_progress' | 'documents_required' | 'under_review' | 'approved' | 'rejected';

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
  const [kycStatus] = useState<KYCStatus>('approved');
  const [userData] = useState<UserData>({
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    userId: 'USR_2024_001',
    isNewUser: false,
    kycStatus: 'approved'
  });

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-light">
      <PortalHeader
        userData={userData}
        kycStatus={kycStatus}
        activeTab="compare"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {kycStatus === 'approved' ? (
          <ComparativeTools />
        ) : (
          <div className="text-center">
            <div className="bg-white rounded-2xl border border-timberwolf/20 p-8">
              <h1 className="text-2xl font-bold text-night mb-4">Accès restreint</h1>
              <p className="text-night/70">
                Veuillez compléter votre processus KYC pour accéder aux outils de comparaison.
              </p>
              <button 
                onClick={() => router.push('/portal/dashboard')}
                className="mt-4 bg-gold-metallic text-night px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
              >
                Retour au tableau de bord
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
