'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SamaNaffaPortal from '../../../components/portal/SamaNaffaPortal';
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

export default function SamaNaffaPage() {
  const router = useRouter();
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
        kycStatus={userData.kycStatus}
        activeTab="sama-naffa"
        setActiveTab={() => {}} // Not used with navigation
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SamaNaffaPortal />
      </main>
    </div>
  );
}
