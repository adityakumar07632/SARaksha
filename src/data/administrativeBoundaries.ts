/**
 * SARaksha Administrative Boundaries Service
 *
 * IMPORTANT DATA INTEGRITY POLICY:
 * Synthetic / handcrafted coordinate loops have been removed completely to prevent
 * visual distortion of Indian national, state, and district geography.
 *
 * Authoritative administrative boundaries and place labels are provided natively by
 * the GIS reference overlay (Esri World Boundaries and Places / Survey of India WMS).
 */

export interface AdministrativeBoundaryCollection {
  country: { type: string; features: any[] };
  states: { type: string; features: any[] };
  districts: { type: string; features: any[] };
  isAuthoritativeLoaded: boolean;
  sourceNote: string;
}

export const ADMINISTRATIVE_BOUNDARIES: AdministrativeBoundaryCollection = {
  country: {
    type: 'FeatureCollection',
    features: [],
  },
  states: {
    type: 'FeatureCollection',
    features: [],
  },
  districts: {
    type: 'FeatureCollection',
    features: [],
  },
  isAuthoritativeLoaded: false,
  sourceNote:
    'Synthetic polygons removed. Authoritative Survey of India / Bhuvan administrative vector boundary ingest pending.',
};
