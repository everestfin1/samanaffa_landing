import { redirect } from '@tanstack/react-router';

/**
 * Check if admin is authenticated (client-side)
 * Can be used both in hooks and in route beforeLoad
 */
export const isAdminAuthenticated = (): boolean => {
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

/**
 * Route guard for admin routes - use in beforeLoad
 * Throws redirect to login if not authenticated
 */
export const requireAdminAuth = () => {
  if (!isAdminAuthenticated()) {
    throw redirect({ to: '/admin/login', search: {} });
  }
};

export const useAdminAuth = () => {
  const getToken = () => localStorage.getItem('admin_token');
  
  const getUser = () => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  return { 
    isAuthenticated: isAdminAuthenticated(), 
    getToken, 
    getUser, 
    logout 
  };
};
