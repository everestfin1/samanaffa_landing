// API configuration for frontend-to-backend communication
// In development, calls go to localhost. In production, calls go to the deployed backend.

export const getApiUrl = () => {
  // In development, use the backend URL directly since proxy isn't working
  if (import.meta.env.DEV) {
    return 'http://localhost:8787';
  }
  
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for SSR or when env var is not set
  if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  
  // Auto-detect backend URL based on frontend URL pattern for Vercel deployments
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Pattern: samanaffa-landing-xxx.vercel.app -> sn-ape-backend-xxx.vercel.app
    if (hostname.includes('samanaffa-landing') && hostname.endsWith('.vercel.app')) {
      const backendHost = hostname.replace('samanaffa-landing', 'sn-ape-backend');
      return `https://${backendHost}`;
    }
  }
  
  // Default to relative path
  return '';
};

export const apiUrl = (path: string) => {
  const base = getApiUrl().replace(/\/+$/, '');
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
