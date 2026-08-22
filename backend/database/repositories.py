"""
SARaksha Repository Abstraction & Data Layer
Provides robust spatial entity repositories for multi-intervention monitoring,
idempotent satellite observations, evidence versioning, and immutable audit logging.
"""

from typing import List, Optional, Dict, Any
from abc import ABC, abstractmethod
from datetime import datetime, timezone
import hashlib

class IInterventionRepository(ABC):
    @abstractmethod
    def get_by_id(self, intervention_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_all(self, monitoring_only: bool = False) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_by_watershed(self, watershed_id: str) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_by_assigned_officer(self, officer_id: str) -> List[Dict[str, Any]]:
        pass


class ISatelliteObservationRepository(ABC):
    @abstractmethod
    def save_observation(self, observation: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Saves observation idempotently. Returns None if already exists."""
        pass

    @abstractmethod
    def get_latest_by_intervention(self, intervention_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_by_intervention(self, intervention_id: str) -> List[Dict[str, Any]]:
        pass


class IFieldEvidenceRepository(ABC):
    @abstractmethod
    def save_evidence(self, evidence: Dict[str, Any]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def verify_evidence(self, evidence_id: str, verifier_id: str, verifier_name: str, finding_notes: str, physical_condition: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def reject_evidence(self, evidence_id: str, verifier_id: str, verifier_name: str, rejection_reason: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_by_intervention(self, intervention_id: str) -> List[Dict[str, Any]]:
        pass


class IMonitoringEventRepository(ABC):
    @abstractmethod
    def save_event(self, event: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def list_events(self, intervention_id: Optional[str] = None) -> List[Dict[str, Any]]:
        pass


# ==========================================================
# IN-MEMORY REPOSITORY IMPLEMENTATIONS
# ==========================================================

class MockInterventionRepository(IInterventionRepository):
    def __init__(self):
        self._interventions: Dict[str, Dict[str, Any]] = {
            "CD-012": {
                "id": "CD-012",
                "code": "CD-012",
                "name": "Check Dam #12",
                "watershedId": "WS-001",
                "watershedName": "Alwar North Catchment",
                "state": "Rajasthan",
                "district": "Alwar",
                "type": "Masonry Check Dam",
                "lifecycleStage": "Monitoring",
                "coordinates": [27.5684, 76.6128],
                "constructionDate": "12 Jun 2025",
                "implementingAgency": "Rajasthan Watershed & Soil Conservation Dept",
                "budgetAllocatedLakhs": 14.5,
                "capacityM3": 12500,
                "healthScore": 82,
                "isFieldVerified": True,
                "assignedOfficerId": "USR-003",
                "assignedOfficerName": "Vikram Singh (Field Officer)",
                "monitoringEnabled": True,
                "cloudThreshold": 20.0,
                "anomalyThreshold": -10.0,
                "baselineNdvi": 0.4900,
                "baselineNdwi": 0.1800,
                "baselinePeriod": {"start": "2024-01-01", "end": "2024-05-31"},
                "monitoringFrequencyDays": 5,
            },
            "CD-014": {
                "id": "CD-014",
                "code": "CD-014",
                "name": "Check Dam #14 (Stream Reach B)",
                "watershedId": "WS-001",
                "watershedName": "Alwar North Catchment",
                "state": "Rajasthan",
                "district": "Alwar",
                "type": "Loose Boulder Check Dam",
                "lifecycleStage": "Monitoring",
                "coordinates": [27.5812, 76.6245],
                "constructionDate": "20 Sep 2025",
                "implementingAgency": "Rajasthan Watershed & Soil Conservation Dept",
                "budgetAllocatedLakhs": 8.2,
                "capacityM3": 6200,
                "healthScore": 88,
                "isFieldVerified": True,
                "assignedOfficerId": "USR-003",
                "assignedOfficerName": "Vikram Singh (Field Officer)",
                "monitoringEnabled": True,
                "cloudThreshold": 20.0,
                "anomalyThreshold": -10.0,
                "baselineNdvi": 0.4650,
                "baselineNdwi": 0.1600,
                "baselinePeriod": {"start": "2024-01-01", "end": "2024-05-31"},
                "monitoringFrequencyDays": 5,
            },
            "PT-003": {
                "id": "PT-003",
                "code": "PT-003",
                "name": "Percolation Tank #3 (Ridge Point)",
                "watershedId": "WS-002",
                "watershedName": "Pune South Catchment",
                "state": "Maharashtra",
                "district": "Pune",
                "type": "Percolation Tank",
                "lifecycleStage": "Monitoring",
                "coordinates": [18.5204, 73.8567],
                "constructionDate": "15 Jan 2025",
                "implementingAgency": "Maharashtra Soil & Water Conservation Dept",
                "budgetAllocatedLakhs": 22.0,
                "capacityM3": 35000,
                "healthScore": 91,
                "isFieldVerified": True,
                "assignedOfficerId": "USR-004",
                "assignedOfficerName": "Amol Jadhav (Field Officer)",
                "monitoringEnabled": True,
                "cloudThreshold": 20.0,
                "anomalyThreshold": -10.0,
                "baselineNdvi": 0.5200,
                "baselineNdwi": 0.2200,
                "baselinePeriod": {"start": "2024-01-01", "end": "2024-05-31"},
                "monitoringFrequencyDays": 5,
            },
            "FP-007": {
                "id": "FP-007",
                "code": "FP-007",
                "name": "Farm Pond Cluster #7",
                "watershedId": "WS-003",
                "watershedName": "Ujjain West Catchment",
                "state": "Madhya Pradesh",
                "district": "Ujjain",
                "type": "Farm Pond",
                "lifecycleStage": "Monitoring",
                "coordinates": [23.1765, 75.7885],
                "constructionDate": "04 Feb 2025",
                "implementingAgency": "MP Watershed Mission",
                "budgetAllocatedLakhs": 5.5,
                "capacityM3": 4500,
                "healthScore": 76,
                "isFieldVerified": False,
                "assignedOfficerId": "USR-005",
                "assignedOfficerName": "Ramesh Patidar (Field Officer)",
                "monitoringEnabled": True,
                "cloudThreshold": 20.0,
                "anomalyThreshold": -10.0,
                "baselineNdvi": 0.3850,
                "baselineNdwi": 0.1200,
                "baselinePeriod": {"start": "2024-01-01", "end": "2024-05-31"},
                "monitoringFrequencyDays": 5,
            },
        }

    def get_by_id(self, intervention_id: str) -> Optional[Dict[str, Any]]:
        return self._interventions.get(intervention_id)

    def list_all(self, monitoring_only: bool = False) -> List[Dict[str, Any]]:
        items = list(self._interventions.values())
        if monitoring_only:
            return [i for i in items if i.get("monitoringEnabled", True)]
        return items

    def list_by_watershed(self, watershed_id: str) -> List[Dict[str, Any]]:
        return [i for i in self._interventions.values() if i["watershedId"] == watershed_id]

    def list_by_assigned_officer(self, officer_id: str) -> List[Dict[str, Any]]:
        return [i for i in self._interventions.values() if i.get("assignedOfficerId") == officer_id]


class MockSatelliteObservationRepository(ISatelliteObservationRepository):
    def __init__(self):
        self._observations: List[Dict[str, Any]] = []
        self._seen_keys: set = set()

    def save_observation(self, observation: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        key = f"{observation['interventionId']}:{observation['sceneId']}"
        if key in self._seen_keys:
            # Idempotent: return existing without duplication
            return None

        self._seen_keys.add(key)
        self._observations.append(observation)
        return observation

    def get_latest_by_intervention(self, intervention_id: str) -> Optional[Dict[str, Any]]:
        matches = [o for o in self._observations if o.get("interventionId") == intervention_id]
        return matches[-1] if matches else None

    def list_by_intervention(self, intervention_id: str) -> List[Dict[str, Any]]:
        return [o for o in self._observations if o.get("interventionId") == intervention_id]


class MockFieldEvidenceRepository(IFieldEvidenceRepository):
    def __init__(self):
        self._evidence: Dict[str, Dict[str, Any]] = {
            "EVD-101": {
                "id": "EVD-101",
                "version": 1,
                "parentEvidenceId": None,
                "interventionId": "CD-012",
                "photoUrl": "/assets/evidence/cd012-upstream-checkdam.jpg",
                "caption": "Masonry check dam body wall and downstream apron inspection.",
                "coordinates": [27.5684, 76.6128],
                "accuracyM": "±5m",
                "sha256Hash": "16302da516302da516302da516302da516302da516302da516302da516302da5",
                "uploadedById": "USR-003",
                "uploadedByName": "Vikram Singh",
                "verificationStatus": "VERIFIED",
                "physicalCondition": "HEALTHY",
                "verifiedById": "USR-001",
                "verifiedByName": "Dr. Rajesh Sharma",
                "verifiedAt": "2026-08-18T09:15:00Z",
                "capturedAt": "2026-08-18T08:30:00Z",
                "isImmutable": True,
            }
        }

    def save_evidence(self, evidence: Dict[str, Any]) -> Dict[str, Any]:
        ev_id = evidence["id"]
        # Generate SHA-256 hash if missing
        if "sha256Hash" not in evidence:
            raw = f"{evidence['interventionId']}:{evidence.get('photoUrl', '')}:{datetime.now(timezone.utc).isoformat()}"
            evidence["sha256Hash"] = hashlib.sha256(raw.encode('utf-8')).hexdigest()

        evidence["version"] = evidence.get("version", 1)
        evidence["isImmutable"] = False
        self._evidence[ev_id] = evidence
        return evidence

    def verify_evidence(self, evidence_id: str, verifier_id: str, verifier_name: str, finding_notes: str, physical_condition: str) -> Optional[Dict[str, Any]]:
        ev = self._evidence.get(evidence_id)
        if not ev:
            return None
        ev["verificationStatus"] = "VERIFIED"
        ev["verifiedById"] = verifier_id
        ev["verifiedByName"] = verifier_name
        ev["verifiedAt"] = datetime.now(timezone.utc).isoformat()
        ev["findingNotes"] = finding_notes
        ev["physicalCondition"] = physical_condition
        ev["isImmutable"] = True  # Verified evidence becomes immutable
        return ev

    def reject_evidence(self, evidence_id: str, verifier_id: str, verifier_name: str, rejection_reason: str) -> Optional[Dict[str, Any]]:
        ev = self._evidence.get(evidence_id)
        if not ev:
            return None
        ev["verificationStatus"] = "VERIFICATION_REJECTED"
        ev["verifiedById"] = verifier_id
        ev["verifiedByName"] = verifier_name
        ev["verifiedAt"] = datetime.now(timezone.utc).isoformat()
        ev["rejectionReason"] = rejection_reason
        return ev

    def list_by_intervention(self, intervention_id: str) -> List[Dict[str, Any]]:
        return [e for e in self._evidence.values() if e.get("interventionId") == intervention_id]


intervention_repo = MockInterventionRepository()
satellite_repo = MockSatelliteObservationRepository()
field_evidence_repo = MockFieldEvidenceRepository()
