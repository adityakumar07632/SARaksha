import { describe, it, expect } from 'vitest';
import {
  scaleReflectanceValue,
  computeRasterStatistics,
  processAoiRasterAnalysis,
  SENTINEL2_REFLECTANCE_SCALE,
} from './rasterProcessor';
import { monitoringService } from './monitoringService';

describe('Raster Processing & Pixel Statistics Engine', () => {
  // 1. Radiometric Reflectance Scaling
  describe('scaleReflectanceValue', () => {
    it('scales 16-bit integer DN to true BOA reflectance using 10000 divisor', () => {
      expect(scaleReflectanceValue(1420)).toBe(0.142);
      expect(scaleReflectanceValue(3480)).toBe(0.348);
      expect(scaleReflectanceValue(10000)).toBe(1.0);
    });

    it('masks nodata (0) and negative values as null', () => {
      expect(scaleReflectanceValue(0)).toBeNull();
      expect(scaleReflectanceValue(-100)).toBeNull();
      expect(scaleReflectanceValue(20000)).toBeNull(); // Out-of-bounds reflectance
    });
  });

  // 2. Statistical Analysis & Robust Median
  describe('computeRasterStatistics', () => {
    it('calculates robust median, mean, and dispersion over valid pixels', () => {
      const pixels = [0.38, 0.40, 0.42, 0.44, 0.95, null]; // 0.95 is an extreme noise pixel
      const stats = computeRasterStatistics(pixels);

      expect(stats.status).toBe('VALID');
      expect(stats.totalPixels).toBe(6);
      expect(stats.validPixels).toBe(5);
      expect(stats.invalidPixels).toBe(1);
      expect(stats.validPixelPercentage).toBe(83.3);
      expect(stats.median).toBe(0.42); // Median resists 0.95 noise outlier
      expect(stats.min).toBe(0.38);
      expect(stats.max).toBe(0.95);
      expect(stats.stdDev).toBeGreaterThan(0);
    });

    it('returns INSUFFICIENT_DATA when all pixels in AOI are null/nodata', () => {
      const stats = computeRasterStatistics([null, null, null]);
      expect(stats.status).toBe('INSUFFICIENT_DATA');
      expect(stats.validPixels).toBe(0);
      expect(stats.median).toBeNull();
    });
  });

  // 3. End-to-End AOI Raster Analysis
  describe('processAoiRasterAnalysis for CD-012', () => {
    it('processes 11x11 raster window (121 pixels at 10m resolution) for Check Dam #12', () => {
      const result = processAoiRasterAnalysis(27.5684, 76.6128);

      expect(result.aoi.windowPixels).toBe('11x11');
      expect(result.aoi.spatialResolution).toBe('10m per pixel');
      expect(result.aoi.aoiAreaM2).toBe(12100);

      // Current Observation
      expect(result.currentObservation.ndvi.validPixels).toBe(121);
      expect(result.currentObservation.ndvi.validPixelPercentage).toBe(100.0);
      expect(result.currentObservation.ndvi.median).toBeGreaterThanOrEqual(0.3);
      expect(result.currentObservation.ndvi.median).toBeLessThanOrEqual(0.6);

      // Baseline Observation
      expect(result.baselineObservation.ndvi.validPixels).toBe(121);
      expect(result.baselineObservation.ndvi.median).toBeDefined();

      // Change Analysis
      expect(result.changeAnalysis.ndviPercentageChange).toBeDefined();
      expect(['SIMULATED', 'REAL_ORBITAL_RASTER']).toContain(result.provenance.sourceType);
      expect(result.provenance.scaleFactor).toBe(SENTINEL2_REFLECTANCE_SCALE);
    });
  });

  // 4. Monitoring Service Deduplication
  describe('monitoringService', () => {
    it('manages monitoring events and prevents duplicate scene evaluations', () => {
      const initialCount = monitoringService.getEvents('CD-012').length;
      expect(initialCount).toBeGreaterThanOrEqual(1);

      // Attempt to add duplicate scene
      monitoringService.addEvent({
        id: 'EVT-TEST-001',
        interventionId: 'CD-012',
        interventionName: 'Check Dam #12',
        sceneId: 'S2C_43RFL_20241219_2_L2A', // already exists
        observationDate: '2024-12-19',
        previousNdvi: 0.4900,
        currentNdvi: 0.0949,
        percentageChange: -80.6,
        anomalyLevel: 'HIGH_PRIORITY',
        status: 'REVIEW_REQUIRED',
        recommendedAction: 'Inspect downstream apron.',
        createdAt: new Date().toISOString(),
        provenance: {
          sourceType: 'REAL_ORBITAL_RASTER',
          satellite: 'Sentinel-2 Level-2A',
        },
      });

      expect(monitoringService.getEvents('CD-012').length).toBe(initialCount);

      // Update status
      monitoringService.updateStatus('EVT-CD012-20241219', 'VERIFIED');
      const updated = monitoringService.getEvents('CD-012').find((e) => e.id === 'EVT-CD012-20241219');
      expect(updated?.status).toBe('VERIFIED');
    });
  });
});
