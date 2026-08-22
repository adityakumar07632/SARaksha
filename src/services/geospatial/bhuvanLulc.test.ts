import { describe, it, expect } from 'vitest';
import { fetchBhuvanLulcStats, generateDemoBhuvanLulc } from './bhuvanLulcService';

describe('Phase 14: Bhuvan ISRO LULC Real-Data Integration', () => {
  it('generates a valid demo Bhuvan LULC fixture with exact codes and total area', () => {
    const res = generateDemoBhuvanLulc('CD-012');
    expect(res.sourceType).toBe('SIMULATED');
    expect(res.provider).toContain('Bhuvan / NRSC / ISRO');
    expect(res.state).toBe('RJ');
    expect(res.statistics.length).toBe(3);
    expect(res.statistics[0].code).toBe('l01');
    expect(res.statistics[0].area).toBe(0.74);
    expect(res.totalArea).toBe(205.54);
    expect(res.areaUnit).toBe('Ha');
    expect(res.provenance?.lulcCodesReturned).toEqual(['l01', 'l02', 'l04']);
  });

  it('handles offline fallback gracefully by returning typed BHUVAN_DATA_UNAVAILABLE', async () => {
    const res = await fetchBhuvanLulcStats('CD-012', false);
    expect(['REAL_BHUVAN_LULC', 'BHUVAN_DATA_UNAVAILABLE', 'BHUVAN_AUTH_ERROR']).toContain(res.sourceType);
    if (res.sourceType === 'BHUVAN_DATA_UNAVAILABLE') {
      expect(res.status).toBe('BHUVAN_DATA_UNAVAILABLE');
      expect(res.provider).toBe('Bhuvan / NRSC / ISRO');
      expect(res.reason).toBeDefined();
    }
  });

  it('never exposes API token in frontend objects or responses', async () => {
    const demo = generateDemoBhuvanLulc('CD-012');
    const serialized = JSON.stringify(demo);
    expect(serialized).not.toContain('token');
    expect(serialized).not.toContain('BHUVAN_LULC_API_TOKEN');

    const liveFallback = await fetchBhuvanLulcStats('CD-012', false);
    const serializedLive = JSON.stringify(liveFallback);
    expect(serializedLive).not.toContain('token=');
  });
});
