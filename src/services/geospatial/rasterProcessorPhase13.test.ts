import { describe, it, expect } from 'vitest';
import { fetchMultiSceneHistory } from './rasterProcessor';

describe('Phase 13: Multi-Scene Verification & SIH Demo Freeze', () => {
  it('correctly retrieves multi-scene history with distinct scene IDs and quality scores', async () => {
    const res = await fetchMultiSceneHistory(27.5684, 76.6128, 'CD-012', true);
    expect(res.observations.length).toBe(4);
    expect(res.baseline.scenesCount).toBe(4);
    expect(res.baseline.method).toBeDefined();

    const sceneIds = res.observations.map(o => o.sceneId);
    expect(new Set(sceneIds).size).toBe(4); // No duplicates
  });

  it('preserves strict separation between real and demo classifications', async () => {
    const demo = await fetchMultiSceneHistory(27.5684, 76.6128, 'CD-012', true);
    expect(demo.sourceType).toBe('SIMULATED');
    expect(demo.baseline.sourceType).toBe('SIMULATED');
    expect(demo.observations[0].sourceClassification).toBe('DEMO DATA');
  });

  it('handles offline fallback gracefully by reporting CONFIGURED REFERENCE', async () => {
    // Calling with non-existent or invalid backend endpoint without forceDemo
    const fallback = await fetchMultiSceneHistory(27.5684, 76.6128, 'CD-012', false);
    expect(['REAL_ORBITAL_RASTER', 'REAL_DATA_UNAVAILABLE']).toContain(fallback.sourceType);
    if (fallback.sourceType === 'REAL_DATA_UNAVAILABLE') {
      expect(fallback.baseline.sourceType).toBe('CONFIGURED_REFERENCE');
    }
  });
});
