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
  
  // Default to relative path
  return '';
};

export const apiUrl = (path: string) => {
  const base = getApiUrl().replace(/\/+$/, '');
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
