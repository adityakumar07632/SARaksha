# SARaksha — Geospatial Data Architecture & Enterprise Monitoring Engine
*Document Version: 7.0 (Phase 7 Multi-Intervention, PostGIS Data Layer & Production Deployment)*

---

## 1. Overview & Vision

SARaksha is an enterprise-grade, evidence-first, decision-support platform designed to monitor watershed interventions using ESA Sentinel-2 Level-2A 10m multi-spectral imagery, geo-tagged ground telemetry, and immutable audit trails.

The core investigation architecture follows:
```
MAP-FIRST → EVIDENCE-FIRST → DECISION-FIRST
```

---

## 2. Multi-Intervention PostGIS Spatial Data Layer

The database layer utilizes **PostgreSQL 16 with PostGIS spatial extensions (SRID 4326 - WGS84)**.

### Relational & Spatial Schema:
- `watersheds`: State/catchment boundary polygons with GiST spatial indexing (`GEOMETRY(MultiPolygon, 4326)`).
- `interventions`: Geo-located water harvesting structures (`GEOMETRY(Point, 4326)`) with per-asset monitoring configurations (`baseline_ndvi`, `cloud_threshold`, `anomaly_threshold`, `assigned_officer_id`).
- `satellite_observations`: Multi-spectral observations with **strict uniqueness constraint (`UNIQUE (intervention_id, scene_id)`)** preventing duplicate entries.
- `field_evidence`: Versioned ground photographs (`version`, `parent_evidence_id`, `is_immutable`, `sha256_hash`).
- `monitoring_events`: Automated Sentinel-2 anomaly triage events with idempotent scene deduplication.
- `alerts`: Multi-channel notification tracking (`PENDING`, `SENT`, `DELIVERED`, `UNAVAILABLE`) with administrative alert escalation.
- `audit_events`: Chronological, append-only security logs with deterministic SHA-256 tamper-evident digests.

---

## 3. Multi-Intervention Monitoring & Idempotency

### Multi-Intervention Registry:
1. **Check Dam #12 (`CD-012`)**: Alwar North Catchment, Rajasthan `[27.5684° N, 76.6128° E]` — Baseline NDVI: `0.4900`
2. **Check Dam #14 (`CD-014`)**: Alwar North Catchment, Rajasthan `[27.5812° N, 76.6245° E]` — Baseline NDVI: `0.4650`
3. **Percolation Tank #3 (`PT-003`)**: Pune South Catchment, Maharashtra `[18.5204° N, 73.8567° E]` — Baseline NDVI: `0.5200`
4. **Farm Pond Cluster #7 (`FP-007`)**: Ujjain West Catchment, Madhya Pradesh `[23.1765° N, 75.7885° E]` — Baseline NDVI: `0.3850`

### Idempotency Guarantee:
Every monitoring evaluation is uniquely keyed by `intervention_id + scene_id`. Executing batch sweeps repeatedly (`POST /api/monitoring/scan`) produces 0 duplicate records.

---

## 4. Multi-Channel Notification & Alert Escalation

### Notification States:
- `PENDING`: Queued for dispatch.
- `SENT`: Transmitted to communication gateway.
- `DELIVERED`: Delivery confirmed by remote carrier (only when cryptographically or carrier acknowledged).
- `FAILED`: Transmission error.
- `UNAVAILABLE`: Carrier gateway unconfigured in development/offline mode.

### Escalation Protocol:
Unresolved `HIGH_PRIORITY` alerts ($\Delta \le -10\%$) escalate to elevated administrative roles (e.g., National Project Director / Super Admin) with structured escalation history.

---

## 5. Field Evidence & Immutable Versioning

- **Assigned Officer Scoping**: Field officers only access and submit evidence for assigned watershed interventions.
- **Dual GNSS & Cryptographic Seal**: Uploaded photographs embed EXIF coordinates and compute a 64-character SHA-256 digest.
- **Verification Separation**:
  - `OBSERVATION` (Satellite Data) $\ne$ `INTERPRETATION` (Spectral Anomaly) $\ne$ `HUMAN VERIFICATION` (Nodal Reviewer Sign-off).
- **Evidence Immutability**: Once verified, evidence records are locked (`is_immutable: true`). Updates create a new version with `parent_evidence_id`.

---

## 6. Full-Stack Docker Compose Deployment

The entire system reproduces locally with a single command:
```bash
docker compose up -d
```

### Services:
- `postgres`: PostgreSQL 16 + PostGIS Alpine container on port `5432` with automated schema initialization.
- `backend`: FastAPI Python container on port `8000` executing raster extraction and monitoring algorithms.
- `frontend`: React Vite bundle served via lightweight Nginx on port `5173 / 80`.
