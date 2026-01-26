import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import * as React from 'react';

// Placeholder: This will be moved to a proper auth hook
const isAdminAuthenticated = () => {
  // For now, let's assume the admin is always authenticated.
  // In a real app, this would check for a valid token.
  return true;
};

export const Route = createFileRoute('/admin/_layout')({
  component: AdminLayout,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') return;
    if (!isAdminAuthenticated()) {
      throw redirect({ to: '/admin/login', search: {} });
    }
  },
});

function AdminLayout() {
  const navigate = useNavigate();

  React.useEffect(() => {
    (navigate as any)({ to: '/admin/', replace: true });
  }, [navigate]);

  return null;
}
