/**
 * SARaksha Global Service Configuration
 * Provides environment-aware API URL resolution for local development and production Vercel deployment.
 */

export function getApiBaseUrl(): string {
  // If explicitly configured in environment (e.g. VITE_RASTER_API_URL="https://my-backend.com" or "http://localhost:8000")
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RASTER_API_URL !== undefined) {
    return import.meta.env.VITE_RASTER_API_URL;
  }

  // In production builds on Vercel (same-origin serverless API), default to empty string so /api/... is relative
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
    return '';
  }

  // In local development or testing, default to local FastAPI server
  return 'http://localhost:8000';
}
