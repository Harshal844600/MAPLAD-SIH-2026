-- ==============================================================================
-- MPLAD SENTINEL — MIGRATION 002: RISK SCORES, ANOMALIES & INVESTIGATION SCHEMA
-- ==============================================================================

-- 1. Anomaly Categories & Severity
CREATE TYPE anomaly_category AS ENUM (
    'FINANCIAL',
    'TIMELINE',
    'VENDOR',
    'GEOGRAPHIC',
    'DOCUMENT',
    'DUPLICATE'
);

CREATE TYPE anomaly_severity AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
);

CREATE TYPE investigation_status AS ENUM (
    'NEW',
    'UNDER_REVIEW',
    'ESCALATED',
    'RESOLVED',
    'DISMISSED'
);

-- 2. Detection Rules Catalog
CREATE TABLE IF NOT EXISTS detection_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., FIN-COST-001, GEO-DUP-004
    category anomaly_category NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    default_severity anomaly_severity NOT NULL,
    weight_percentage NUMERIC(5, 2) NOT NULL CHECK (weight_percentage >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rule_version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Detected Anomalies
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES detection_rules(id) ON DELETE SET NULL,
    rule_code VARCHAR(50) NOT NULL,
    category anomaly_category NOT NULL,
    severity anomaly_severity NOT NULL,
    score_impact INTEGER NOT NULL CHECK (score_impact BETWEEN 0 AND 100),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(4, 3) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_anomalies_project ON anomalies(project_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_category ON anomalies(category);
CREATE INDEX IF NOT EXISTS idx_anomalies_severity ON anomalies(severity);

-- 4. Calculated Project Risk Scores (Versioned and Traceable)
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    calculation_id VARCHAR(64) NOT NULL, -- unique batch/trigger reference
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    risk_level anomaly_severity NOT NULL,
    
    -- Sub-scores for Explainability
    financial_subscore INTEGER NOT NULL CHECK (financial_subscore BETWEEN 0 AND 100),
    timeline_subscore INTEGER NOT NULL CHECK (timeline_subscore BETWEEN 0 AND 100),
    vendor_subscore INTEGER NOT NULL CHECK (vendor_subscore BETWEEN 0 AND 100),
    geographic_subscore INTEGER NOT NULL CHECK (geographic_subscore BETWEEN 0 AND 100),
    document_subscore INTEGER NOT NULL CHECK (document_subscore BETWEEN 0 AND 100),
    duplicate_subscore INTEGER NOT NULL CHECK (duplicate_subscore BETWEEN 0 AND 100),
    
    model_version VARCHAR(50) NOT NULL DEFAULT 'v1.4.2-hybrid',
    rule_set_version VARCHAR(50) NOT NULL DEFAULT '2026.01',
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    calculated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_risk_scores_project ON risk_scores(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_level ON risk_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_scores_overall ON risk_scores(overall_score DESC);

-- 5. Risk Factors Breakdown per Project
CREATE TABLE IF NOT EXISTS risk_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_score_id UUID NOT NULL REFERENCES risk_scores(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    anomaly_id UUID REFERENCES anomalies(id) ON DELETE SET NULL,
    category anomaly_category NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    contribution_points INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    evidence_summary TEXT NOT NULL
);

-- 6. Forensic Investigations Workspace
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., INV-2026-10291
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    status investigation_status NOT NULL DEFAULT 'NEW',
    priority anomaly_severity NOT NULL DEFAULT 'HIGH',
    assigned_officer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_by_id UUID REFERENCES profiles(id),
    assigned_at TIMESTAMPTZ,
    escalated_to_agency TEXT,
    resolution_summary TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_officer ON investigations(assigned_officer_id);

-- 7. Attached Evidence to Investigations
CREATE TABLE IF NOT EXISTS investigation_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL, -- e.g., DOCUMENT, TRANSACTION, SATELLITE_IMG, AI_SYNTHESIS
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID,
    evidence_payload JSONB DEFAULT '{}'::jsonb,
    attached_by UUID REFERENCES profiles(id),
    attached_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Investigation Forensic Notes (with Immutable Edit History)
CREATE TABLE IF NOT EXISTS investigation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    note_text TEXT NOT NULL,
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);
