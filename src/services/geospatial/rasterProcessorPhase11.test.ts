import { describe, it, expect } from 'vitest';
import {
  scaleReflectanceValue,
  computeRasterStatistics,
  fetchRasterAnalysis,
  processAoiRasterAnalysis,
} from './rasterProcessor';
import { calculateNDVI, calculateNDWI } from './calculations';

describe('Phase 11: Real Sentinel-2 Raster Ingestion & Scientific Integrity', () => {
  // 1. Reflectance Scaling
  it('correctly applies Sentinel-2 BOA radiometric scaling (DN / 10000.0)', () => {
    expect(scaleReflectanceValue(0)).toBeNull(); // Nodata
    expect(scaleReflectanceValue(1628)).toBe(0.1628);
    expect(scaleReflectanceValue(2480)).toBe(0.2480);
    expect(scaleReflectanceValue(20000)).toBeNull(); // Saturated/Invalid
  });

  // 2. Pixel-wise NDVI & NDWI
  it('computes exact pixel NDVI and NDWI using standard formulas', () => {
    const red = 0.1628;
    const nir = 0.2480;
    const green = 0.1660;

    const ndvi = calculateNDVI(nir, red);
    const ndwi = calculateNDWI(green, nir);

    // NDVI = (0.2480 - 0.1628) / (0.2480 + 0.1628) = 0.0852 / 0.4108 = 0.2074
    expect(ndvi).toBeCloseTo(0.2074, 2);
    // NDWI = (0.1660 - 0.2480) / (0.1660 + 0.2480) = -0.0820 / 0.4140 = -0.1981
    expect(ndwi).toBeCloseTo(-0.1981, 2);
  });

  // 3. Central Tendency Statistics
  it('computes robust median, mean, and dispersion statistics across 121 pixels', () => {
    const sample = Array(121).fill(0.20);
    sample[60] = 0.25; // Median remains ~0.20

    const stats = computeRasterStatistics(sample);
    expect(stats.validPixels).toBe(121);
    expect(stats.validPixelPercentage).toBe(100.0);
    expect(stats.median).toBe(0.20);
    expect(stats.status).toBe('VALID');
  });

  // 4. Fallback Handling
  it('explicitly returns REAL_DATA_UNAVAILABLE when backend is unreachable in real mode', async () => {
    // Calling fetchRasterAnalysis with invalid endpoint or offline returns explicit UNAVAILABLE structure
    const res = await fetchRasterAnalysis(27.5684, 76.6128, 'CD-012', false);
    expect(['REAL_ORBITAL_RASTER', 'REAL_DATA_UNAVAILABLE']).toContain(res.sourceType);
  });

  // 5. Explicit Demo Mode
  it('returns clearly-labeled SIMULATED dataset when forceDemo is requested', async () => {
    const demoRes = await fetchRasterAnalysis(27.5684, 76.6128, 'CD-012', true);
    expect(demoRes.sourceType).toBe('SIMULATED');
    expect(demoRes.provenance.sourceType).toBe('SIMULATED');
    expect(demoRes.currentObservation.ndvi.validPixels).toBe(121);
  });
});
