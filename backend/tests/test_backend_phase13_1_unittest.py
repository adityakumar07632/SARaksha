"""
Unittest Suite for SARaksha Backend Phase 13.1 (Geographic Integrity & Multi-Scene Validation)
"""

import unittest
from unittest.mock import patch
from backend.services.raster_processor import (
    validate_scene_geographic_containment,
    query_multi_scene_observations,
    extract_mgrs_tile_id,
    latlon_to_utm,
)


class TestBackendPhase13_1(unittest.TestCase):
    def test_valid_alwar_scene_geographic_validation(self):
        valid_scene = {
            "id": "S2C_43RFL_20241219_2_L2A",
            "bbox": [76.5, 27.4, 76.8, 27.7],
            "properties": {"eo:cloud_cover": 0.01},
        }
        is_valid, geo_meta = validate_scene_geographic_containment(valid_scene, 27.5684, 76.6128)
        self.assertTrue(is_valid)
        self.assertEqual(geo_meta["validationStatus"], "GEOGRAPHICALLY_VALIDATED")
        self.assertEqual(geo_meta["tileId"], "43RFL")
        self.assertTrue(geo_meta["geometryValidated"])
        self.assertTrue(geo_meta["aoiIntersects"])
        self.assertTrue(geo_meta["targetCoordinateInsideRaster"])
        self.assertIn("EPSG:32643", geo_meta["rasterCrs"])
        self.assertIn("UTM Zone 43N", geo_meta["utmZone"])
        self.assertIsNone(geo_meta["rejectionReason"])

    def test_non_intersecting_bbox_rejected(self):
        # Scene in southern India (Karnataka: 12.97, 77.59) tested against Alwar (27.5684, 76.6128)
        karnataka_scene = {
            "id": "S2B_43PGN_20241219_0_L2A",
            "bbox": [77.4, 12.8, 77.7, 13.1],
            "properties": {"eo:cloud_cover": 1.2},
        }
        is_valid, geo_meta = validate_scene_geographic_containment(karnataka_scene, 27.5684, 76.6128)
        self.assertFalse(is_valid)
        self.assertEqual(geo_meta["validationStatus"], "REJECTED")
        self.assertFalse(geo_meta["aoiIntersects"])
        self.assertIn("falls outside STAC bounding box", geo_meta["rejectionReason"])

    def test_wrong_utm_zone_rejected(self):
        # Scene in Europe (UTM Zone 32) tested against Alwar (UTM Zone 43N)
        europe_scene = {
            "id": "S2A_32VNJ_20240818_0_L2A",
            "bbox": [76.5, 27.4, 76.8, 27.7],
            "properties": {"eo:cloud_cover": 2.4},
        }
        is_valid, geo_meta = validate_scene_geographic_containment(europe_scene, 27.5684, 76.6128)
        self.assertFalse(is_valid)
        self.assertEqual(geo_meta["validationStatus"], "REJECTED")
        self.assertIn("Tile UTM zone mismatch", geo_meta["rejectionReason"])

    def test_mgrs_tile_extraction(self):
        self.assertEqual(extract_mgrs_tile_id("S2C_43RFL_20241219_2_L2A"), "43RFL")
        self.assertEqual(extract_mgrs_tile_id("S2A_32VNJ_20240818_0_L2A"), "32VNJ")
        self.assertEqual(extract_mgrs_tile_id("S2B_44QLG_20241105_0_L2A"), "44QLG")

    @patch("backend.services.raster_processor.query_stac_sentinel2_scenes_multiple")
    def test_insufficient_scenes_returns_configured_reference(self, mock_stac):
        mock_stac.return_value = []
        res = query_multi_scene_observations(
            latitude=27.5684,
            longitude=76.6128,
            intervention_id="CD-012",
            force_demo=False,
        )
        self.assertIn("CONFIGURED REFERENCE", res["baseline"]["sourceClassification"])
        self.assertEqual(res["baseline"]["sourceType"], "CONFIGURED_REFERENCE")


if __name__ == "__main__":
    unittest.main()
