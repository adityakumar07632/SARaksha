/**
 * SARaksha Centralized API Client
 * Manages all HTTP requests to the FastAPI backend using VITE_API_BASE_URL.
 */

import { getApiBaseUrl } from '../config';

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = {
  /**
   * Resolves a relative API path against the configured base URL.
   * e.g. getUrl('/api/interventions') -> 'https://saraksha-backend.up.railway.app/api/interventions'
   */
  getUrl(path: string): string {
    const baseUrl = getApiBaseUrl();
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  },

  /**
   * Executes a GET request with structured error handling.
   */
  async get<T = any>(path: string, customHeaders?: Record<string, string>): Promise<T> {
    const url = this.getUrl(path);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...customHeaders,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(`HTTP GET ${path} failed with status ${response.status}`, response.status, errorData);
    }

    return response.json();
  },

  /**
   * Executes a POST request with JSON payload and structured error handling.
   */
  async post<T = any>(path: string, body?: any, customHeaders?: Record<string, string>): Promise<T> {
    const url = this.getUrl(path);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new ApiError(`HTTP POST ${path} failed with status ${response.status}`, response.status, errorData);
    }

    return response.json();
  },

  /**
   * Checks health status of the backend API.
   */
  async checkHealth(): Promise<{ status: string; service: string; timestamp: string }> {
    return this.get('/health');
  },
};
