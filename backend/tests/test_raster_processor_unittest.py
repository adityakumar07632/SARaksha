"""
Standard Library Unittest Suite for SARaksha Backend Raster Processing
"""

import unittest
from backend.services.raster_processor import (
    scale_reflectance_value,
    calculate_pixel_ndvi,
    calculate_pixel_ndwi,
    compute_spectral_statistics,
    analyze_intervention_raster,
)
from backend.services.monitoring_engine import MonitoringEngine


class TestRasterProcessorUnittest(unittest.TestCase):
    def test_reflectance_scaling(self):
        self.assertIsNone(scale_reflectance_value(0))
        self.assertEqual(scale_reflectance_value(1000), 0.1)
        self.assertEqual(scale_reflectance_value(5000), 0.5)
        self.assertEqual(scale_reflectance_value(10000), 1.0)
        self.assertIsNone(scale_reflectance_value(-50))

    def test_pixel_ndvi_calculation(self):
        # (0.6 - 0.2) / (0.6 + 0.2) = 0.4 / 0.8 = 0.5
        self.assertEqual(calculate_pixel_ndvi(0.6, 0.2), 0.5)
        # (0.1 - 0.3) / (0.1 + 0.3) = -0.2 / 0.4 = -0.5
        self.assertEqual(calculate_pixel_ndvi(0.1, 0.3), -0.5)
        # Zero denominator
        self.assertIsNone(calculate_pixel_ndvi(0.0, 0.0))
        # None input
        self.assertIsNone(calculate_pixel_ndvi(None, 0.2))

    def test_pixel_ndwi_calculation(self):
        # (0.4 - 0.2) / (0.4 + 0.2) = 0.2 / 0.6 = 0.3333
        self.assertEqual(calculate_pixel_ndwi(0.4, 0.2), 0.3333)
        # (0.2 - 0.4) / (0.2 + 0.4) = -0.2 / 0.6 = -0.3333
        self.assertEqual(calculate_pixel_ndwi(0.2, 0.4), -0.3333)

    def test_spectral_statistics_robust_median(self):
        pixel_vals = [0.40, 0.41, 0.42, 0.43, 0.95, None]
        stats = compute_spectral_statistics(pixel_vals)
        self.assertEqual(stats["validPixels"], 5)
        self.assertEqual(stats["invalidPixels"], 1)
        self.assertEqual(stats["median"], 0.42)
        self.assertEqual(stats["validPixelPercentage"], 83.3)

    def test_end_to_end_cd012_raster_analysis(self):
        result = analyze_intervention_raster(
            latitude=27.5684,
            longitude=76.6128,
            window_size_pixels=11,
            force_demo=True,
        )
        self.assertEqual(result["aoi"]["windowPixels"], "11x11")
        self.assertEqual(result["currentObservation"]["ndvi"]["validPixels"], 121)
        self.assertEqual(result["sourceType"], "SIMULATED")
        self.assertEqual(result["label"], "DEMO DATA")

    def test_monitoring_engine(self):
        engine = MonitoringEngine()
        event1 = engine.evaluate_observation(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            scene_id="S2A_NEW_SCENE_001",
            observation_date="2024-09-01",
            baseline_ndvi=0.49,
            current_ndvi=0.42,
        )
        self.assertIsNotNone(event1)
        self.assertEqual(event1.anomalyLevel, "HIGH_PRIORITY")
        event2 = engine.evaluate_observation(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            scene_id="S2A_NEW_SCENE_001",
            observation_date="2024-09-01",
            baseline_ndvi=0.49,
            current_ndvi=0.42,
        )
        self.assertIsNone(event2)


if __name__ == "__main__":
    unittest.main()
