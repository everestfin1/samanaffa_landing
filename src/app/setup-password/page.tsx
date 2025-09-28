'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PasswordSetupStep from '@/components/registration/PasswordSetupStep';

function PasswordSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setUserId(userIdParam);
    } else {
      // Redirect to login if no userId provided
      router.push('/login?error=invalid_setup_link');
    }
  }, [searchParams, router]);

  const handleSuccess = () => {
    // Redirect to dashboard after successful password setup
    router.push('/portal/dashboard?message=password_setup_success');
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-metallic"></div>
      </div>
    );
  }

  return <PasswordSetupStep userId={userId} onSuccess={handleSuccess} />;
}

export default function SetupPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-white-smoke to-timberwolf/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-metallic"></div>
      </div>
    }>
      <PasswordSetupPage />
    </Suspense>
  );
}
