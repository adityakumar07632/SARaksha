import { AnomalyDetectionResult, EvidenceQualityScore } from './types';

/**
 * Calculates Normalized Difference Vegetation Index (NDVI)
 * Formula: (NIR - RED) / (NIR + RED)
 *
 * @param nir Near-Infrared band reflectance (Sentinel-2 Band 8)
 * @param red Red band reflectance (Sentinel-2 Band 4)
 * @returns number between -1.0 and +1.0, or null if invalid inputs
 */
export function calculateNDVI(nir: number, red: number): number | null {
  if (typeof nir !== 'number' || typeof red !== 'number' || isNaN(nir) || isNaN(red)) {
    return null;
  }

  const denominator = nir + red;
  if (denominator === 0) {
    return 0;
  }

  const ndvi = (nir - red) / denominator;

  // Clamp within scientific bounds [-1.0, +1.0] and round to 4 decimal places
  const clamped = Math.max(-1.0, Math.min(1.0, ndvi));
  return Math.round(clamped * 10000) / 10000;
}

/**
 * Calculates Normalized Difference Water Index (NDWI)
 * Formula (McFeeters 1996): (GREEN - NIR) / (GREEN + NIR)
 *
 * @param green Green band reflectance (Sentinel-2 Band 3)
 * @param nir Near-Infrared band reflectance (Sentinel-2 Band 8)
 * @returns number between -1.0 and +1.0, or null if invalid inputs
 */
export function calculateNDWI(green: number, nir: number): number | null {
  if (typeof green !== 'number' || typeof nir !== 'number' || isNaN(green) || isNaN(nir)) {
    return null;
  }

  const denominator = green + nir;
  if (denominator === 0) {
    return 0;
  }

  const ndwi = (green - nir) / denominator;
  const clamped = Math.max(-1.0, Math.min(1.0, ndwi));
  return Math.round(clamped * 10000) / 10000;
}

/**
 * Calculates percentage change between baseline and comparison periods
 * Formula: ((comparison - baseline) / baseline) * 100
 *
 * @param baseline Baseline observation value
 * @param comparison Post-intervention comparison value
 * @returns percentage rounded to 1 decimal place
 */
export function calculatePercentageChange(baseline: number, comparison: number): number {
  if (typeof baseline !== 'number' || typeof comparison !== 'number' || isNaN(baseline) || isNaN(comparison)) {
    return 0;
  }

  if (baseline === 0) {
    return comparison > 0 ? 100 : 0;
  }

  const pct = ((comparison - baseline) / Math.abs(baseline)) * 100;
  return Math.round(pct * 10) / 10;
}

/**
 * Detects spectral vegetation anomaly by comparing current observation to expected historical baseline
 */
export function detectVegetationAnomaly(
  currentNdvi: number,
  baselineNdvi: number,
  warningThresholdPercent: number = 5,
  criticalThresholdPercent: number = 10
): AnomalyDetectionResult {
  const deviationPercent = calculatePercentageChange(baselineNdvi, currentNdvi);
  const isAnomaly = deviationPercent <= -warningThresholdPercent;
  const isCritical = deviationPercent <= -criticalThresholdPercent;

  let severity: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (isCritical) {
    severity = 'HIGH';
  } else if (isAnomaly) {
    severity = 'MEDIUM';
  }

  return {
    metric: 'NDVI Vegetation Biomass',
    currentValue: currentNdvi,
    expectedBaseline: baselineNdvi,
    deviationPercent,
    warningThresholdPercent,
    criticalThresholdPercent,
    isAnomaly,
    severity,
    observationPeriod: '2026 Post-Monsoon Orbit',
    evidenceType: 'Sentinel-2 Spectral Pass & Dual GNSS Ground Audit',
    recommendedAction: isCritical
      ? 'Immediate On-Site Field Inspection Required'
      : isAnomaly
      ? 'Schedule Zonal Monitoring Review'
      : 'Maintain Routine Satellite Surveillance',
    explanation: `Current NDVI of ${currentNdvi} deviates by ${deviationPercent}% from the expected multi-year baseline of ${baselineNdvi}.`,
    isSimulated: true,
  };
}

/**
 * Computes deterministic Evidence Quality score based on telemetry metadata
 */
export function calculateEvidenceQuality(params: {
  accuracyM?: string;
  capturedAt: string;
  aiConfidence?: number;
  isVerified: boolean;
}): EvidenceQualityScore {
  // 1. GPS Accuracy Scoring (25% weight)
  let gpsScore = 70;
  if (params.accuracyM?.includes('±5m')) gpsScore = 95;
  else if (params.accuracyM?.includes('±10m')) gpsScore = 80;
  else if (params.accuracyM) gpsScore = 60;

  // 2. Timestamp Validity (20% weight)
  const timestampScore = params.capturedAt ? 95 : 40;

  // 3. Image Clarity/Exif Quality (15% weight)
  const imageQualityScore = 90;

  // 4. AI Confidence Score (15% weight)
  const aiScore = params.aiConfidence || 87;

  // 5. Human Nodal Verification (25% weight)
  const humanScore = params.isVerified ? 100 : 50;

  // Composite calculation
  const composite = Math.round(
    gpsScore * 0.25 +
    timestampScore * 0.20 +
    imageQualityScore * 0.15 +
    aiScore * 0.15 +
    humanScore * 0.25
  );

  let qualityGrade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'GOOD';
  if (composite >= 90) qualityGrade = 'EXCELLENT';
  else if (composite >= 75) qualityGrade = 'GOOD';
  else if (composite >= 60) qualityGrade = 'FAIR';
  else qualityGrade = 'POOR';

  return {
    gpsAccuracyScore: gpsScore,
    timestampValidityScore: timestampScore,
    imageQualityScore,
    aiConfidenceScore: aiScore,
    humanVerificationScore: humanScore,
    overallScore: composite,
    qualityGrade,
    breakdownSummary: `GPS Precision (${gpsScore}/100) &bull; Timestamp (${timestampScore}/100) &bull; AI Integrity (${aiScore}%) &bull; Human Sign-off (${humanScore}/100)`,
  };
}

/**
 * Computes composite Watershed / Intervention health score from the 4 weighted pillars
 */
export function calculateHealthComposite(
  vegetationScore: number,
  waterScore: number,
  conditionScore: number,
  degradationScore: number
): number {
  const composite =
    vegetationScore * 0.40 +
    waterScore * 0.30 +
    conditionScore * 0.20 +
    degradationScore * 0.10;

  return Math.round(composite);
}
