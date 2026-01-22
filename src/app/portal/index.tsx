import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useSession } from '@/components/providers/AuthProvider';

export const Route = createFileRoute('/portal/')({
  component: PortalPage,
});

export default function PortalPage() {
  const navigate = useNavigate();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (!data?.user) {
      (navigate as any)({ to: '/login' });
      return;
    }
    (navigate as any)({ to: '/portal/dashboard' });
  }, [data?.user, navigate, status]);

  return null;
}
