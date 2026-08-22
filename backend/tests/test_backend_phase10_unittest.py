"""
Unittest Suite for SARaksha Backend Phase 10 (End-to-End System & Evaluator Pipeline)
"""

import unittest
import hashlib
from datetime import datetime, timezone
from backend.services.raster_processor import analyze_intervention_raster
from backend.services.monitoring_engine import MonitoringEngine
from backend.services.alert_service import AlertService, ConsoleNotificationProvider
from backend.database.repositories import intervention_repo, field_evidence_repo


class TestBackendPhase10(unittest.TestCase):
    def test_complete_satellite_to_dossier_pipeline(self):
        # 1. Real Raster Processing
        lat, lng = 27.5684, 76.6128
        res = analyze_intervention_raster(
            latitude=lat,
            longitude=lng,
            current_date="2024-08-18",
            baseline_date="2024-03-15",
            window_size_pixels=11,
            force_demo=True,
        )

        self.assertEqual(res["aoi"]["windowPixels"], "11x11")
        self.assertEqual(res["currentObservation"]["ndvi"]["validPixels"], 121)
        self.assertAlmostEqual(res["currentObservation"]["ndvi"]["median"], 0.4206, places=2)

        # 2. Anomaly Evaluation & Monitoring
        engine = MonitoringEngine()
        event = engine.evaluate_observation(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            scene_id="S2A_32VNJ_P10_SCENE",
            observation_date="2024-08-18",
            baseline_ndvi=0.4900,
            current_ndvi=res["currentObservation"]["ndvi"]["median"],
            cloud_cover=2.4,
        )

        self.assertIsNotNone(event)
        self.assertEqual(event.anomalyLevel, "HIGH_PRIORITY")

        # 3. Alert Generation & Notification Dispatch
        alert_svc = AlertService(ConsoleNotificationProvider())
        alert = alert_svc.create_alert_from_anomaly(
            intervention_id="CD-012",
            intervention_name="Check Dam #12",
            watershed_id="WS-001",
            watershed_name="Alwar North Catchment",
            scene_id="S2A_32VNJ_P10_SCENE",
            acquisition_date="2024-08-18",
            percentage_change=event.percentageChange,
            current_ndvi=event.currentNdvi,
            baseline_ndvi=event.previousNdvi,
        )

        self.assertIsNotNone(alert)
        self.assertEqual(alert["notificationState"], "SENT")

        # 4. Field Evidence Sync & SHA-256 Digest Recalculation
        timestamp = "2026-08-22T12:00:00Z"
        canonical = f"CD-012:USR-003:{lat:.6f}:{lng:.6f}:HEALTHY:{timestamp}"
        server_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()

        saved = field_evidence_repo.save_evidence({
            "id": "EVD-CD012-P10-TEST",
            "interventionId": "CD-012",
            "photoUrl": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
            "caption": "Phase 10 E2E ground inspection.",
            "coordinates": [lat, lng],
            "accuracyM": "±4.8m",
            "sha256Hash": server_hash,
            "uploadedById": "USR-003",
            "uploadedByName": "Vikram Singh",
            "verificationStatus": "PENDING",
            "physicalCondition": "HEALTHY",
            "capturedAt": timestamp,
        })

        self.assertEqual(saved["verificationStatus"], "PENDING")
        self.assertEqual(saved["sha256Hash"], server_hash)

        # 5. Human Verification & Immutability Lock
        verified = field_evidence_repo.verify_evidence(
            evidence_id="EVD-CD012-P10-TEST",
            verifier_id="USR-001",
            verifier_name="Dr. Rajesh Sharma",
            finding_notes="Nodal approval signed.",
            physical_condition="HEALTHY",
        )

        self.assertEqual(verified["verificationStatus"], "VERIFIED")
        self.assertTrue(verified["isImmutable"])


if __name__ == "__main__":
    unittest.main()
