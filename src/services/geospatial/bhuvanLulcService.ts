/**
 * SARaksha Bhuvan / NRSC / ISRO LULC Service (Phase 14)
 * Frontend client for Bhuvan Area-of-Interest (AOI) Land Use & Land Cover Statistics.
 *
 * Security & Transparency Invariants:
 * 1. The Bhuvan API token is NEVER handled in frontend code or stored in localStorage.
 * 2. All live requests are proxied securely through the SARaksha FastAPI backend.
 * 3. LULC codes and areas are presented faithfully without inventing unsupported structural claims.
 */

import { getApiBaseUrl } from '../config';

export interface BhuvanLulcRecord {
  code: string;
  area: number | string;
  unit: string;
  source: string;
}

export interface BhuvanLulcResult {
  sourceType:
    | 'REAL_BHUVAN_LULC'
    | 'BHUVAN_DATA_UNAVAILABLE'
    | 'BHUVAN_INVALID_GEOMETRY'
    | 'BHUVAN_AUTH_ERROR'
    | 'BHUVAN_API_ERROR'
    | 'SIMULATED';
  sourceClassification?: string;
  status: string;
  provider: string;
  endpoint?: string;
  interventionId: string;
  geometry?: string;
  state?: string;
  statistics: BhuvanLulcRecord[];
  totalArea?: number | null;
  areaUnit?: string;
  retrievedAt?: string;
  reason?: string;
  contextNotes?: string;
  provenance?: {
    sourceType: string;
    provider: string;
    endpoint?: string;
    interventionId: string;
    geometryWkt?: string;
    retrievedAt?: string;
    responseStatus: string;
    lulcCodesReturned: string[];
    areaUnit: string;
    isSimulated?: boolean;
  };
}

export function generateDemoBhuvanLulc(
  interventionId: string = 'CD-012',
  polygonWkt?: string
): BhuvanLulcResult {
  const wkt =
    polygonWkt ||
    'POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))';

  return {
    sourceType: 'SIMULATED',
    sourceClassification: 'DEMO DATA',
    status: 'SIMULATED',
    provider: 'Bhuvan / NRSC / ISRO (Demo Fixture)',
    endpoint: 'https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php',
    interventionId,
    geometry: wkt,
    state: 'RJ',
    statistics: [
      { code: 'l01', area: 0.74, unit: 'Ha', source: 'Bhuvan / NRSC (Demo)' },
      { code: 'l02', area: 1.63, unit: 'Ha', source: 'Bhuvan / NRSC (Demo)' },
      { code: 'l04', area: 203.17, unit: 'Ha', source: 'Bhuvan / NRSC (Demo)' },
    ],
    totalArea: 205.54,
    areaUnit: 'Ha',
    retrievedAt: new Date().toISOString(),
    contextNotes:
      'AOI land-use/land-cover composition retrieved for intervention watershed context.',
    provenance: {
      sourceType: 'SIMULATED',
      provider: 'Bhuvan / NRSC / ISRO',
      endpoint: 'https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php',
      interventionId,
      geometryWkt: wkt,
      retrievedAt: new Date().toISOString(),
      responseStatus: 'SIMULATED',
      lulcCodesReturned: ['l01', 'l02', 'l04'],
      areaUnit: 'Ha',
      isSimulated: true,
    },
  };
}

export async function fetchBhuvanLulcStats(
  interventionId: string = 'CD-012',
  forceDemo: boolean = false,
  polygonWkt?: string
): Promise<BhuvanLulcResult> {
  if (forceDemo) {
    return generateDemoBhuvanLulc(interventionId, polygonWkt);
  }

  const backendUrl = getApiBaseUrl();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${backendUrl}/api/geospatial/lulc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        interventionId,
        polygonWkt,
        forceDemo,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (res.ok) {
      return await res.json();
    }
  } catch (err: any) {
    console.warn('[SARaksha Frontend] Live Bhuvan LULC request failed:', err);
  }

  return {
    sourceType: 'BHUVAN_DATA_UNAVAILABLE',
    status: 'BHUVAN_DATA_UNAVAILABLE',
    provider: 'Bhuvan / NRSC / ISRO',
    interventionId,
    geometry: polygonWkt || 'POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))',
    statistics: [],
    reason:
      'Backend Bhuvan service unavailable or network offline. Switch to Demo Data for offline evaluation.',
    retrievedAt: new Date().toISOString(),
    provenance: {
      sourceType: 'BHUVAN_DATA_UNAVAILABLE',
      provider: 'Bhuvan / NRSC / ISRO',
      endpoint: 'https://bhuvan-app1.nrsc.gov.in/api/lulc/curl_aoi.php',
      interventionId,
      geometryWkt: polygonWkt,
      retrievedAt: new Date().toISOString(),
      responseStatus: 'BHUVAN_DATA_UNAVAILABLE',
      lulcCodesReturned: [],
      areaUnit: 'Ha',
    },
  };
}
