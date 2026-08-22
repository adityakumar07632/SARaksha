"""
Unittest Suite for SARaksha Backend Phase 6 Services
"""

import unittest
from backend.services.alert_service import AlertService, ConsoleNotificationProvider
from backend.services.monitoring_engine import MonitoringEngine


class TestBackendPhase6(unittest.TestCase):
    def test_alert_service_anomaly_dispatch(self):
        alert_svc = AlertService(ConsoleNotificationProvider())
        alert = alert_svc.create_alert_from_anomaly(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            watershed_id="WS-001",
            watershed_name="Alwar North Catchment",
            scene_id="S2A_TEST_ANOMALY_SCENE",
            acquisition_date="2024-08-18",
            percentage_change=-14.4,
            current_ndvi=0.4206,
            baseline_ndvi=0.4912,
        )

        self.assertIsNotNone(alert)
        self.assertEqual(alert["severity"], "HIGH")
        self.assertEqual(alert["interventionId"], "CD-012")
        self.assertIn("14.4%", alert["title"])

    def test_alert_service_stable_threshold_ignores(self):
        alert_svc = AlertService()
        alert = alert_svc.create_alert_from_anomaly(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            watershed_id="WS-001",
            watershed_name="Alwar North Catchment",
            scene_id="S2A_STABLE_SCENE",
            acquisition_date="2024-08-18",
            percentage_change=-2.1,  # Under -5% threshold
            current_ndvi=0.48,
            baseline_ndvi=0.49,
        )
        self.assertIsNone(alert)


if __name__ == "__main__":
    unittest.main()
