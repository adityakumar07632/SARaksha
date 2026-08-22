"""
Unittest Suite for SARaksha Backend Phase 7 (Multi-Intervention & PostGIS Data Layer)
"""

import unittest
from backend.database.repositories import intervention_repo, satellite_repo, field_evidence_repo
from backend.services.monitoring_engine import MonitoringEngine
from backend.services.alert_service import AlertService


class TestBackendPhase7(unittest.TestCase):
    def test_multi_intervention_registry(self):
        all_interventions = intervention_repo.list_all()
        self.assertGreaterEqual(len(all_interventions), 4)

        cd012 = intervention_repo.get_by_id("CD-012")
        pt003 = intervention_repo.get_by_id("PT-003")

        self.assertIsNotNone(cd012)
        self.assertIsNotNone(pt003)
        self.assertEqual(cd012["state"], "Rajasthan")
        self.assertEqual(pt003["state"], "Maharashtra")
        self.assertEqual(cd012["baselineNdvi"], 0.4900)
        self.assertEqual(pt003["baselineNdvi"], 0.5200)

    def test_officer_assignment_filtering(self):
        vikram_assets = intervention_repo.list_by_assigned_officer("USR-003")
        self.assertGreaterEqual(len(vikram_assets), 2)
        for a in vikram_assets:
            self.assertEqual(a["assignedOfficerId"], "USR-003")

    def test_idempotent_multi_intervention_scan(self):
        engine = MonitoringEngine()
        all_monitored = intervention_repo.list_all(monitoring_only=True)

        # First Scan
        res1 = engine.scan_all_monitored_interventions(all_monitored)
        self.assertEqual(res1["status"], "COMPLETED")
        self.assertGreaterEqual(res1["totalInterventionsMonitored"], 4)

        # Second Scan (Identical parameters) -> 0 new events
        res2 = engine.scan_all_monitored_interventions(all_monitored)
        self.assertEqual(res2["status"], "COMPLETED")
        self.assertEqual(res2["newMonitoringEventsGenerated"], 0)

    def test_alert_escalation_and_filtering(self):
        alert_svc = AlertService()
        alert = alert_svc.create_alert_from_anomaly(
            intervention_id="PT-003",
            intervention_name="Percolation Tank #3",
            watershed_id="WS-002",
            watershed_name="Pune South Catchment",
            scene_id="S2A_PT003_TEST_SCENE",
            acquisition_date="2024-08-18",
            percentage_change=-15.4,
            current_ndvi=0.4400,
            baseline_ndvi=0.5200,
            state="Maharashtra",
            district="Pune",
        )
        self.assertIsNotNone(alert)

        # Escalate alert
        escalated = alert_svc.escalate_alert(alert["id"], "Dr. Rajesh Sharma (Super Admin)")
        self.assertTrue(escalated["isEscalated"])
        self.assertEqual(escalated["escalationLevel"], 1)

        # Multi-state filter
        mh_alerts = alert_svc.get_alerts(state="Maharashtra")
        self.assertTrue(any(a["interventionId"] == "PT-003" for a in mh_alerts))

    def test_evidence_verification_and_rejection(self):
        # Verification
        verified = field_evidence_repo.verify_evidence(
            evidence_id="EVD-101",
            verifier_id="USR-001",
            verifier_name="Dr. Rajesh Sharma",
            finding_notes="Masonry intact.",
            physical_condition="HEALTHY",
        )
        self.assertEqual(verified["verificationStatus"], "VERIFIED")
        self.assertTrue(verified["isImmutable"])

        # Rejection
        rejected = field_evidence_repo.reject_evidence(
            evidence_id="EVD-101",
            verifier_id="USR-001",
            verifier_name="Dr. Rajesh Sharma",
            rejection_reason="GPS deviation exceeds tolerance.",
        )
        self.assertEqual(rejected["verificationStatus"], "VERIFICATION_REJECTED")


if __name__ == "__main__":
    unittest.main()
