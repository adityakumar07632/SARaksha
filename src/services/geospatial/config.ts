/**
 * Geospatial & STAC Service Configuration
 *
 * Configurable parameters for satellite discovery, STAC catalog endpoints,
 * cloud filtering thresholds, and reflectance processing.
 */

export interface GeospatialConfig {
  /** Public STAC API endpoint */
  stacApiUrl: string;
  /** Primary Sentinel-2 L2A STAC collection name */
  stacCollection: string;
  /** Secondary fallback STAC collection names */
  fallbackCollections: string[];
  /** Maximum acceptable scene cloud cover percentage (0-100) */
  maxCloudCoverPercent: number;
  /** Request timeout in milliseconds */
  requestTimeoutMs: number;
  /** Default buffer distance around point coordinate for bounding box (in degrees, ~1.1km) */
  defaultBboxBufferDeg: number;
  /** Preferred baseline period for multi-temporal comparison */
  baselinePeriod: {
    start: string; // ISO date YYYY-MM-DD
    end: string;
  };
  /** Preferred current / post-monsoon observation period */
  currentPeriod: {
    start: string;
    end: string;
  };
}

export const GEOSPATIAL_CONFIG: GeospatialConfig = {
  // Default to Element84 Earth Search (public, CORS-enabled, AWS Sentinel-2 L2A catalog)
  stacApiUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STAC_API_URL) ||
    'https://earth-search.aws.element84.com/v1',

  stacCollection:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STAC_COLLECTION) ||
    'sentinel-2-l2a',

  fallbackCollections: [
    'sentinel-2-c1-l2a',
    'sentinel-s2-l2a-cogs',
  ],

  maxCloudCoverPercent: 20.0,
  requestTimeoutMs: 12000,
  defaultBboxBufferDeg: 0.01, // ~1.1 km AOI around point

  // Historical baseline: Pre-construction period (Early 2024 / Summer)
  baselinePeriod: {
    start: '2024-01-01',
    end: '2024-05-31',
  },

  // Current observation: Recent post-monsoon / monitoring period
  currentPeriod: {
    start: '2024-08-01',
    end: '2024-10-31',
  },
};
