"""
Unittest Suite for SARaksha Backend Phase 12 (Scientific Validation & Production Hardening)
"""

import unittest
from backend.services.raster_processor import (
    evaluate_data_quality_score,
    compute_spectral_statistics,
    analyze_intervention_raster,
    scale_reflectance_value,
    calculate_pixel_ndvi,
    calculate_pixel_ndwi,
    latlon_to_utm,
)


class TestBackendPhase12(unittest.TestCase):
    def test_data_quality_scoring_matrix(self):
        # Excellent: Low cloud, high pixel count
        q_exc = evaluate_data_quality_score(cloud_cover=2.4, valid_pixels=121, total_pixels=121)
        self.assertEqual(q_exc["score"], "EXCELLENT")
        self.assertEqual(q_exc["validPixelPercentage"], 100.0)

        # Good: Moderate cloud (10%), adequate pixels (105)
        q_good = evaluate_data_quality_score(cloud_cover=10.0, valid_pixels=105, total_pixels=121)
        self.assertEqual(q_good["score"], "GOOD")

        # Limited: High cloud or low pixel count
        q_lim = evaluate_data_quality_score(cloud_cover=18.0, valid_pixels=70, total_pixels=121)
        self.assertEqual(q_lim["score"], "LIMITED")

        # Invalid: Very low valid pixels (<50)
        q_inv = evaluate_data_quality_score(cloud_cover=45.0, valid_pixels=30, total_pixels=121)
        self.assertEqual(q_inv["score"], "INVALID")

    def test_scientific_provenance_structure_completeness(self):
        res = analyze_intervention_raster(
            latitude=27.5684,
            longitude=76.6128,
            intervention_id="CD-012",
            force_demo=True,
        )
        prov = res["provenance"]
        required_fields = [
            "interventionId",
            "latitude",
            "longitude",
            "boundingBox",
            "sceneId",
            "acquisitionTimestamp",
            "cloudCover",
            "satellite",
            "collection",
            "b03Asset",
            "b04Asset",
            "b08Asset",
            "utmZone",
            "rasterCrs",
            "pixelSize",
            "windowSize",
            "validPixelCount",
            "nodataPixelCount",
            "radiometricScale",
            "ndviMedian",
            "ndwiMedian",
            "processingVersion",
            "processingTimestamp",
        ]
        for field in required_fields:
            self.assertIn(field, prov, f"Missing required provenance field: {field}")

    def test_boundary_handling_and_zero_division(self):
        # Zero denominator in NDVI
        self.assertIsNone(calculate_pixel_ndvi(0.0, 0.0))
        # Negative / saturated values in reflectance
        self.assertIsNone(scale_reflectance_value(0))
        self.assertIsNone(scale_reflectance_value(-100))
        self.assertIsNone(scale_reflectance_value(20000))
        # Normal scaling
        self.assertEqual(scale_reflectance_value(5000), 0.5)

    def test_utm_coordinate_boundary_projections(self):
        zone, east, north = latlon_to_utm(27.5684, 76.6128)
        self.assertEqual(zone, 43)
        self.assertTrue(east > 0)
        self.assertTrue(north > 0)


if __name__ == "__main__":
    unittest.main()
