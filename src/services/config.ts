/**
 * SARaksha Global Service Configuration
 * Provides environment-aware API URL resolution for local development and production deployment.
 */

export function getApiBaseUrl(): string {
  // 1. Primary standard environment variable for backend API URL (e.g. Railway backend: https://<your-app>.up.railway.app)
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }

  // 2. Alternative / backward-compatible env variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RASTER_API_URL) {
    return import.meta.env.VITE_RASTER_API_URL.replace(/\/+$/, '');
  }

  // 3. In production builds with same-origin or proxy routing, return empty string
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return '';
  }

  // 4. In local development or testing, default to local FastAPI server
  return 'http://localhost:8000';
}
