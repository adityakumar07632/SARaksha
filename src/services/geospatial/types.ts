import { Watershed, Intervention, FieldEvidence, Alert, AlertSeverity } from '../../types';

// ==========================================
// 1. GEOJSON SPECIFICATION TYPES
// ==========================================
export type GeoJSONPosition = [number, number] | [number, number, number]; // [lng, lat] or [lng, lat, elev]

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: GeoJSONPosition;
}

export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: GeoJSONPosition[];
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: GeoJSONPosition[][];
}

export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: GeoJSONPosition[][][];
}

export type GeoJSONGeometry =
  | GeoJSONPoint
  | GeoJSONLineString
  | GeoJSONPolygon
  | GeoJSONMultiPolygon;

export interface GeoJSONFeature<G = GeoJSONGeometry, P = Record<string, any>> {
  type: 'Feature';
  geometry: G;
  properties: P;
  id?: string | number;
}

export interface GeoJSONFeatureCollection<G = GeoJSONGeometry, P = Record<string, any>> {
  type: 'FeatureCollection';
  features: GeoJSONFeature<G, P>[];
}

// ==========================================
// 2. DATA PROVENANCE & SATELLITE METADATA
// ==========================================
export type DataSourceType =
  | 'SATELLITE_SENTINEL2'
  | 'SATELLITE_LANDSAT'
  | 'FIELD_GNSS'
  | 'AI_MODEL'
  | 'HUMAN_NODAL'
  | 'SYNTHETIC_SIMULATION';

export type SatelliteDataState =
  | 'LOADING'
  | 'REAL'
  | 'SIMULATED'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface ProvenanceMetadata {
  source: string; // e.g. "Sentinel-2 MSI Level-2A"
  sourceType: DataSourceType;
  provider?: string; // e.g. "Element84 Earth Search STAC" / "Copernicus"
  collection?: string; // e.g. "sentinel-2-l2a"
  sceneId?: string; // e.g. "S2A_32VNJ_20240818_0_L2A"
  acquisitionDate: string;
  spatialResolution: string; // e.g. "10m"
  temporalResolution?: string; // e.g. "5 days"
  cloudCoveragePercent?: number; // e.g. 2.4%
  processingStatus: 'RAW' | 'CALCULATED' | 'VERIFIED' | 'SIMULATED';
  processingTimestamp?: string;
  isSimulated: boolean;
  confidence?: number;
  algorithmVersion?: string;
  bandsUsed?: string[]; // e.g. ["B04 (Red)", "B08 (NIR)"]
  assetUrls?: Record<string, string>;
  geometryFootprint?: GeoJSONPolygon | GeoJSONMultiPolygon;
}

// ==========================================
// 3. STAC (SPATIO-TEMPORAL ASSET CATALOG) TYPES
// ==========================================
export interface STACAsset {
  href: string;
  title?: string;
  type?: string;
  roles?: string[];
  'eo:bands'?: Array<{ name: string; common_name?: string }>;
}

export interface STACItemProperties {
  datetime: string;
  'eo:cloud_cover'?: number;
  cloud_cover?: number;
  platform?: string;
  constellation?: string;
  instruments?: string[];
  's2:mgrs_tile'?: string;
  's2:processing_baseline'?: string;
  [key: string]: any;
}

export interface STACItem {
  id: string;
  type: 'Feature';
  stac_version?: string;
  collection?: string;
  geometry: GeoJSONGeometry;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  properties: STACItemProperties;
  assets: Record<string, STACAsset>;
  links?: Array<{ rel: string; href: string; type?: string }>;
}

export interface STACSearchRequest {
  collections?: string[];
  bbox?: [number, number, number, number];
  intersects?: GeoJSONGeometry;
  datetime?: string; // e.g. "2024-01-01T00:00:00Z/2024-05-31T23:59:59Z"
  limit?: number;
  query?: Record<string, any>;
}

export interface STACSearchResponse {
  type: 'FeatureCollection';
  features: STACItem[];
  numberMatched?: number;
  numberReturned?: number;
  context?: {
    page?: number;
    limit?: number;
    matched?: number;
    returned?: number;
  };
}

// ==========================================
// 4. REAL ORBITAL SCENE OBSERVATION MODEL
// ==========================================
export interface OrbitalSceneObservation {
  sceneId: string;
  platform: string; // e.g. "Sentinel-2A"
  collection: string;
  acquisitionDate: string; // ISO String
  cloudCoverPercent: number;
  bbox: [number, number, number, number];
  geometry: GeoJSONGeometry;
  thumbnailUrl?: string;
  visualUrl?: string;
  bands: {
    red?: string; // B04
    nir?: string; // B08
    green?: string; // B03
    blue?: string; // B02
  };
  reflectanceSample?: {
    red: number;
    nir: number;
    green: number;
  };
  calculatedNdvi: number | null;
  calculatedNdwi: number | null;
  provenance: ProvenanceMetadata;
}

export interface RealSpectralAnalysisResult {
  interventionId: string;
  state: SatelliteDataState;
  currentScene: OrbitalSceneObservation | null;
  baselineScene: OrbitalSceneObservation | null;
  currentNdvi: number | null;
  baselineNdvi: number | null;
  currentNdwi: number | null;
  baselineNdwi: number | null;
  percentageChange: number | null;
  anomalyResult: AnomalyDetectionResult | null;
  statusMessage: string;
  isSimulated: boolean;
  fetchedAt: string;
}

// ==========================================
// 5. SPECTRAL OBSERVATIONS (NDVI / NDWI)
// ==========================================
export interface NDVIObservation {
  id: string;
  interventionId: string;
  date: string; // e.g. "2026-08-18"
  month: string; // e.g. "Aug"
  year: number; // e.g. 2026
  value: number; // e.g. 0.42 (-1 to +1)
  nirBandValue?: number;
  redBandValue?: number;
  source: string;
  resolution: string;
  cloudCoverage: number;
  isSimulated: boolean;
  qualityFlag: 'GOOD' | 'CLOUD_AFFECTED' | 'INTERPOLATED';
}

export interface NDWIObservation {
  id: string;
  interventionId: string;
  date: string;
  month: string;
  year: number;
  value: number; // e.g. 0.24 (-1 to +1)
  greenBandValue?: number;
  nirBandValue?: number;
  source: string;
  resolution: string;
  cloudCoverage: number;
  isSimulated: boolean;
  definition: 'McFeeters_1996 (Green-NIR)' | 'Gao_1996 (NIR-SWIR)';
}

// ==========================================
// 6. CHANGE & ANOMALY DETECTION MODELS
// ==========================================
export interface ChangeObservation {
  metric: 'Vegetation (NDVI)' | 'Water Presence (NDWI)' | 'Surface Area (Ha)';
  baselineDate: string; // e.g. "2024 Pre-Construction"
  comparisonDate: string; // e.g. "2026 Post-Monsoon"
  baselineValue: number;
  comparisonValue: number;
  percentageChange: number; // Calculated dynamically: ((comp - base) / base) * 100
  source: string;
  isSimulated: boolean;
  interpretation: string;
}

export interface AnomalyDetectionResult {
  metric: string;
  currentValue: number;
  expectedBaseline: number;
  deviationPercent: number; // e.g. -14.2%
  warningThresholdPercent: number; // e.g. 5%
  criticalThresholdPercent: number; // e.g. 10%
  isAnomaly: boolean;
  severity: AlertSeverity;
  observationPeriod: string;
  evidenceType: string;
  recommendedAction: string;
  explanation: string;
  isSimulated: boolean;
}

// ==========================================
// 7. EVIDENCE QUALITY MODEL
// ==========================================
export interface EvidenceQualityScore {
  gpsAccuracyScore: number; // 0-100 (e.g. ±5m = 95)
  timestampValidityScore: number; // 0-100
  imageQualityScore: number; // 0-100
  aiConfidenceScore: number; // 0-100
  humanVerificationScore: number; // 0-100 (100 if verified, 50 if pending)
  overallScore: number; // Weighted composite 0-100
  qualityGrade: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  breakdownSummary: string;
}

// ==========================================
// 8. GIS MAP LAYER CONFIGURATION
// ==========================================
export type MapLayerType =
  | 'base'
  | 'boundary'
  | 'drainage'
  | 'water'
  | 'intervention'
  | 'evidence'
  | 'alert'
  | 'satellite_footprint';

export interface MapLayerConfig {
  id: string;
  name: string;
  type: MapLayerType;
  visible: boolean;
  source: string;
  isSimulated: boolean;
  data: any; // GeoJSON or Array of Markers
  style?: Record<string, any>;
  zIndex?: number;
}

// ==========================================
// 9. GEOSPATIAL PROVIDER INTERFACE
// ==========================================
export interface GeospatialProvider {
  getWatersheds(): Promise<Watershed[]>;
  getWatershed(id: string): Promise<Watershed | null>;
  getInterventions(watershedId?: string): Promise<Intervention[]>;
  getIntervention(id: string): Promise<Intervention | null>;
  getNDVIObservations(interventionId: string): Promise<NDVIObservation[]>;
  getNDWIObservations(interventionId: string): Promise<NDWIObservation[]>;
  getChangeDetection(interventionId: string, baselineYear: number, comparisonYear: number): Promise<ChangeObservation[]>;
  detectVegetationAnomaly(interventionId: string): Promise<AnomalyDetectionResult>;
  getMapLayers(watershedId?: string): Promise<MapLayerConfig[]>;
  evaluateEvidenceQuality(evidence: FieldEvidence): EvidenceQualityScore;
  /** Phase 4: Fetch real Sentinel-2 satellite observations via STAC */
  getRealSpectralAnalysis?(
    interventionId: string,
    coordinates: [number, number]
  ): Promise<RealSpectralAnalysisResult>;
}
