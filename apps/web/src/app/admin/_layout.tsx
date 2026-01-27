import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import * as React from 'react';

const isAdminAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('admin_token');
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
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
