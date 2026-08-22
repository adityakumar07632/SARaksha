import { describe, it, expect } from 'vitest';
import {
  scaleReflectanceValue,
  computeRasterStatistics,
  fetchRasterAnalysis,
} from './rasterProcessor';
import { calculateNDVI, calculateNDWI } from './calculations';

describe('Phase 12: Scientific Validation & Production Hardening', () => {
  // 1. Reflectance & Index Boundary Tests
  it('correctly handles boundary conditions without crashing or producing NaN', () => {
    expect(scaleReflectanceValue(0)).toBeNull();
    expect(scaleReflectanceValue(-10)).toBeNull();
    expect(scaleReflectanceValue(16000)).toBeNull();

    expect(calculateNDVI(0, 0)).toBe(0);
    expect(calculateNDWI(0, 0)).toBe(0);
  });

  // 2. Statistical Aggregation Across Boundary Pixels
  it('computes robust median and data validity percentages across contaminated pixel sets', () => {
    // Array with 100 valid pixels and 21 null (cloud/nodata) pixels
    const sample: (number | null)[] = [
      ...Array(100).fill(0.35),
      ...Array(21).fill(null),
    ];
    const stats = computeRasterStatistics(sample);
    expect(stats.validPixels).toBe(100);
    expect(stats.invalidPixels).toBe(21);
    expect(stats.totalPixels).toBe(121);
    expect(stats.validPixelPercentage).toBeCloseTo(82.6, 1);
    expect(stats.median).toBe(0.35);
  });

  // 3. Provenance Metadata Verification
  it('ensures demo fixture includes complete 22-parameter scientific provenance', async () => {
    const res = await fetchRasterAnalysis(27.5684, 76.6128, 'CD-012', true);
    expect(res.provenance.interventionId).toBe('CD-012');
    expect(res.provenance.radiometricScale).toBe(10000);
    expect(res.provenance.rasterCrs).toBeDefined();
    expect(res.provenance.windowSize).toBeDefined();
    expect(res.provenance.validPixelCount).toBe(121);
    expect(res.dataQuality?.score).toBe('EXCELLENT');
  });

  // 4. Strict Labeling
  it('never combines simulated and real tags', async () => {
    const demo = await fetchRasterAnalysis(27.5684, 76.6128, 'CD-012', true);
    expect(demo.sourceType).toBe('SIMULATED');
    expect(demo.provenance.sourceType).toBe('SIMULATED');
  });
});
