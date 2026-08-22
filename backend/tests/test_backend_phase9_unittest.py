"""
Unittest Suite for SARaksha Backend Phase 9 (Health Observability, Monitoring Telemetry & Security)
"""

import unittest
from backend.services.monitoring_engine import MonitoringEngine
from backend.database.repositories import intervention_repo


class TestBackendPhase9(unittest.TestCase):
    def test_multi_intervention_scan_telemetry(self):
        engine = MonitoringEngine()
        all_monitored = intervention_repo.list_all(monitoring_only=True)

        res = engine.scan_all_monitored_interventions(all_monitored)
        self.assertEqual(res["status"], "COMPLETED")
        self.assertIn("totalInterventionsMonitored", res)
        self.assertIn("scenesDiscovered", res)
        self.assertIn("newMonitoringEventsGenerated", res)
        self.assertIn("duplicatesSkipped", res)
        self.assertIn("scanTimestamp", res)

    def test_idempotent_duplicate_prevention(self):
        engine = MonitoringEngine()
        all_monitored = intervention_repo.list_all(monitoring_only=True)

        # First scan
        res1 = engine.scan_all_monitored_interventions(all_monitored)
        # Second scan -> all discovered scenes should be skipped as duplicates
        res2 = engine.scan_all_monitored_interventions(all_monitored)

        self.assertEqual(res2["newMonitoringEventsGenerated"], 0)
        self.assertEqual(res2["duplicatesSkipped"], res2["totalInterventionsMonitored"])


if __name__ == "__main__":
    unittest.main()
