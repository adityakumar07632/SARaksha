import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './apiClient';
import { getApiBaseUrl } from '../config';

describe('SARaksha Centralized API Client & Config', () => {
  it('resolves API endpoints correctly without trailing slashes', () => {
    const url1 = apiClient.getUrl('/api/interventions');
    const url2 = apiClient.getUrl('api/interventions/CD-012');

    expect(url1).toContain('/api/interventions');
    expect(url2).toContain('/api/interventions/CD-012');
    expect(url1).not.toContain('//api');
  });

  it('provides a clean fallback for local development', () => {
    const base = getApiBaseUrl();
    expect(typeof base).toBe('string');
  });
});
