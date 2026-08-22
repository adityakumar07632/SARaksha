import {
  GeospatialProvider,
  NDVIObservation,
  NDWIObservation,
  ChangeObservation,
  AnomalyDetectionResult,
  MapLayerConfig,
  EvidenceQualityScore,
} from './types';
import {
  calculatePercentageChange,
  detectVegetationAnomaly,
  calculateEvidenceQuality,
} from './calculations';
import {
  MOCK_WATERSHEDS,
  MOCK_INTERVENTIONS,
  MOCK_SATELLITE_DATA,
  MOCK_GEOJSON_LAYERS,
  MOCK_FIELD_EVIDENCE,
  MOCK_ALERTS,
} from '../../data/mockData';
import { Watershed, Intervention, FieldEvidence } from '../../types';

export class MockGeospatialProvider implements GeospatialProvider {
  async getWatersheds(): Promise<Watershed[]> {
    return MOCK_WATERSHEDS;
  }

  async getWatershed(id: string): Promise<Watershed | null> {
    const found = MOCK_WATERSHEDS.find((w) => w.id === id || w.code === id);
    return found || null;
  }

  async getInterventions(watershedId?: string): Promise<Intervention[]> {
    if (!watershedId) return MOCK_INTERVENTIONS;
    return MOCK_INTERVENTIONS.filter((i) => i.watershedId === watershedId);
  }

  async getIntervention(id: string): Promise<Intervention | null> {
    const found = MOCK_INTERVENTIONS.find((i) => i.id === id || i.code === id);
    return found || null;
  }

  async getNDVIObservations(interventionId: string): Promise<NDVIObservation[]> {
    const sat = MOCK_SATELLITE_DATA[interventionId] || MOCK_SATELLITE_DATA['CD-012'];
    return sat.monthlyNdviTrend2025.map((item, idx) => ({
      id: `NDVI-${interventionId}-2025-${idx + 1}`,
      interventionId,
      date: `2025-${(idx + 1).toString().padStart(2, '0')}-15`,
      month: item.month,
      year: 2025,
      value: item.value,
      source: 'Sentinel-2 MSI (Simulated)',
      resolution: '10m Surface Reflectance',
      cloudCoverage: 1.8,
      isSimulated: true,
      qualityFlag: 'GOOD',
    }));
  }

  async getNDWIObservations(interventionId: string): Promise<NDWIObservation[]> {
    const sat = MOCK_SATELLITE_DATA[interventionId] || MOCK_SATELLITE_DATA['CD-012'];
    return sat.monthlyNdwiTrend2025.map((item, idx) => ({
      id: `NDWI-${interventionId}-2025-${idx + 1}`,
      interventionId,
      date: `2025-${(idx + 1).toString().padStart(2, '0')}-15`,
      month: item.month,
      year: 2025,
      value: item.value,
      source: 'Sentinel-2 MSI (Simulated)',
      resolution: '10m Surface Reflectance',
      cloudCoverage: 1.8,
      isSimulated: true,
      definition: 'McFeeters_1996 (Green-NIR)',
    }));
  }

  async getChangeDetection(
    interventionId: string,
    baselineYear: number = 2024,
    comparisonYear: number = 2026
  ): Promise<ChangeObservation[]> {
    const sat = MOCK_SATELLITE_DATA[interventionId] || MOCK_SATELLITE_DATA['CD-012'];
    const baseObs = sat.historicalObservations.find((o) => o.year === baselineYear) || sat.historicalObservations[1];
    const compObs = sat.historicalObservations.find((o) => o.year === comparisonYear) || sat.historicalObservations[3];

    // Compute percentage change dynamically via calculation utility
    const vegPctChange = calculatePercentageChange(baseObs.vegetationCoverPercent, compObs.vegetationCoverPercent);
    const ndviPctChange = calculatePercentageChange(baseObs.ndvi, compObs.ndvi);
    const waterAreaPctChange = calculatePercentageChange(baseObs.waterSurfaceAreaHa, compObs.waterSurfaceAreaHa);

    return [
      {
        metric: 'Vegetation (NDVI)',
        baselineDate: `${baselineYear} Baseline`,
        comparisonDate: `${comparisonYear} Post-Monsoon`,
        baselineValue: baseObs.vegetationCoverPercent,
        comparisonValue: compObs.vegetationCoverPercent,
        percentageChange: vegPctChange, // e.g. +42.6% relative or +12.7% absolute
        source: 'Sentinel-2 Multi-Temporal Analysis',
        isSimulated: true,
        interpretation: `Vegetation index increased by approximately ${vegPctChange}% between the selected observation periods.`,
      },
      {
        metric: 'Water Presence (NDWI)',
        baselineDate: `${baselineYear} Baseline`,
        comparisonDate: `${comparisonYear} Post-Monsoon`,
        baselineValue: baseObs.waterSurfaceAreaHa,
        comparisonValue: compObs.waterSurfaceAreaHa,
        percentageChange: waterAreaPctChange,
        source: 'Sentinel-2 Multi-Temporal Analysis',
        isSimulated: true,
        interpretation: `Surface water retention pool expanded by approximately ${waterAreaPctChange}% across the check dam basin.`,
      },
    ];
  }

  async detectVegetationAnomaly(interventionId: string): Promise<AnomalyDetectionResult> {
    // Check Dam #12 expected baseline is 0.49 vs current 0.42 -> -14.3% deviation
    return detectVegetationAnomaly(0.42, 0.49, 5, 10);
  }

  async getMapLayers(watershedId?: string): Promise<MapLayerConfig[]> {
    return [
      {
        id: 'sat_base',
        name: 'Satellite Base (Esri)',
        type: 'base',
        visible: true,
        source: 'Esri World Imagery',
        isSimulated: false,
        data: null,
      },
      {
        id: 'ws_boundary',
        name: 'Watershed Boundary',
        type: 'boundary',
        visible: true,
        source: 'State Remote Sensing Application Centre (SRSAC)',
        isSimulated: true,
        data: MOCK_GEOJSON_LAYERS.watershedBoundary,
      },
      {
        id: 'drainage_network',
        name: 'Drainage Network (Streams)',
        type: 'drainage',
        visible: true,
        source: 'Hydrological Stream Vector Model',
        isSimulated: true,
        data: MOCK_GEOJSON_LAYERS.drainageNetwork,
      },
      {
        id: 'water_bodies',
        name: 'Water Storage Bodies',
        type: 'water',
        visible: true,
        source: 'Surface Water Delineation',
        isSimulated: true,
        data: MOCK_GEOJSON_LAYERS.waterBodies,
      },
      {
        id: 'interventions_layer',
        name: 'Interventions (Masonry & Bunds)',
        type: 'intervention',
        visible: true,
        source: 'PMKSY Ground Registry',
        isSimulated: true,
        data: MOCK_INTERVENTIONS,
      },
      {
        id: 'field_evidence_layer',
        name: 'Field Evidence (Ground Photos)',
        type: 'evidence',
        visible: true,
        source: 'SARaksha Mobile Survey Client',
        isSimulated: true,
        data: MOCK_FIELD_EVIDENCE,
      },
      {
        id: 'alerts_layer',
        name: 'Spectral Alerts & Hazards',
        type: 'alert',
        visible: true,
        source: 'SARaksha Anomaly Engine',
        isSimulated: true,
        data: MOCK_ALERTS,
      },
    ];
  }

  evaluateEvidenceQuality(evidence: FieldEvidence): EvidenceQualityScore {
    return calculateEvidenceQuality({
      accuracyM: evidence.accuracyM || '±5m',
      capturedAt: evidence.capturedAt,
      aiConfidence: evidence.aiAnalysis.confidenceScore,
      isVerified: evidence.verificationStatus === 'VERIFIED',
    });
  }

  async getRealSpectralAnalysis(
    interventionId: string,
    coordinates: [number, number]
  ): Promise<any> {
    const anomaly = await this.detectVegetationAnomaly(interventionId);
    return {
      interventionId,
      state: 'SIMULATED',
      currentScene: {
        sceneId: `S2A_MSIL2A_20260818T053641_R062_T43REP (Simulated)`,
        platform: 'Sentinel-2A',
        collection: 'sentinel-2-l2a',
        acquisitionDate: '2026-08-18T05:36:41Z',
        cloudCoverPercent: 2.1,
        bbox: [76.58, 27.54, 76.64, 27.59],
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.58, 27.54],
              [76.64, 27.54],
              [76.64, 27.59],
              [76.58, 27.59],
              [76.58, 27.54],
            ],
          ],
        },
        calculatedNdvi: 0.42,
        calculatedNdwi: 0.24,
        provenance: {
          source: 'Sentinel-2 MSI Level-2A (Simulated)',
          sourceType: 'SYNTHETIC_SIMULATION',
          provider: 'SARaksha Local Synthetic Provider',
          sceneId: 'S2A_MSIL2A_20260818_SIM',
          acquisitionDate: '2026-08-18',
          spatialResolution: '10m Surface Reflectance',
          cloudCoveragePercent: 2.1,
          processingStatus: 'SIMULATED',
          isSimulated: true,
          bandsUsed: ['B04 (Red)', 'B08 (NIR)', 'B03 (Green)'],
        },
      },
      baselineScene: {
        sceneId: `S2B_MSIL2A_20240315T053729_R062_T43REP (Simulated)`,
        platform: 'Sentinel-2B',
        collection: 'sentinel-2-l2a',
        acquisitionDate: '2024-03-15T05:37:29Z',
        cloudCoverPercent: 1.4,
        bbox: [76.58, 27.54, 76.64, 27.59],
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [76.58, 27.54],
              [76.64, 27.54],
              [76.64, 27.59],
              [76.58, 27.59],
              [76.58, 27.54],
            ],
          ],
        },
        calculatedNdvi: 0.49,
        calculatedNdwi: 0.18,
        provenance: {
          source: 'Sentinel-2 MSI Level-2A (Simulated)',
          sourceType: 'SYNTHETIC_SIMULATION',
          provider: 'SARaksha Local Synthetic Provider',
          sceneId: 'S2B_MSIL2A_20240315_SIM',
          acquisitionDate: '2024-03-15',
          spatialResolution: '10m Surface Reflectance',
          cloudCoveragePercent: 1.4,
          processingStatus: 'SIMULATED',
          isSimulated: true,
          bandsUsed: ['B04 (Red)', 'B08 (NIR)', 'B03 (Green)'],
        },
      },
      currentNdvi: 0.42,
      baselineNdvi: 0.49,
      currentNdwi: 0.24,
      baselineNdwi: 0.18,
      percentageChange: -14.3,
      anomalyResult: anomaly,
      statusMessage: 'Demonstration simulation active.',
      isSimulated: true,
      fetchedAt: new Date().toISOString(),
    };
  }
}
