import { describe, it, expect, vi, beforeEach } from 'vitest';
import { STACClient } from './stacClient';
import { STACItem } from './types';
import { RealSatelliteProvider } from './satelliteProvider';

describe('STAC Client & Scene Selection Engine', () => {
  let client: STACClient;

  beforeEach(() => {
    client = new STACClient('https://earth-search.aws.element84.com/v1', 'sentinel-2-l2a');
  });

  // Mock STAC Items
  const mockItemLowCloud: STACItem = {
    id: 'S2A_32VNJ_20240818_0_L2A',
    type: 'Feature',
    collection: 'sentinel-2-l2a',
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
    bbox: [76.58, 27.54, 76.64, 27.59],
    properties: {
      datetime: '2024-08-18T05:36:41Z',
      'eo:cloud_cover': 2.4,
      platform: 'Sentinel-2A',
    },
    assets: {
      red: { href: 'https://sentinel-cogs.s3.amazonaws.com/B04.tif', title: 'Band 4 (Red)' },
      nir: { href: 'https://sentinel-cogs.s3.amazonaws.com/B08.tif', title: 'Band 8 (NIR)' },
      green: { href: 'https://sentinel-cogs.s3.amazonaws.com/B03.tif', title: 'Band 3 (Green)' },
      visual: { href: 'https://sentinel-cogs.s3.amazonaws.com/TCI.tif', title: 'True Color Image' },
    },
  };

  const mockItemHighCloud: STACItem = {
    id: 'S2B_32VNJ_20240823_0_L2A',
    type: 'Feature',
    collection: 'sentinel-2-l2a',
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
    bbox: [76.58, 27.54, 76.64, 27.59],
    properties: {
      datetime: '2024-08-23T05:36:41Z',
      'eo:cloud_cover': 45.8,
      platform: 'Sentinel-2B',
    },
    assets: {
      red: { href: 'https://sentinel-cogs.s3.amazonaws.com/B04.tif' },
      nir: { href: 'https://sentinel-cogs.s3.amazonaws.com/B08.tif' },
      green: { href: 'https://sentinel-cogs.s3.amazonaws.com/B03.tif' },
    },
  };

  const mockItemMissingBands: STACItem = {
    id: 'S2A_32VNJ_20240810_0_L2A',
    type: 'Feature',
    collection: 'sentinel-2-l2a',
    geometry: {
      type: 'Point',
      coordinates: [76.61, 27.56],
    },
    bbox: [76.58, 27.54, 76.64, 27.59],
    properties: {
      datetime: '2024-08-10T05:36:41Z',
      'eo:cloud_cover': 0.5,
      platform: 'Sentinel-2A',
    },
    assets: {
      thumbnail: { href: 'https://sentinel-cogs.s3.amazonaws.com/thumb.jpg' },
    },
  };

  // 1. Bounding Box & Query Building
  describe('Bounding Box & Search Payload Construction', () => {
    it('computes valid GeoJSON order bounding box [minLng, minLat, maxLng, maxLat]', () => {
      // Check Dam #12 coordinates: Lat 27.5684, Lng 76.6128
      const bbox = client.computeBoundingBox([27.5684, 76.6128], 0.01);
      expect(bbox[0]).toBe(76.6028); // minLng
      expect(bbox[1]).toBe(27.5584); // minLat
      expect(bbox[2]).toBe(76.6228); // maxLng
      expect(bbox[3]).toBe(27.5784); // maxLat
    });

    it('constructs well-formed STAC search payload with cloud query and ISO datetime', () => {
      const payload = client.buildSearchPayload({
        coordinates: [27.5684, 76.6128],
        startDate: '2024-01-01',
        endDate: '2024-05-31',
        maxCloudCover: 15,
        collection: 'sentinel-2-l2a',
      });

      expect(payload.collections).toEqual(['sentinel-2-l2a']);
      expect(payload.datetime).toBe('2024-01-01T00:00:00Z/2024-05-31T23:59:59Z');
      expect(payload.bbox).toHaveLength(4);
      expect(payload.query?.['eo:cloud_cover']?.lte).toBe(15);
    });
  });

  // 2. STAC Response Validation
  describe('STAC Response Validation', () => {
    it('filters out malformed or empty items from FeatureCollection', () => {
      const rawResponse = {
        type: 'FeatureCollection',
        features: [
          mockItemLowCloud,
          { id: 'invalid_no_geometry' },
          null,
          mockItemHighCloud,
        ],
      };

      const validItems = client.validateAndFilterItems(rawResponse);
      expect(validItems).toHaveLength(2);
      expect(validItems[0].id).toBe('S2A_32VNJ_20240818_0_L2A');
    });

    it('returns empty array when response is null or invalid', () => {
      expect(client.validateAndFilterItems(null)).toEqual([]);
      expect(client.validateAndFilterItems({ type: 'Invalid' })).toEqual([]);
    });
  });

  // 3. Deterministic Scene Selection
  describe('Deterministic Scene Selection', () => {
    it('selects scene with lowest cloud cover under threshold having required bands', () => {
      const items = [mockItemHighCloud, mockItemLowCloud];
      const best = client.selectBestScene(items, 20);

      expect(best).not.toBeNull();
      expect(best?.id).toBe('S2A_32VNJ_20240818_0_L2A');
      expect(client.extractCloudCover(best!)).toBe(2.4);
    });

    it('rejects scenes that lack required spectral bands even if cloud cover is low', () => {
      const items = [mockItemMissingBands, mockItemHighCloud];
      const best = client.selectBestScene(items, 50);

      expect(best).not.toBeNull();
      expect(best?.id).toBe('S2B_32VNJ_20240823_0_L2A');
    });

    it('returns null when no items are supplied', () => {
      expect(client.selectBestScene([])).toBeNull();
    });
  });

  // 4. Band Asset Extraction
  describe('Band Asset Extraction', () => {
    it('extracts red, nir, green, and visual asset URLs accurately', () => {
      const assets = client.extractBandAssets(mockItemLowCloud);
      expect(assets.red).toContain('B04.tif');
      expect(assets.nir).toContain('B08.tif');
      expect(assets.green).toContain('B03.tif');
      expect(assets.visual).toContain('TCI.tif');
    });
  });

  // 5. Orbital Observation Parsing & Provenance Integrity
  describe('Orbital Observation Parsing & Provenance', () => {
    it('parses STAC Item into OrbitalSceneObservation with full provenance', () => {
      const observation = client.parseOrbitalObservation(mockItemLowCloud, [27.5684, 76.6128]);

      expect(observation.sceneId).toBe('S2A_32VNJ_20240818_0_L2A');
      expect(observation.platform).toBe('Sentinel-2A');
      expect(observation.cloudCoverPercent).toBe(2.4);
      expect(observation.calculatedNdvi).toBeGreaterThanOrEqual(-1.0);
      expect(observation.calculatedNdvi).toBeLessThanOrEqual(1.0);
      expect(observation.calculatedNdwi).toBeDefined();

      // Check Provenance
      expect(observation.provenance.sourceType).toBe('SATELLITE_SENTINEL2');
      expect(observation.provenance.isSimulated).toBe(false);
      expect(observation.provenance.provider).toContain('STAC');
      expect(observation.provenance.bandsUsed).toEqual(
        expect.arrayContaining(['B04 (Red 665nm)', 'B08 (NIR 842nm)'])
      );
    });
  });

  // 6. Real Satellite Provider State Handling
  describe('RealSatelliteProvider State Machine', () => {
    it('returns REAL state when STAC scenes are successfully returned', async () => {
      const mockClient = {
        searchScenes: vi.fn().mockResolvedValue([mockItemLowCloud]),
        selectBestScene: vi.fn().mockReturnValue(mockItemLowCloud),
        parseOrbitalObservation: vi.fn().mockReturnValue(
          client.parseOrbitalObservation(mockItemLowCloud, [27.5684, 76.6128])
        ),
      } as any;

      const provider = new RealSatelliteProvider(mockClient);
      const result = await provider.getRealSpectralAnalysis('CD-012', [27.5684, 76.6128]);

      expect(result.state).toBe('REAL');
      expect(result.isSimulated).toBe(false);
      expect(result.currentScene?.sceneId).toBe('S2A_32VNJ_20240818_0_L2A');
      expect(result.anomalyResult).toBeDefined();
    });

    it('returns UNAVAILABLE state when no scenes meet cloud criteria', async () => {
      const mockClient = {
        searchScenes: vi.fn().mockResolvedValue([]),
        selectBestScene: vi.fn().mockReturnValue(null),
      } as any;

      const provider = new RealSatelliteProvider(mockClient);
      const result = await provider.getRealSpectralAnalysis('CD-012', [27.5684, 76.6128]);

      expect(result.state).toBe('UNAVAILABLE');
      expect(result.currentScene).toBeNull();
      expect(result.statusMessage).toContain('No suitable Sentinel-2 scenes');
    });

    it('returns ERROR state when STAC network request fails', async () => {
      const mockClient = {
        searchScenes: vi.fn().mockRejectedValue(new Error('Network connection timeout')),
      } as any;

      const provider = new RealSatelliteProvider(mockClient);
      const result = await provider.getRealSpectralAnalysis('CD-012', [27.5684, 76.6128]);

      expect(result.state).toBe('ERROR');
      expect(result.currentScene).toBeNull();
      expect(result.statusMessage).toContain('Network connection timeout');
    });
  });
});
