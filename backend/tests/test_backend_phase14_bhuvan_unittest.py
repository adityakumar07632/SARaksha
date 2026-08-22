"""
Unittest Suite for SARaksha Backend Phase 14 (Bhuvan ISRO LULC Real-Data Integration)
"""

import unittest
from unittest.mock import patch, MagicMock
import urllib.error
from backend.services.bhuvan_lulc_service import (
    validate_wkt_polygon,
    get_intervention_wkt,
    parse_bhuvan_raw_response,
    get_lulc_aoi_stats,
    generate_demo_bhuvan_lulc,
)


class TestBackendPhase14Bhuvan(unittest.TestCase):
    def test_wkt_polygon_validation(self):
        valid_wkt = "POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734, 76.6078 27.5634))"
        is_valid, err = validate_wkt_polygon(valid_wkt)
        self.assertTrue(is_valid)
        self.assertIsNone(err)

        unclosed_wkt = "POLYGON((76.6078 27.5634, 76.6178 27.5634, 76.6178 27.5734, 76.6078 27.5734))"
        is_valid, err = validate_wkt_polygon(unclosed_wkt)
        self.assertFalse(is_valid)
        self.assertIn("not closed", err)

        invalid_coords = "POLYGON((190.0 27.56, 76.6 27.56, 76.6 27.57, 190.0 27.57, 190.0 27.56))"
        is_valid, err = validate_wkt_polygon(invalid_coords)
        self.assertFalse(is_valid)
        self.assertIn("out of bounds", err)

    def test_get_intervention_wkt_for_cd012(self):
        wkt = get_intervention_wkt(27.5684, 76.6128, buffer_deg=0.005)
        self.assertTrue(wkt.startswith("POLYGON(("))
        self.assertTrue(wkt.endswith("))"))
        is_valid, _ = validate_wkt_polygon(wkt)
        self.assertTrue(is_valid)

    def test_parse_bhuvan_raw_response(self):
        raw_payload = [
            {"State": "RJ", "'l01'": 0.74, "'l02'": 1.63, "'l04'": 203.17}
        ]
        records, state, total_area = parse_bhuvan_raw_response(raw_payload)
        self.assertEqual(state, "RJ")
        self.assertEqual(len(records), 3)
        self.assertEqual(records[0]["code"], "l01")
        self.assertEqual(records[0]["area"], 0.74)
        self.assertEqual(records[1]["code"], "l02")
        self.assertEqual(records[2]["code"], "l04")
        self.assertEqual(total_area, 205.54)

    def test_missing_token_returns_unavailable_state(self):
        with patch.dict("os.environ", {"BHUVAN_LULC_API_TOKEN": ""}, clear=True):
            wkt = get_intervention_wkt(27.5684, 76.6128)
            res = get_lulc_aoi_stats(polygon_wkt=wkt, force_demo=False, intervention_id="CD-012")
            self.assertEqual(res["sourceType"], "BHUVAN_DATA_UNAVAILABLE")
            self.assertEqual(res["status"], "BHUVAN_DATA_UNAVAILABLE")
            self.assertIn("token not configured", res["reason"])
            # Verify token is NEVER in response
            self.assertNotIn("token", json_keys(res))

    def test_demo_fixture_handling(self):
        res = get_lulc_aoi_stats(
            polygon_wkt="POLYGON((76.6 27.5, 76.7 27.5, 76.7 27.6, 76.6 27.6, 76.6 27.5))",
            force_demo=True,
            intervention_id="CD-012",
        )
        self.assertEqual(res["sourceType"], "SIMULATED")
        self.assertEqual(res["status"], "SIMULATED")
        self.assertEqual(len(res["statistics"]), 3)
        self.assertAlmostEqual(res["totalArea"], 205.54)

    @patch("urllib.request.urlopen")
    def test_live_bhuvan_api_success_mock(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.getcode.return_value = 200
        mock_response.read.return_value = b'[{"State": "RJ", "\'l01\'": 0.74, "\'l02\'": 1.63, "\'l04\'": 203.17}]'
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        with patch.dict("os.environ", {"BHUVAN_LULC_API_TOKEN": "mock_secret_token_12345"}):
            wkt = get_intervention_wkt(27.5684, 76.6128)
            res = get_lulc_aoi_stats(polygon_wkt=wkt, force_demo=False, intervention_id="CD-012")
            self.assertEqual(res["sourceType"], "REAL_BHUVAN_LULC")
            self.assertEqual(res["status"], "REAL")
            self.assertEqual(res["state"], "RJ")
            self.assertEqual(len(res["statistics"]), 3)
            # Guarantee token is not leaked
            self.assertNotIn("mock_secret_token_12345", str(res))


def json_keys(obj):
    keys = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            keys.append(k)
            keys.extend(json_keys(v))
    elif isinstance(obj, list):
        for item in obj:
            keys.extend(json_keys(item))
    return keys


if __name__ == "__main__":
    unittest.main()
