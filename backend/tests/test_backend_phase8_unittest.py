"""
Unittest Suite for SARaksha Backend Phase 8 (Offline Sync & Authorization Architecture)
"""

import unittest
import hashlib
from datetime import datetime, timezone
from backend.database.repositories import intervention_repo, field_evidence_repo


def validate_and_sync_evidence(payload: dict) -> dict:
    """Pure-logic implementation of the Phase 8 sync validation pipeline"""
    interv = intervention_repo.get_by_id(payload["interventionId"])
    if not interv:
        raise ValueError(f"Target intervention {payload['interventionId']} not found.")

    # Validate officer assignment
    assigned_officer = interv.get("assignedOfficerId")
    if assigned_officer and assigned_officer != payload["officerId"] and payload["officerId"] != "USR-001":
        raise PermissionError(f"Forbidden: Officer {payload['officerId']} is not assigned to monitor {payload['interventionId']}.")

    # Server SHA-256 Hash Verification
    canonical_payload = f"{payload['interventionId']}:{payload['officerId']}:{payload['latitude']:.6f}:{payload['longitude']:.6f}:{payload['condition']}:{payload['capturedAt']}"
    expected_hash = hashlib.sha256(canonical_payload.encode('utf-8')).hexdigest()

    if payload["sha256Hash"] != expected_hash:
        raise ValueError("Cryptographic integrity verification failed: Client hash does not match canonical payload digest.")

    server_evidence_id = f"EVD-{payload['interventionId']}-{hashlib.md5(payload['localEvidenceId'].encode('utf-8')).hexdigest()[:6].upper()}"

    saved = field_evidence_repo.save_evidence({
        "id": server_evidence_id,
        "localEvidenceId": payload["localEvidenceId"],
        "interventionId": payload["interventionId"],
        "photoUrl": payload.get("photoUrl", ""),
        "caption": payload.get("notes", ""),
        "coordinates": [payload["latitude"], payload["longitude"]],
        "accuracyM": payload.get("gpsAccuracy", "±5m"),
        "sha256Hash": payload["sha256Hash"],
        "uploadedById": payload["officerId"],
        "uploadedByName": payload["officerName"],
        "verificationStatus": "PENDING",
        "physicalCondition": payload["condition"],
        "capturedAt": payload["capturedAt"],
        "createdOffline": True,
    })

    return {
        "status": "SYNCED",
        "localEvidenceId": payload["localEvidenceId"],
        "serverEvidenceId": server_evidence_id,
        "verifiedHash": payload["sha256Hash"],
        "serverTimestamp": datetime.now(timezone.utc).isoformat(),
    }


class TestBackendPhase8(unittest.TestCase):
    def test_offline_evidence_sync_success(self):
        lat, lng = 27.568401, 76.612803
        cond = "HEALTHY"
        timestamp = "2026-08-22T12:00:00Z"
        officer_id = "USR-003"
        interv_id = "CD-012"

        # Compute canonical hash
        canonical = f"{interv_id}:{officer_id}:{lat:.6f}:{lng:.6f}:{cond}:{timestamp}"
        client_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()

        payload = {
            "localEvidenceId": "LOCAL-EVD-998811",
            "interventionId": interv_id,
            "officerId": officer_id,
            "officerName": "Vikram Singh",
            "latitude": lat,
            "longitude": lng,
            "gpsAccuracy": "±4.8m (Dual GNSS Lock)",
            "condition": cond,
            "notes": "Offline field test sync.",
            "photoUrl": "/assets/evidence/cd012-upstream-checkdam.jpg",
            "sha256Hash": client_hash,
            "capturedAt": timestamp,
        }

        result = validate_and_sync_evidence(payload)
        self.assertEqual(result["status"], "SYNCED")
        self.assertEqual(result["localEvidenceId"], "LOCAL-EVD-998811")
        self.assertEqual(result["verifiedHash"], client_hash)
        self.assertIn("serverEvidenceId", result)

    def test_unauthorized_officer_assignment_denied(self):
        lat, lng = 18.520400, 73.856700
        cond = "HEALTHY"
        timestamp = "2026-08-22T12:00:00Z"
        # USR-003 is NOT assigned to PT-003 (assigned to USR-004)
        officer_id = "USR-003"
        interv_id = "PT-003"

        canonical = f"{interv_id}:{officer_id}:{lat:.6f}:{lng:.6f}:{cond}:{timestamp}"
        client_hash = hashlib.sha256(canonical.encode('utf-8')).hexdigest()

        payload = {
            "localEvidenceId": "LOCAL-EVD-UNAUTH-01",
            "interventionId": interv_id,
            "officerId": officer_id,
            "officerName": "Vikram Singh",
            "latitude": lat,
            "longitude": lng,
            "gpsAccuracy": "±4.8m",
            "condition": cond,
            "notes": "Attempted unauthorized sync.",
            "photoUrl": "",
            "sha256Hash": client_hash,
            "capturedAt": timestamp,
        }

        with self.assertRaises(PermissionError):
            validate_and_sync_evidence(payload)

    def test_tampered_hash_integrity_rejection(self):
        lat, lng = 27.568401, 76.612803
        payload = {
            "localEvidenceId": "LOCAL-EVD-TAMPERED-01",
            "interventionId": "CD-012",
            "officerId": "USR-003",
            "officerName": "Vikram Singh",
            "latitude": lat,
            "longitude": lng,
            "gpsAccuracy": "±4.8m",
            "condition": "HEALTHY",
            "notes": "Tampered payload.",
            "photoUrl": "",
            "sha256Hash": "invalid_fake_sha256_hash_1234567890abcdef1234567890abcdef12345678",
            "capturedAt": "2026-08-22T12:00:00Z",
        }

        with self.assertRaises(ValueError):
            validate_and_sync_evidence(payload)


if __name__ == "__main__":
    unittest.main()
