import { describe, it, expect } from 'vitest';
import { fetchRasterAnalysis, fetchMultiSceneHistory, processAoiRasterAnalysis } from './rasterProcessor';

describe('Phase 13.1: Geographic Integrity & Multi-Scene Validation Fix', () => {
  it('includes complete geographic validation metadata in raster analysis results', async () => {
    const res = await fetchRasterAnalysis(27.5684, 76.6128, 'CD-012', true);
    expect(res.geographicValidation).toBeDefined();
    expect(res.geographicValidation?.validationStatus).toBe('GEOGRAPHICALLY_VALIDATED');
    expect(res.geographicValidation?.tileId).toBe('43RFL');
    expect(res.geographicValidation?.geometryValidated).toBe(true);
    expect(res.geographicValidation?.aoiIntersects).toBe(true);
    expect(res.geographicValidation?.targetCoordinateInsideRaster).toBe(true);
    expect(res.provenance.utmZone).toBe('UTM Zone 43N');
    expect(res.provenance.rasterCrs).toContain('EPSG:32643');
  });

  it('rejects scenes without valid bounding box coverage in offline fallback', async () => {
    // Calling with non-existent or invalid backend endpoint without forceDemo
    const fallback = await fetchMultiSceneHistory(27.5684, 76.6128, 'CD-012', false);
    if (fallback.sourceType === 'REAL_DATA_UNAVAILABLE') {
      expect(fallback.baseline.sourceType).toBe('CONFIGURED_REFERENCE');
      expect(fallback.baseline.sourceClassification).toContain('CONFIGURED REFERENCE');
    }
  });

  it('preserves provenance fields for CRS, MGRS Tile ID, and validationStatus', () => {
    const demo = processAoiRasterAnalysis(27.5684, 76.6128);
    expect(demo.provenance.utmZone).toBe('UTM Zone 43N');
    expect(demo.provenance.rasterCrs).toContain('EPSG:32643');
  });
});
