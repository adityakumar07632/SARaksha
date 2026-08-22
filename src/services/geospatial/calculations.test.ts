import { describe, it, expect } from 'vitest';
import {
  calculateNDVI,
  calculateNDWI,
  calculatePercentageChange,
  detectVegetationAnomaly,
  calculateEvidenceQuality,
  calculateHealthComposite,
} from './calculations';

describe('Geospatial Calculation Engine', () => {
  // 1. NDVI Tests
  describe('calculateNDVI', () => {
    it('calculates standard NDVI from NIR and Red bands accurately', () => {
      // NIR = 0.6, Red = 0.2 -> (0.6 - 0.2) / (0.6 + 0.2) = 0.4 / 0.8 = 0.5
      const result = calculateNDVI(0.6, 0.2);
      expect(result).toBe(0.5);
    });

    it('handles zero denominator without throwing errors', () => {
      const result = calculateNDVI(0, 0);
      expect(result).toBe(0);
    });

    it('handles negative vegetation indices (water surfaces)', () => {
      // Water: Red = 0.3, NIR = 0.1 -> (0.1 - 0.3) / (0.1 + 0.3) = -0.2 / 0.4 = -0.5
      const result = calculateNDVI(0.1, 0.3);
      expect(result).toBe(-0.5);
    });

    it('clamps values within the scientific range [-1.0, 1.0]', () => {
      const result = calculateNDVI(10, 0);
      expect(result).toBeLessThanOrEqual(1.0);
    });

    it('returns null for NaN or non-numeric inputs', () => {
      expect(calculateNDVI(NaN, 0.4)).toBeNull();
      expect(calculateNDVI(0.5, undefined as any)).toBeNull();
    });
  });

  // 2. NDWI Tests
  describe('calculateNDWI', () => {
    it('calculates standard McFeeters NDWI from Green and NIR bands', () => {
      // Green = 0.4, NIR = 0.2 -> (0.4 - 0.2) / (0.4 + 0.2) = 0.2 / 0.6 = 0.3333
      const result = calculateNDWI(0.4, 0.2);
      expect(result).toBe(0.3333);
    });

    it('handles zero reflectance inputs gracefully', () => {
      expect(calculateNDWI(0, 0)).toBe(0);
    });
  });

  // 3. Percentage Change Tests
  describe('calculatePercentageChange', () => {
    it('calculates positive growth accurately', () => {
      // Baseline 0.34 to Comparison 0.42 -> ((0.42 - 0.34) / 0.34) * 100 = 23.5%
      const result = calculatePercentageChange(0.34, 0.42);
      expect(result).toBe(23.5);
    });

    it('calculates negative reduction accurately', () => {
      // Baseline 0.49 to Comparison 0.42 -> ((0.42 - 0.49) / 0.49) * 100 = -14.3%
      const result = calculatePercentageChange(0.49, 0.42);
      expect(result).toBe(-14.3);
    });

    it('handles zero baseline gracefully', () => {
      expect(calculatePercentageChange(0, 10)).toBe(100);
      expect(calculatePercentageChange(0, 0)).toBe(0);
    });
  });

  // 4. Anomaly Detection Tests
  describe('detectVegetationAnomaly', () => {
    it('flags critical anomalies when deviation exceeds critical threshold (-10%)', () => {
      const anomaly = detectVegetationAnomaly(0.42, 0.49, 5, 10);
      expect(anomaly.isAnomaly).toBe(true);
      expect(anomaly.severity).toBe('HIGH');
      expect(anomaly.deviationPercent).toBe(-14.3);
      expect(anomaly.recommendedAction).toContain('Field Inspection');
    });

    it('flags warning anomalies when deviation is between 5% and 10%', () => {
      const anomaly = detectVegetationAnomaly(0.45, 0.49, 5, 10);
      expect(anomaly.isAnomaly).toBe(true);
      expect(anomaly.severity).toBe('MEDIUM');
      expect(anomaly.deviationPercent).toBe(-8.2);
    });

    it('classifies normal fluctuations below threshold as non-anomalies', () => {
      const normal = detectVegetationAnomaly(0.48, 0.49, 5, 10);
      expect(normal.isAnomaly).toBe(false);
      expect(normal.severity).toBe('LOW');
    });
  });

  // 5. Evidence Quality Scoring
  describe('calculateEvidenceQuality', () => {
    it('awards high quality score for ±5m GNSS and human verification', () => {
      const quality = calculateEvidenceQuality({
        accuracyM: '±5m',
        capturedAt: '2026-08-18 10:42 AM IST',
        aiConfidence: 87,
        isVerified: true,
      });

      expect(quality.overallScore).toBeGreaterThanOrEqual(80);
      expect(quality.qualityGrade).toBe('EXCELLENT');
      expect(quality.gpsAccuracyScore).toBe(95);
      expect(quality.humanVerificationScore).toBe(100);
    });

    it('penalizes unverified or missing GNSS records', () => {
      const unverified = calculateEvidenceQuality({
        accuracyM: undefined,
        capturedAt: '2026-08-18',
        aiConfidence: 60,
        isVerified: false,
      });

      expect(unverified.overallScore).toBeLessThan(75);
      expect(unverified.humanVerificationScore).toBe(50);
    });
  });

  // 6. Composite Health Score Calculation
  describe('calculateHealthComposite', () => {
    it('applies 40/30/20/10 weight matrix correctly', () => {
      // 86*0.4 + 80*0.3 + 82*0.2 + 72*0.1 = 34.4 + 24.0 + 16.4 + 7.2 = 82
      const health = calculateHealthComposite(86, 80, 82, 72);
      expect(health).toBe(82);
    });
  });
});
