"""
Unit Tests for SARaksha Python Raster Processing Engine & Monitoring
"""

import pytest
import numpy as np
from backend.services.raster_processor import (
    scale_reflectance_array,
    calculate_pixel_ndvi,
    calculate_pixel_ndwi,
    compute_spectral_statistics,
    analyze_intervention_raster,
    SENTINEL2_REFLECTANCE_SCALE,
)
from backend.services.monitoring_engine import MonitoringEngine


class TestRasterProcessor:
    def test_reflectance_scaling(self):
        """Validates scaling of raw 16-bit integer DN to BOA reflectance [0.0 - 1.0]."""
        raw_dn = np.array([0, 1000, 5000, 10000, -50], dtype=np.int32)
        scaled = scale_reflectance_array(raw_dn)

        assert np.isnan(scaled[0])  # nodata (0) masked to NaN
        assert scaled[1] == 0.1
        assert scaled[2] == 0.5
        assert scaled[3] == 1.0
        assert np.isnan(scaled[4])  # negative masked to NaN

    def test_pixel_ndvi_calculation(self):
        """Tests pixel-wise NDVI calculation with valid scientific range [-1.0, 1.0]."""
        nir = np.array([0.6, 0.1, 0.0, np.nan])
        red = np.array([0.2, 0.3, 0.0, 0.2])

        ndvi = calculate_pixel_ndvi(nir, red)

        # (0.6 - 0.2) / (0.6 + 0.2) = 0.4 / 0.8 = 0.5
        assert round(ndvi[0], 4) == 0.5
        # (0.1 - 0.3) / (0.1 + 0.3) = -0.2 / 0.4 = -0.5
        assert round(ndvi[1], 4) == -0.5
        # Zero denominator -> NaN
        assert np.isnan(ndvi[2])
        # NaN input -> NaN
        assert np.isnan(ndvi[3])

    def test_pixel_ndwi_calculation(self):
        """Tests McFeeters pixel-wise NDWI calculation (Green - NIR) / (Green + NIR)."""
        green = np.array([0.4, 0.2])
        nir = np.array([0.2, 0.4])

        ndwi = calculate_pixel_ndwi(green, nir)

        # (0.4 - 0.2) / (0.4 + 0.2) = 0.2 / 0.6 = 0.3333
        assert round(ndwi[0], 4) == 0.3333
        # (0.2 - 0.4) / (0.2 + 0.4) = -0.2 / 0.6 = -0.3333
        assert round(ndwi[1], 4) == -0.3333

    def test_spectral_statistics_robust_median(self):
        """Validates that statistics output accurate count and robust median resisting outliers."""
        # Raster array with an extreme outlier (e.g. shadow or cloud edge: 0.95)
        arr = np.array([0.40, 0.41, 0.42, 0.43, 0.95, np.nan])
        stats = compute_spectral_statistics(arr)

        assert stats["validPixels"] == 5
        assert stats["invalidPixels"] == 1
        assert stats["totalPixels"] == 6
        assert stats["median"] == 0.42  # Robust median
        assert stats["min"] == 0.40
        assert stats["max"] == 0.95
        assert stats["validPixelPercentage"] == 83.3

    def test_end_to_end_cd012_raster_analysis(self):
        """Tests complete AOI raster analysis for Check Dam #12 [27.5684, 76.6128]."""
        result = analyze_intervention_raster(
            latitude=27.5684,
            longitude=76.6128,
            window_size_pixels=11,
        )

        assert result["aoi"]["windowPixels"] == "11x11"
        assert result["aoi"]["spatialResolution"] == "10m per pixel"
        assert result["currentObservation"]["ndvi"]["validPixels"] == 121
        assert result["currentObservation"]["ndvi"]["validPixelPercentage"] == 100.0
        assert result["provenance"]["sourceType"] == "REAL_ORBITAL_RASTER"
        assert result["provenance"]["scaleFactor"] == 10000.0


class TestMonitoringEngine:
    def test_anomaly_evaluation_and_deduplication(self):
        """Tests monitoring engine triage and duplicate event suppression."""
        engine = MonitoringEngine()

        # Trigger high priority anomaly
        event1 = engine.evaluate_observation(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            scene_id="S2A_NEW_SCENE_001",
            observation_date="2024-09-01",
            baseline_ndvi=0.49,
            current_ndvi=0.42,
        )

        assert event1 is not None
        assert event1.anomalyLevel == "HIGH_PRIORITY"
        assert event1.status == "REVIEW_REQUIRED"
        assert event1.percentageChange == -14.3

        # Re-evaluating same scene ID should return None (deduplicated)
        event2 = engine.evaluate_observation(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            scene_id="S2A_NEW_SCENE_001",
            observation_date="2024-09-01",
            baseline_ndvi=0.49,
            current_ndvi=0.42,
        )
        assert event2 is None
