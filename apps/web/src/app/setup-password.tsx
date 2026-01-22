

import { useState, useEffect, Suspense } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import PasswordSetupStep from '@/components/registration/PasswordSetupStep';

function PasswordSetupPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string | undefined>;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userIdParam = searchParams?.userId;
    if (userIdParam) {
      setUserId(userIdParam);
    } else {
      // Redirect to login if no userId provided
      (navigate as any)({ to: '/login', search: { error: 'invalid_setup_link' } });
    }
  }, [searchParams, navigate]);

  const handleSuccess = () => {
    // Redirect to dashboard after successful password setup
    (navigate as any)({ to: '/portal/dashboard', search: { message: 'password_setup_success' } });
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

export const Route = createFileRoute('/setup-password')({
  component: SetupPasswordPage,
});

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
