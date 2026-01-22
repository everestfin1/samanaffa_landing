import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/apesenegal')({
  component: APEPage,
});

export default function APEPage() {
  const navigate = useNavigate();

  useEffect(() => {
    (navigate as any)({ to: '/' });
  }, [navigate]);

  return null;
}

