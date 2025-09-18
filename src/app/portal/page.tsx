'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type KYCStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'completed';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userId: string;
  isNewUser: boolean;
  kycStatus: KYCStatus;
}

export default function PortalPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user data on mount and redirect to dashboard
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const userSource = localStorage.getItem('userSource');

    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // All users have completed KYC during registration, redirect to dashboard
      router.replace('/portal/dashboard');
    } else {
      // No user data found, check if user accessed portal directly
      if (!userSource) {
        // User accessed portal directly without login/register, provide fallback
        const fallbackUserData = {
          firstName: 'Amadou',
          lastName: 'Diallo',
          email: 'amadou.diallo@demo.com',
          phone: '+221 77 123 45 67',
          userId: 'USR_DEMO_001',
          isNewUser: false,
          kycStatus: 'completed' as KYCStatus // Always completed since KYC is done during registration
        };
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userData', JSON.stringify(fallbackUserData));
        localStorage.setItem('userSource', 'direct');
        
        setUserData(fallbackUserData);
        
        // Trigger storage event to update navigation
        window.dispatchEvent(new Event('storage'));
        router.replace('/portal/dashboard');
      } else {
        // User should have data but doesn't, redirect to login
        router.push('/login');
      }
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-gold-metallic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-night/70">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  );
}