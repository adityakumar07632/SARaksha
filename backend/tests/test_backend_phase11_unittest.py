"""
Unittest Suite for SARaksha Backend Phase 11 (Real Sentinel-2 Raster Ingestion & Scientific Integrity)
"""

import unittest
from backend.services.raster_processor import (
    latlon_to_utm,
    compute_spectral_statistics,
    analyze_intervention_raster,
    SENTINEL2_REFLECTANCE_SCALE,
)


class TestBackendPhase11(unittest.TestCase):
    def test_latlon_to_utm_conversion(self):
        # CD-012 at Alwar, Rajasthan (Zone 43N)
        zone, east, north = latlon_to_utm(27.5684, 76.6128)
        self.assertEqual(zone, 43)
        self.assertAlmostEqual(east, 659213.99, delta=10.0)
        self.assertAlmostEqual(north, 3050430.57, delta=10.0)

    def test_spectral_statistics_computation(self):
        # Array of 5 valid values
        pixels = [0.10, 0.20, 0.30, 0.40, 0.50]
        stats = compute_spectral_statistics(pixels)
        self.assertEqual(stats["validPixels"], 5)
        self.assertEqual(stats["validPixelPercentage"], 100.0)
        self.assertAlmostEqual(stats["median"], 0.30, places=2)
        self.assertAlmostEqual(stats["mean"], 0.30, places=2)
        self.assertAlmostEqual(stats["min"], 0.10, places=2)
        self.assertAlmostEqual(stats["max"], 0.50, places=2)

    def test_spectral_statistics_insufficient_pixels(self):
        pixels = [None, None, None]
        stats = compute_spectral_statistics(pixels)
        self.assertEqual(stats["validPixels"], 0)
        self.assertEqual(stats["status"], "INSUFFICIENT_VALID_PIXELS")

    def test_reflectance_scaling(self):
        raw_dn = 2480
        scaled = raw_dn / SENTINEL2_REFLECTANCE_SCALE
        self.assertAlmostEqual(scaled, 0.2480, places=4)

    def test_deterministic_demo_fixture_structure(self):
        res = analyze_intervention_raster(
            latitude=27.5684,
            longitude=76.6128,
            intervention_id="CD-012",
            force_demo=True,
        )
        self.assertEqual(res["sourceType"], "SIMULATED")
        self.assertEqual(res["label"], "DEMO DATA")
        self.assertEqual(res["statistics"]["validPixels"], 121)
        self.assertEqual(res["statistics"]["validPixelPercentage"], 100.0)


if __name__ == "__main__":
    unittest.main()
