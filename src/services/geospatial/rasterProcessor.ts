/**
 * SARaksha Client-Side Streaming Raster Intelligence Processor
 *
 * Implements real pixel extraction, Sentinel-2 Level-2A radiometric scaling (DN / 10000.0),
 * nodata filtering, and robust central-tendency statistics (median NDVI / NDWI).
 * Interfaces with the FastAPI raster backend when available.
 */

import { calculateNDVI, calculateNDWI } from './calculations';
import { getApiBaseUrl } from '../config';

export const SENTINEL2_REFLECTANCE_SCALE = 10000.0;
export const NODATA_VALUE = 0;

export interface RasterPixelStatistics {
  mean: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  stdDev: number | null;
  validPixels: number;
  invalidPixels: number;
  totalPixels: number;
  validPixelPercentage: number;
  status: 'VALID' | 'INSUFFICIENT_DATA' | 'INSUFFICIENT_VALID_PIXELS';
}

export interface RasterObservationData {
  date: string;
  meanReflectance?: {
    b04_red: number | null;
    b08_nir: number | null;
    b03_green: number | null;
  };
  ndvi: RasterPixelStatistics;
  ndwi: RasterPixelStatistics;
}

export interface AOIRasterAnalysisResult {
  sourceType?: 'REAL_ORBITAL_RASTER' | 'SIMULATED' | 'REAL_DATA_UNAVAILABLE';
  sourceClassification?: string;
  reason?: string;
  interventionId?: string;
  sceneId?: string;
  tileId?: string;
  acquisitionTimestamp?: string;
  cloudCover?: number;
  satellite?: string;
  collection?: string;
  resolutionMeters?: number;
  bands?: {
    green?: string;
    red?: string;
    nir?: string;
  };
  aoi: {
    center: [number, number];
    windowPixels: string;
    spatialResolution: string;
    aoiAreaM2: number;
  };
  currentObservation: RasterObservationData;
  baselineObservation?: RasterObservationData;
  statistics?: {
    validPixels: number;
    validPixelPercentage: number;
    ndviMedian: number | null;
    ndviMean: number | null;
    ndviStdDev: number | null;
    ndviMin: number | null;
    ndviMax: number | null;
    ndwiMedian: number | null;
    ndwiMean: number | null;
    ndwiStdDev: number | null;
    ndwiMin: number | null;
    ndwiMax: number | null;
  };
  changeAnalysis: {
    baselineMedianNdvi: number | null;
    currentMedianNdvi: number | null;
    ndviPercentageChange: number;
    interpretation: string;
  };
  dataQuality?: {
    score: 'EXCELLENT' | 'GOOD' | 'LIMITED' | 'INVALID';
    validPixelPercentage: number;
    cloudCoverPercentage: number;
    reasons: string[];
  };
  geographicValidation?: {
    sceneId?: string;
    tileId?: string;
    geometryValidated?: boolean;
    aoiIntersects?: boolean;
    targetCoordinateInsideRaster?: boolean;
    rasterCrs?: string;
    utmZone?: string;
    validationStatus?: 'GEOGRAPHICALLY_VALIDATED' | 'REJECTED';
    rejectionReason?: string | null;
  };
  provenance: {
    sourceType: 'REAL_ORBITAL_RASTER' | 'SIMULATED';
    sourceClassification?: string;
    interventionId?: string;
    latitude?: number;
    longitude?: number;
    boundingBox?: number[];
    sceneId?: string;
    tileId?: string;
    geometryValidated?: boolean;
    aoiIntersects?: boolean;
    targetCoordinateInsideRaster?: boolean;
    acquisitionTimestamp?: string;
    cloudCover?: number;
    satellite?: string;
    collection?: string;
    b03Asset?: string;
    b04Asset?: string;
    b08Asset?: string;
    utmZone?: string;
    rasterCrs?: string;
    pixelSize?: string;
    windowSize?: string;
    validPixelCount?: number;
    nodataPixelCount?: number;
    radiometricScale?: number;
    ndviMedian?: number | null;
    ndwiMedian?: number | null;
    stacCatalog?: string;
    stacItem?: string;
    scaleFactor?: number;
    nodataValue?: number;
    statisticsMethod?: 'median';
    validationStatus?: 'GEOGRAPHICALLY_VALIDATED' | 'REJECTED';
    rejectionReason?: string | null;
    processingVersion?: string;
    processedAt?: string;
    processingTimestamp?: string;
    note?: string;
  };
}

/**
 * Converts raw integer Digital Number (DN) to BOA Surface Reflectance [0.0 - 1.0].
 */
export function scaleReflectanceValue(rawDn: number): number | null {
  if (rawDn <= NODATA_VALUE || rawDn > 15000) {
    return null;
  }
  return Math.round((rawDn / SENTINEL2_REFLECTANCE_SCALE) * 10000) / 10000;
}

/**
 * Computes robust central tendency and dispersion metrics over pixel array.
 */
export function computeRasterStatistics(pixels: (number | null)[]): RasterPixelStatistics {
  const validPixels = pixels.filter(
    (p): p is number => p !== null && !isNaN(p) && isFinite(p)
  );
  const totalPixels = pixels.length;
  const validCount = validPixels.length;
  const invalidCount = totalPixels - validCount;
  const validPct =
    totalPixels > 0 ? Math.round((validCount / totalPixels) * 1000) / 10 : 0;

  if (validCount === 0) {
    return {
      mean: null,
      median: null,
      min: null,
      max: null,
      stdDev: null,
      validPixels: 0,
      invalidPixels: totalPixels,
      totalPixels,
      validPixelPercentage: 0,
      status: 'INSUFFICIENT_DATA',
    };
  }

  const sorted = [...validPixels].sort((a, b) => a - b);
  const mean = validPixels.reduce((acc, val) => acc + val, 0) / validCount;

  // Exact median computation
  const mid = Math.floor(validCount / 2);
  const median =
    validCount % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Standard deviation
  const variance =
    validPixels.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
    validCount;
  const stdDev = Math.sqrt(variance);

  return {
    mean: Math.round(mean * 10000) / 10000,
    median: Math.round(median * 10000) / 10000,
    min: Math.round(min * 10000) / 10000,
    max: Math.round(max * 10000) / 10000,
    stdDev: Math.round(stdDev * 10000) / 10000,
    validPixels: validCount,
    invalidPixels: invalidCount,
    totalPixels,
    validPixelPercentage: validPct,
    status: 'VALID',
  };
}

/**
 * Deterministic fixture extraction for offline test suites and DEMO mode only.
 */
export function extractAoiRasterWindow(
  latitude: number,
  longitude: number,
  windowSize: number = 11,
  season: 'baseline' | 'post_monsoon' = 'post_monsoon'
): { red: number[]; nir: number[]; green: number[] } {
  const total = windowSize * windowSize;
  const red: number[] = [];
  const nir: number[] = [];
  const green: number[] = [];

  const seed = (Math.abs(latitude) * 1000 + Math.abs(longitude) * 1000) % 100;

  for (let i = 0; i < total; i++) {
    const noise = Math.sin(seed + i) * 0.5 + 0.5;

    if (season === 'post_monsoon') {
      red.push(Math.round(1350 + noise * 140)); // ~0.135 - 0.149 Reflectance
      nir.push(Math.round(3380 + noise * 200)); // ~0.338 - 0.358 Reflectance
      green.push(Math.round(2300 + noise * 180)); // ~0.230 - 0.248 Reflectance
    } else {
      red.push(Math.round(2100 + noise * 160)); // ~0.210 - 0.226 Reflectance
      nir.push(Math.round(2750 + noise * 140)); // ~0.275 - 0.289 Reflectance
      green.push(Math.round(1750 + noise * 120)); // ~0.175 - 0.187 Reflectance
    }
  }

  return { red, nir, green };
}

/**
 * Executes multi-temporal raster pixel analysis for test mocks or explicit DEMO mode.
 */
export function processAoiRasterAnalysis(
  latitude: number,
  longitude: number,
  currentDate: string = '2024-08-18',
  baselineDate: string = '2024-03-15',
  windowSizePixels: number = 11
): AOIRasterAnalysisResult {
  const currRaw = extractAoiRasterWindow(latitude, longitude, windowSizePixels, 'post_monsoon');
  const currRed = currRaw.red.map(scaleReflectanceValue);
  const currNir = currRaw.nir.map(scaleReflectanceValue);
  const currGreen = currRaw.green.map(scaleReflectanceValue);

  const currNdviPixels = currRed.map((r, i) => calculateNDVI(currNir[i] ?? 0, r ?? 0));
  const currNdwiPixels = currGreen.map((g, i) => calculateNDWI(g ?? 0, currNir[i] ?? 0));

  const currNdviStats = computeRasterStatistics(currNdviPixels);
  const currNdwiStats = computeRasterStatistics(currNdwiPixels);

  const baseRaw = extractAoiRasterWindow(latitude, longitude, windowSizePixels, 'baseline');
  const baseRed = baseRaw.red.map(scaleReflectanceValue);
  const baseNir = baseRaw.nir.map(scaleReflectanceValue);
  const baseGreen = baseRaw.green.map(scaleReflectanceValue);

  const baseNdviPixels = baseRed.map((r, i) => calculateNDVI(baseNir[i] ?? 0, r ?? 0));
  const baseNdwiPixels = baseGreen.map((g, i) => calculateNDWI(g ?? 0, baseNir[i] ?? 0));

  const baseNdviStats = computeRasterStatistics(baseNdviPixels);
  const baseNdwiStats = computeRasterStatistics(baseNdwiPixels);

  const baseMedian = baseNdviStats.median ?? 0.49;
  const currMedian = currNdviStats.median ?? 0.42;
  const pctChange =
    baseMedian > 0
      ? Math.round(((currMedian - baseMedian) / baseMedian) * 1000) / 10
      : 0;

  return {
    sourceType: 'SIMULATED',
    aoi: {
      center: [latitude, longitude],
      windowPixels: `${windowSizePixels}x${windowSizePixels}`,
      spatialResolution: '10m per pixel',
      aoiAreaM2: Math.pow(windowSizePixels * 10, 2),
    },
    currentObservation: {
      date: currentDate,
      ndvi: currNdviStats,
      ndwi: currNdwiStats,
    },
    baselineObservation: {
      date: baselineDate,
      ndvi: baseNdviStats,
      ndwi: baseNdwiStats,
    },
    statistics: {
      validPixels: currNdviStats.validPixels,
      validPixelPercentage: currNdviStats.validPixelPercentage,
      ndviMedian: currNdviStats.median,
      ndviMean: currNdviStats.mean,
      ndviStdDev: currNdviStats.stdDev,
      ndviMin: currNdviStats.min,
      ndviMax: currNdviStats.max,
      ndwiMedian: currNdwiStats.median,
      ndwiMean: currNdwiStats.mean,
      ndwiStdDev: currNdwiStats.stdDev,
      ndwiMin: currNdwiStats.min,
      ndwiMax: currNdwiStats.max,
    },
    changeAnalysis: {
      baselineMedianNdvi: baseMedian,
      currentMedianNdvi: currMedian,
      ndviPercentageChange: pctChange,
      interpretation: `Median NDVI changed by ${pctChange}% across ${currNdviStats.validPixels} validated 10m pixels.`,
    },
    dataQuality: {
      score: 'EXCELLENT',
      validPixelPercentage: 100.0,
      cloudCoverPercentage: 2.4,
      reasons: [
        'Demo simulation: clear sky (2.4% cloud cover).',
        'Complete 10m pixel coverage (121/121 valid pixels).',
      ],
    },
    geographicValidation: {
      sceneId: 'S2A_32VNJ_20240818_0_L2A_DEMO',
      tileId: '43RFL',
      geometryValidated: true,
      aoiIntersects: true,
      targetCoordinateInsideRaster: true,
      rasterCrs: 'EPSG:32643 (WGS84 / UTM Zone 43N)',
      utmZone: 'UTM Zone 43N',
      validationStatus: 'GEOGRAPHICALLY_VALIDATED',
      rejectionReason: null,
    },
    provenance: {
      sourceType: 'SIMULATED',
      interventionId: 'CD-012',
      latitude,
      longitude,
      boundingBox: [longitude - 0.005, latitude - 0.005, longitude + 0.005, latitude + 0.005],
      sceneId: 'S2A_32VNJ_20240818_0_L2A_DEMO',
      acquisitionTimestamp: `${currentDate}T10:45:00Z`,
      cloudCover: 2.4,
      satellite: 'Sentinel-2 MSI Level-2A (Demo Simulation)',
      collection: 'sentinel-2-l2a-demo',
      b03Asset: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/.../B03.tif',
      b04Asset: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/.../B04.tif',
      b08Asset: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/.../B08.tif',
      utmZone: 'UTM Zone 43N',
      rasterCrs: 'EPSG:32643 (WGS84 / UTM Zone 43N)',
      pixelSize: '10m x 10m Ground Sample Distance',
      windowSize: `${windowSizePixels}x${windowSizePixels} (${windowSizePixels * 10}m x ${windowSizePixels * 10}m AOI)`,
      validPixelCount: currNdviStats.validPixels,
      nodataPixelCount: 0,
      radiometricScale: SENTINEL2_REFLECTANCE_SCALE,
      ndviMedian: currMedian,
      ndwiMedian: currNdwiStats.median,
      stacCatalog: 'https://earth-search.aws.element84.com/v1',
      stacItem: 'S2A_32VNJ_20240818_0_L2A_DEMO',
      scaleFactor: SENTINEL2_REFLECTANCE_SCALE,
      nodataValue: NODATA_VALUE,
      statisticsMethod: 'median',
      processingVersion: '12.0.0',
      processingTimestamp: new Date().toISOString(),
      note: 'Deterministic fixture for offline evaluation.',
    },
  };
}

/**
 * Queries FastAPI backend for authoritative Sentinel-2 L2A raster pixel extraction.
 */
export async function fetchRasterAnalysis(
  latitude: number,
  longitude: number,
  interventionId: string = 'CD-012',
  forceDemo: boolean = false
): Promise<AOIRasterAnalysisResult> {
  if (forceDemo) {
    const res = processAoiRasterAnalysis(latitude, longitude);
    if (res.provenance) {
      res.provenance.interventionId = interventionId;
    }
    return res;
  }

  const backendUrl = getApiBaseUrl();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${backendUrl}/api/satellite/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interventionId,
        latitude,
        longitude,
        windowPixels: 11,
        forceDemo,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err: any) {
    console.warn('[SARaksha Frontend] Live backend raster extraction unavailable:', err);
  }

  return {
    sourceType: 'REAL_DATA_UNAVAILABLE',
    reason: 'Backend raster service unavailable. Switch to Demo Data for offline evaluation.',
    aoi: {
      center: [latitude, longitude],
      windowPixels: '11x11',
      spatialResolution: '10m per pixel',
      aoiAreaM2: 12100,
    },
    currentObservation: {
      date: new Date().toISOString().split('T')[0],
      ndvi: {
        median: null,
        mean: null,
        min: null,
        max: null,
        stdDev: null,
        validPixels: 0,
        invalidPixels: 121,
        totalPixels: 121,
        validPixelPercentage: 0,
        status: 'INSUFFICIENT_DATA',
      },
      ndwi: {
        median: null,
        mean: null,
        min: null,
        max: null,
        stdDev: null,
        validPixels: 0,
        invalidPixels: 121,
        totalPixels: 121,
        validPixelPercentage: 0,
        status: 'INSUFFICIENT_DATA',
      },
    },
    changeAnalysis: {
      baselineMedianNdvi: null,
      currentMedianNdvi: null,
      ndviPercentageChange: 0,
      interpretation: 'Real Sentinel-2 raster pixel data is currently unavailable.',
    },
    provenance: {
      sourceType: 'REAL_ORBITAL_RASTER',
      note: 'Raster extraction unavailable.',
    },
  };
}

export interface MultiSceneHistoryResult {
  interventionId: string;
  totalScenesProcessed: number;
  observations: Array<{
    id: string;
    interventionId: string;
    sceneId: string;
    acquisitionTimestamp: string;
    observationDate: string;
    cloudCover: number;
    platform: string;
    ndviMedian: number | null;
    ndviMean: number | null;
    ndviStdDev: number | null;
    ndviMin: number | null;
    ndviMax: number | null;
    ndwiMedian: number | null;
    ndwiMean: number | null;
    ndwiStdDev: number | null;
    ndwiMin: number | null;
    ndwiMax: number | null;
    validPixelCount: number;
    totalPixelCount: number;
    validPixelPercentage: number;
    qualityScore: 'EXCELLENT' | 'GOOD' | 'LIMITED' | 'INVALID';
    qualityReasons: string[];
    sourceType: 'REAL_ORBITAL_RASTER' | 'SIMULATED';
    sourceClassification: string;
  }>;
  baseline: {
    value: number;
    sourceType: 'REAL_HISTORICAL_BASELINE' | 'CONFIGURED_REFERENCE' | 'SIMULATED';
    sourceClassification: string;
    method: string;
    scenesCount: number;
    dateRange?: string;
  };
  sourceType: 'REAL_ORBITAL_RASTER' | 'SIMULATED' | 'REAL_DATA_UNAVAILABLE';
}

export function generateDemoMultiSceneHistory(
  latitude: number,
  longitude: number,
  interventionId: string = 'CD-012'
): MultiSceneHistoryResult {
  const dates = ['2023-11-15', '2024-01-20', '2024-04-10', '2024-08-18'];
  const medians = [0.4850, 0.4920, 0.4410, 0.4206];
  const ndwis = [0.1750, 0.1820, 0.2100, 0.2392];

  const observations = dates.map((d, i) => ({
    id: `OBS-${interventionId}-DEMO-${i + 1}`,
    interventionId,
    sceneId: `S2A_32VNJ_${d.replace(/-/g, '')}_0_L2A_DEMO`,
    acquisitionTimestamp: `${d}T10:30:00Z`,
    observationDate: d,
    cloudCover: 1.5 + i * 0.8,
    platform: 'Sentinel-2A (Demo Simulation)',
    ndviMedian: medians[i],
    ndviMean: Math.round((medians[i] - 0.002) * 10000) / 10000,
    ndviStdDev: 0.018,
    ndviMin: Math.round((medians[i] - 0.04) * 10000) / 10000,
    ndviMax: Math.round((medians[i] + 0.04) * 10000) / 10000,
    ndwiMedian: ndwis[i],
    ndwiMean: Math.round((ndwis[i] - 0.001) * 10000) / 10000,
    ndwiStdDev: 0.019,
    ndwiMin: Math.round((ndwis[i] - 0.04) * 10000) / 10000,
    ndwiMax: Math.round((ndwis[i] + 0.04) * 10000) / 10000,
    validPixelCount: 121,
    totalPixelCount: 121,
    validPixelPercentage: 100.0,
    qualityScore: 'EXCELLENT' as const,
    qualityReasons: ['Demo multi-temporal observation fixture.'],
    sourceType: 'SIMULATED' as const,
    sourceClassification: 'DEMO DATA',
  }));

  return {
    interventionId,
    totalScenesProcessed: 4,
    observations,
    baseline: {
      value: 0.4885,
      sourceType: 'SIMULATED',
      sourceClassification: 'DEMO DATA BASELINE',
      method: 'median_of_demo_medians',
      scenesCount: 4,
      dateRange: '2023-11-15 to 2024-08-18 (Demo)',
    },
    sourceType: 'SIMULATED',
  };
}

export async function fetchMultiSceneHistory(
  latitude: number,
  longitude: number,
  interventionId: string = 'CD-012',
  forceDemo: boolean = false
): Promise<MultiSceneHistoryResult> {
  if (forceDemo) {
    return generateDemoMultiSceneHistory(latitude, longitude, interventionId);
  }

  const backendUrl = getApiBaseUrl();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${backendUrl}/api/satellite/multi-scene-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interventionId,
        latitude,
        longitude,
        windowPixels: 11,
        forceDemo,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[SARaksha Frontend] Multi-scene history endpoint unavailable:', err);
  }

  return {
    interventionId,
    totalScenesProcessed: 0,
    observations: [],
    baseline: {
      value: 0.4900,
      sourceType: 'CONFIGURED_REFERENCE',
      sourceClassification: 'CONFIGURED REFERENCE (insufficient historical observations)',
      method: 'dpr_watershed_reference',
      scenesCount: 0,
    },
    sourceType: 'REAL_DATA_UNAVAILABLE',
  };
}
