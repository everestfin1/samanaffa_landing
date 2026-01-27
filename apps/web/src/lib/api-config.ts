// API configuration for frontend-to-backend communication
// In development, calls go to localhost. In production, calls go to the deployed backend.

export const getApiUrl = () => {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for SSR or when env var is not set
  if (typeof process !== 'undefined' && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  
  // Default to relative path (works when frontend proxies to backend)
  return '';
};

export const apiUrl = (path: string) => {
  const base = getApiUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};
