-- ==============================================================================
-- MPLAD SENTINEL — COMPLETE SUPABASE PRODUCTION SCHEMA & SEED DATA
-- Project: MPLAD Sentinel (SIH 2026)
-- Target: Supabase Postgres (PostGIS + PGCrypto + RLS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS & TYPES
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'SUPER_ADMIN',
            'STATE_ADMIN',
            'DISTRICT_OFFICER',
            'MP_USER',
            'AUDITOR',
            'VIEWER'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_classification') THEN
        CREATE TYPE data_classification AS ENUM (
            'PUBLIC',
            'INTERNAL',
            'CONFIDENTIAL',
            'RESTRICTED'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM (
            'SANCTIONED',
            'TENDERED',
            'IN_PROGRESS',
            'COMPLETED',
            'STALLED',
            'CANCELLED'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anomaly_category') THEN
        CREATE TYPE anomaly_category AS ENUM (
            'FINANCIAL',
            'TIMELINE',
            'VENDOR',
            'GEOGRAPHIC',
            'DOCUMENT',
            'DUPLICATE'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'anomaly_severity') THEN
        CREATE TYPE anomaly_severity AS ENUM (
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'investigation_status') THEN
        CREATE TYPE investigation_status AS ENUM (
            'NEW',
            'UNDER_REVIEW',
            'ESCALATED',
            'RESOLVED',
            'DISMISSED'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
        CREATE TYPE job_status AS ENUM (
            'PENDING',
            'RUNNING',
            'COMPLETED',
            'FAILED',
            'RETRYING',
            'DEAD_LETTER'
        );
    END IF;
END $$;

-- 3. ADMINISTRATIVE GEOGRAPHY & PROFILES
CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    capital TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    nodal_officer_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(state_id, code)
);

CREATE TABLE IF NOT EXISTS constituencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE RESTRICT,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('LOK_SABHA', 'RAJYA_SABHA')),
    mp_name TEXT NOT NULL,
    mp_term_start DATE,
    mp_term_end DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'VIEWER',
    state_id UUID REFERENCES states(id),
    district_id UUID REFERENCES districts(id),
    constituency_id UUID REFERENCES constituencies(id),
    designation TEXT,
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MASTER PROJECT & FINANCIAL REGISTRY
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    standard_benchmark_cost_per_unit NUMERIC(15, 2),
    standard_duration_days INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    pan_number VARCHAR(20),
    gstin VARCHAR(20),
    registration_state_id UUID REFERENCES states(id),
    blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
    risk_rating NUMERIC(3, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., MPLAD-10291
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES project_categories(id),
    state_id UUID NOT NULL REFERENCES states(id),
    district_id UUID NOT NULL REFERENCES districts(id),
    constituency_id UUID NOT NULL REFERENCES constituencies(id),
    mp_id UUID REFERENCES profiles(id),
    implementing_agency TEXT NOT NULL,
    sanctioned_amount NUMERIC(15, 2) NOT NULL CHECK (sanctioned_amount > 0),
    disbursed_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.0 CHECK (disbursed_amount >= 0),
    expenditure_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.0 CHECK (expenditure_amount >= 0),
    status project_status NOT NULL DEFAULT 'SANCTIONED',
    sanction_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location_geom GEOMETRY(Point, 4326),
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_geom ON projects USING GIST (location_geom);
CREATE INDEX IF NOT EXISTS idx_projects_district ON projects(district_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    percentage_target NUMERIC(5, 2) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES vendors(id),
    voucher_number VARCHAR(100) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- INVOICE, SANCTION_ORDER, UTILIZATION_CERT
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    checksum_sha256 VARCHAR(64),
    uploaded_by UUID REFERENCES profiles(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    ocr_raw_text TEXT,
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(4, 3),
    is_mismatched BOOLEAN NOT NULL DEFAULT FALSE,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. RISK INTELLIGENCE & ANOMALY DETECTION TABLES
CREATE TABLE IF NOT EXISTS detection_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(50) NOT NULL UNIQUE,
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

CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    calculation_id VARCHAR(64) NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    risk_level anomaly_severity NOT NULL,
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

CREATE TABLE IF NOT EXISTS risk_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_score_id UUID NOT NULL REFERENCES risk_scores(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    anomaly_id UUID REFERENCES anomalies(id) ON DELETE SET NULL,
    category anomaly_category NOT NULL,
    weight NUMERIC(5, 2) NOT NULL,
    contribution_points INTEGER NOT NULL,
    factor_title TEXT NOT NULL,
    factor_rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. INVESTIGATIONS, AI COPILOT & AUDIT GOVERNANCE
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., INV-2026-088
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status investigation_status NOT NULL DEFAULT 'NEW',
    priority anomaly_severity NOT NULL DEFAULT 'HIGH',
    assigned_officer_id UUID REFERENCES profiles(id),
    lead_auditor_name TEXT,
    summary_hypothesis TEXT,
    findings TEXT,
    statutory_action_recommended TEXT,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investigation_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    evidence_type VARCHAR(50) NOT NULL, -- INVOICE_VOUCHER, SATELLITE_IMG, BANK_STATEMENT
    title TEXT NOT NULL,
    description TEXT,
    source_url TEXT,
    file_path TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investigation_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
    author_id UUID REFERENCES profiles(id),
    author_name TEXT NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    investigation_id UUID REFERENCES investigations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id),
    prompt_version VARCHAR(50) NOT NULL DEFAULT 'v2.1-evidence-grounded',
    model_name VARCHAR(100) NOT NULL DEFAULT 'llama-3.3-70b-versatile',
    model_version VARCHAR(50) NOT NULL DEFAULT 'groq-llama3.3',
    input_context_hash VARCHAR(64) NOT NULL,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    latency_ms INTEGER,
    response_payload JSONB NOT NULL,
    confidence_rating NUMERIC(4, 3),
    cited_evidence_ids JSONB DEFAULT '[]'::jsonb,
    is_safe_vetted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    ip_address INET,
    user_agent TEXT,
    old_state JSONB,
    new_state JSONB,
    checksum_sha256 VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_role user_role,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    minimum_role user_role NOT NULL DEFAULT 'VIEWER',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SEED DATA EXECUTION
-- Insert Detection Rules
INSERT INTO detection_rules (rule_code, category, title, description, default_severity, weight_percentage) VALUES
('FIN-COST-001', 'FINANCIAL', 'Excessive Unit Cost Deviation', 'Sanctioned or billed cost exceeds standard schedule of rates (SoR) benchmark by more than 40%.', 'HIGH', 15.0),
('FIN-DUP-002', 'FINANCIAL', 'Duplicate Payment Reference', 'Multiple transactions reference identical invoice numbers or identical checksum amount patterns to the same vendor.', 'CRITICAL', 20.0),
('FIN-UTIL-003', 'FINANCIAL', 'Rapid Fund Depletion Without Milestone', '100% of sanctioned funds drawn within 14 days of sanction without verified physical milestone inspection.', 'HIGH', 12.0),
('TIME-SEQ-001', 'TIMELINE', 'Completion Before Sanction Date', 'Completion certificate or final payment timestamp predates work sanction or tender award.', 'CRITICAL', 20.0),
('TIME-DELAY-002', 'TIMELINE', 'Severe Execution Stagnation', 'Zero physical progress reported 180 days past the scheduled completion deadline.', 'MEDIUM', 10.0),
('VEN-CONC-001', 'VENDOR', 'High Vendor Concentration (HHI)', 'Single contractor awarded over 65% of all constituency projects within a single financial year.', 'HIGH', 15.0),
('VEN-SHELL-002', 'VENDOR', 'Suspicious Vendor Address Overlap', 'Contractor shares identical GSTIN/PAN or physical office address with implementing agency nodal staff.', 'CRITICAL', 25.0),
('GEO-DUP-001', 'GEOGRAPHIC', 'Exact GPS Coordinates Overlap', 'Project coordinates match an existing completed project within 15 meters radius.', 'CRITICAL', 25.0),
('GEO-OUT-002', 'GEOGRAPHIC', 'Project Outside Constituency Boundary', 'Recorded latitude/longitude falls outside the authorized geographic boundary of the MP constituency.', 'HIGH', 15.0),
('DOC-MIS-001', 'DOCUMENT', 'Invoice vs Sanction Amount Mismatch', 'OCR extracted invoice total differs by >10% from sanctioned milestone schedule amount.', 'HIGH', 15.0),
('DOC-DATE-002', 'DOCUMENT', 'Invoice Date Inconsistency', 'Contractor invoice creation date predates tender release or sanction order.', 'HIGH', 15.0),
('DUP-SIM-001', 'DUPLICATE', 'Fuzzy Semantic Work Duplication', 'Work description, estimated budget, and target village match an ongoing state scheme project.', 'HIGH', 15.0)
ON CONFLICT (rule_code) DO NOTHING;

-- Insert Project Categories
INSERT INTO project_categories (name, description, standard_benchmark_cost_per_unit, standard_duration_days) VALUES
('Roads & Bridges', 'Construction of CC roads, culverts, and blacktop approach roads in rural & semi-urban areas', 1500000.00, 180),
('Drinking Water & Sanitation', 'Installation of high-yield borewells, RO treatment plants, and overhead community tanks', 800000.00, 90),
('Education & Skill Centers', 'Smart classrooms, school laboratory equipment, and youth skill training halls', 2200000.00, 240),
('Public Health Infrastructure', 'Primary health sub-center upgrades, ambulance procurement, and diagnostic clinics', 3500000.00, 300),
('Community Centers & Halls', 'Multipurpose community centers, Barat Ghars, and public recreation auditoriums', 4500000.00, 270),
('Renewable Energy & Lighting', 'Solar street lights, rooftop solar panels for public buildings, and micro-grids', 1200000.00, 120)
ON CONFLICT (name) DO NOTHING;

-- Insert System Settings
INSERT INTO system_settings (key, value, description) VALUES
('risk_weights', '{
    "financial": 0.25,
    "timeline": 0.20,
    "vendor": 0.20,
    "geographic": 0.15,
    "documents": 0.15,
    "duplicate": 0.05
}'::jsonb, 'Configurable category weights for the composite 0-100 MPLAD Sentinel risk aggregator'),
('risk_thresholds', '{
    "low": 0,
    "medium": 30,
    "high": 60,
    "critical": 80
}'::jsonb, 'Semantic risk boundary score cutoffs')
ON CONFLICT (key) DO NOTHING;

-- Insert Feature Flags
INSERT INTO feature_flags (name, is_enabled, description, minimum_role) VALUES
('enable_groq_ai', TRUE, 'Enable LLM investigation copilot and automated case synthesizers', 'VIEWER'),
('enable_ml_anomaly_engine', TRUE, 'Run statistical isolation forest and heuristic anomaly detectors', 'VIEWER'),
('enable_document_ocr', TRUE, 'Allow automated extraction and mismatch validation from uploaded PDFs and images', 'DISTRICT_OFFICER'),
('enable_demo_mode', TRUE, 'Provide realistic synthetic 1000+ project dataset for testing and evaluation', 'VIEWER')
ON CONFLICT (name) DO NOTHING;

-- Geographic Seed: State, District, Constituency
INSERT INTO states (id, code, name, capital) VALUES
('a0000000-0000-0000-0000-000000000001', 'UP', 'Uttar Pradesh', 'Lucknow')
ON CONFLICT (code) DO NOTHING;

INSERT INTO districts (id, state_id, code, name, nodal_officer_name) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'UP-PRY', 'Prayagraj (Allahabad)', 'Shri Sanjay Verma, IAS')
ON CONFLICT (state_id, code) DO NOTHING;

INSERT INTO constituencies (id, state_id, district_id, name, type, mp_name, mp_term_start, mp_term_end) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Phulpur', 'LOK_SABHA', 'Hon. Representative Phulpur', '2024-06-05', '2029-06-04')
ON CONFLICT DO NOTHING;

-- Vendor Seed
INSERT INTO vendors (id, vendor_code, name, pan_number, gstin, blacklisted, risk_rating) VALUES
('d0000000-0000-0000-0000-000000000001', 'VEN-APX-8821', 'Apex Buildcon Infrastructure Ltd', 'AAPCA1234F', '09AAPCA1234F1Z5', FALSE, 0.88),
('d0000000-0000-0000-0000-000000000002', 'VEN-SUR-4402', 'Surya Urja Renewable Systems', 'BBPCS5678G', '09BBPCS5678G1Z8', FALSE, 0.42),
('d0000000-0000-0000-0000-000000000003', 'VEN-JAL-1109', 'Shree Jal Seva Enterprises', 'CCPCJ9012H', '09CCPCJ9012H1Z1', FALSE, 0.15)
ON CONFLICT (vendor_code) DO NOTHING;

-- Flagship Critical Project Seed: MPLAD-10291
INSERT INTO projects (
    id, project_code, title, description, state_id, district_id, constituency_id,
    implementing_agency, sanctioned_amount, disbursed_amount, expenditure_amount,
    status, sanction_date, target_completion_date, latitude, longitude, is_demo
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'MPLAD-10291',
    'Construction of Multipurpose Community Hall & Resource Center',
    'Two-story reinforced civic center in Phulpur rural block including digital library and public auditorium.',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'District Rural Development Agency (DRDA) Prayagraj',
    4850000.00,
    4850000.00,
    4620000.00,
    'COMPLETED',
    '2025-04-10',
    '2025-12-15',
    25.5489000,
    81.9834000,
    TRUE
) ON CONFLICT (project_code) DO NOTHING;

-- Flagship Project Anomaly Records
INSERT INTO anomalies (
    project_id, rule_code, category, severity, score_impact, title, description, evidence_payload, confidence_score
) VALUES
('e0000000-0000-0000-0000-000000000001', 'FIN-DUP-002', 'FINANCIAL', 'CRITICAL', 32, 'Duplicate Invoice Claim Discovered', 'Identical invoice voucher #INV-APX-884 submitted and cleared for two separate foundation work tranches.', '{"invoice_num": "INV-APX-884", "amount_inr": 1250000, "duplicate_date": "2025-08-14"}'::jsonb, 0.985),
('e0000000-0000-0000-0000-000000000001', 'GEO-DUP-001', 'GEOGRAPHIC', 'CRITICAL', 28, 'Physical Asset Location Overlap (8.2m)', 'Recorded GPS coordinates fall directly over a 2023 completed state Panchayat hall.', '{"proximity_meters": 8.2, "target_lat": 25.5489, "target_lng": 81.9834}'::jsonb, 0.940),
('e0000000-0000-0000-0000-000000000001', 'TIME-SEQ-001', 'TIMELINE', 'HIGH', 18, 'Completion Certificate Precedes Tender Award', 'Civil completion clearance recorded 42 days prior to formal tender award stamp.', '{"sanction_date": "2025-04-10", "recorded_completion": "2025-03-01"}'::jsonb, 0.910),
('e0000000-0000-0000-0000-000000000001', 'VEN-CONC-001', 'VENDOR', 'HIGH', 13, 'Excessive Vendor Concentration (74% HHI)', 'Apex Buildcon holds 74% of all civil construction awards in Phulpur constituency for FY25.', '{"hhi_share_pct": 74.2, "vendor_name": "Apex Buildcon"}'::jsonb, 0.890)
ON CONFLICT DO NOTHING;

-- Flagship Project Risk Score Record
INSERT INTO risk_scores (
    project_id, calculation_id, overall_score, risk_level,
    financial_subscore, timeline_subscore, vendor_subscore,
    geographic_subscore, document_subscore, duplicate_subscore
) VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'CALC-2026-09-06-8812',
    91,
    'CRITICAL',
    94, 86, 88, 92, 79, 65
) ON CONFLICT DO NOTHING;

-- Flagship Investigation Casebook Record
INSERT INTO investigations (
    id, case_number, project_id, title, status, priority, lead_auditor_name, summary_hypothesis
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'INV-2026-088',
    'e0000000-0000-0000-0000-000000000001',
    'Forensic Inquiry into Phulpur Community Center Voucher & Location Overlaps',
    'UNDER_REVIEW',
    'CRITICAL',
    'Dr. K. S. Ramanujan (CAG Special Audit Directorate)',
    'Suspected duplicate billing under invoice #INV-APX-884 combined with co-location of newly sanctioned asset over pre-existing 2023 infrastructure.'
) ON CONFLICT (case_number) DO NOTHING;
