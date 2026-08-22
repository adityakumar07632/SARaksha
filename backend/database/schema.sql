-- SARaksha PostgreSQL + PostGIS Spatial Schema
-- Version: 7.0.0 (Production Multi-Intervention & Audit Baseline)

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. States & Catchments Table
CREATE TABLE IF NOT EXISTS watersheds (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    district VARCHAR(128) NOT NULL,
    sub_district VARCHAR(128),
    area_ha NUMERIC(12, 2),
    health_score INT CHECK (health_score BETWEEN 0 AND 100),
    boundary GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Interventions Registry with Monitoring Configuration
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    watershed_id VARCHAR(64) REFERENCES watersheds(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    lifecycle_stage VARCHAR(64) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    construction_date DATE,
    implementing_agency VARCHAR(255),
    budget_lakhs NUMERIC(10, 2),
    capacity_m3 NUMERIC(12, 2),
    health_score INT CHECK (health_score BETWEEN 0 AND 100),
    is_field_verified BOOLEAN DEFAULT FALSE,
    assigned_officer_id VARCHAR(64),
    assigned_officer_name VARCHAR(128),
    -- Multi-Intervention Monitoring Configuration
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    cloud_threshold NUMERIC(5, 2) DEFAULT 20.0,
    anomaly_threshold NUMERIC(5, 2) DEFAULT -10.0,
    baseline_ndvi NUMERIC(6, 4) DEFAULT 0.4900,
    baseline_period_start DATE DEFAULT '2024-01-01',
    baseline_period_end DATE DEFAULT '2024-05-31',
    monitoring_frequency_days INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_watersheds_boundary ON watersheds USING GIST(boundary);
CREATE INDEX IF NOT EXISTS idx_interventions_location ON interventions USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_interventions_watershed ON interventions(watershed_id);
CREATE INDEX IF NOT EXISTS idx_interventions_assigned ON interventions(assigned_officer_id);

-- 3. Satellite Multi-Spectral Observations (Strict Uniqueness Constraint)
CREATE TABLE IF NOT EXISTS satellite_observations (
    id VARCHAR(64) PRIMARY KEY,
    intervention_id VARCHAR(64) REFERENCES interventions(id) ON DELETE CASCADE,
    scene_id VARCHAR(128) NOT NULL,
    platform VARCHAR(64) NOT NULL,
    acquisition_date TIMESTAMPTZ NOT NULL,
    median_ndvi NUMERIC(6, 4) NOT NULL,
    mean_ndvi NUMERIC(6, 4),
    std_ndvi NUMERIC(6, 4),
    median_ndwi NUMERIC(6, 4),
    mean_ndwi NUMERIC(6, 4),
    valid_pixels INT NOT NULL,
    total_pixels INT NOT NULL,
    valid_pixel_percentage NUMERIC(5, 2) NOT NULL,
    cloud_cover_percentage NUMERIC(5, 2),
    aoi_geometry GEOMETRY(Polygon, 4326),
    provenance JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Enforce Idempotent Uniqueness per Intervention and Scene
    CONSTRAINT uq_intervention_scene UNIQUE (intervention_id, scene_id)
);

CREATE INDEX IF NOT EXISTS idx_sat_obs_intervention_date ON satellite_observations(intervention_id, acquisition_date DESC);
CREATE INDEX IF NOT EXISTS idx_sat_obs_scene ON satellite_observations(scene_id);

-- 4. Versioned & Immutable Field Evidence
CREATE TABLE IF NOT EXISTS field_evidence (
    id VARCHAR(64) PRIMARY KEY,
    version INT DEFAULT 1,
    parent_evidence_id VARCHAR(64) REFERENCES field_evidence(id),
    intervention_id VARCHAR(64) REFERENCES interventions(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    accuracy_m VARCHAR(32),
    sha256_hash VARCHAR(64) NOT NULL,
    uploaded_by_id VARCHAR(64),
    uploaded_by_name VARCHAR(128),
    verification_status VARCHAR(32) DEFAULT 'PENDING',
    physical_condition VARCHAR(32),
    verified_by_id VARCHAR(64),
    verified_by_name VARCHAR(128),
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    ai_analysis JSONB,
    captured_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_immutable BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_evidence_intervention ON field_evidence(intervention_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON field_evidence(sha256_hash);

-- 5. Automated Monitoring Events (Deduplicated)
CREATE TABLE IF NOT EXISTS monitoring_events (
    id VARCHAR(64) PRIMARY KEY,
    intervention_id VARCHAR(64) REFERENCES interventions(id) ON DELETE CASCADE,
    scene_id VARCHAR(128) NOT NULL,
    observation_date DATE NOT NULL,
    previous_ndvi NUMERIC(6, 4) NOT NULL,
    current_ndvi NUMERIC(6, 4) NOT NULL,
    percentage_change NUMERIC(6, 2) NOT NULL,
    anomaly_level VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'NEW',
    recommended_action TEXT,
    provenance JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_monitoring_intervention_scene UNIQUE (intervention_id, scene_id)
);

CREATE INDEX IF NOT EXISTS idx_monitoring_intervention ON monitoring_events(intervention_id, observation_date DESC);

-- 6. Alerts with Notification & Escalation Tracking
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    intervention_id VARCHAR(64) REFERENCES interventions(id) ON DELETE CASCADE,
    monitoring_event_id VARCHAR(64) REFERENCES monitoring_events(id),
    severity VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scene_id VARCHAR(128) NOT NULL,
    recipient_email VARCHAR(128),
    notification_state VARCHAR(32) DEFAULT 'PENDING', -- PENDING, SENT, DELIVERED, FAILED, UNAVAILABLE
    notification_provider VARCHAR(64) DEFAULT 'console',
    notification_timestamp TIMESTAMPTZ,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalation_level INT DEFAULT 0,
    escalated_to VARCHAR(128),
    status VARCHAR(32) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Immutable Security & Audit Log
CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    entity_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64),
    actor_name VARCHAR(128) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    tamper_evident_hash VARCHAR(64) NOT NULL,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_events(entity_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events(action);
