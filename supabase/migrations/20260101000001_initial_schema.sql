-- ==============================================================================
-- MPLAD SENTINEL — MIGRATION 001: INITIAL SCHEMA & GEOGRAPHIC / FINANCIAL TABLES
-- ==============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles Definition
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'STATE_ADMIN',
    'DISTRICT_OFFICER',
    'MP_USER',
    'AUDITOR',
    'VIEWER'
);

-- 2. Data Classification Levels
CREATE TYPE data_classification AS ENUM (
    'PUBLIC',
    'INTERNAL',
    'CONFIDENTIAL',
    'RESTRICTED'
);

-- 3. Project Status Types
CREATE TYPE project_status AS ENUM (
    'SANCTIONED',
    'TENDERED',
    'IN_PROGRESS',
    'COMPLETED',
    'STALLED',
    'CANCELLED'
);

-- 4. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'VIEWER',
    state_id UUID,
    district_id UUID,
    constituency_id UUID,
    designation TEXT,
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Administrative Geography
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

-- 6. Project Categories
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    standard_benchmark_cost_per_unit NUMERIC(15, 2),
    standard_duration_days INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Vendors / Contractors
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_code VARCHAR(50) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    pan_number VARCHAR(20),
    gstin VARCHAR(30),
    registered_address TEXT,
    state_id UUID REFERENCES states(id),
    district_id UUID REFERENCES districts(id),
    contact_person TEXT,
    contact_phone VARCHAR(20),
    blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
    blacklisted_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Core Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_code VARCHAR(50) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES project_categories(id),
    mp_id UUID REFERENCES profiles(id),
    constituency_id UUID NOT NULL REFERENCES constituencies(id),
    district_id UUID NOT NULL REFERENCES districts(id),
    state_id UUID NOT NULL REFERENCES states(id),
    implementing_agency TEXT NOT NULL,
    vendor_id UUID REFERENCES vendors(id),
    status project_status NOT NULL DEFAULT 'SANCTIONED',
    
    -- Exact Financial precision (Never use float for money)
    sanctioned_amount NUMERIC(15, 2) NOT NULL CHECK (sanctioned_amount >= 0),
    released_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (released_amount >= 0),
    utilized_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (utilized_amount >= 0),
    
    -- Timeline
    sanction_date DATE NOT NULL,
    start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,
    
    -- Geographic Coordinates (PostGIS)
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    geom GEOMETRY(Point, 4326),
    location_name TEXT,
    
    -- Sensitivity classification
    classification data_classification NOT NULL DEFAULT 'INTERNAL',
    
    is_demo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Spatial Index for Fast Geographic Queries
CREATE INDEX IF NOT EXISTS idx_projects_geom ON projects USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_state_district ON projects(state_id, district_id);
CREATE INDEX IF NOT EXISTS idx_projects_vendor ON projects(vendor_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- 9. Fund Allocations & Installment Releases
CREATE TABLE IF NOT EXISTS fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    financial_year VARCHAR(15) NOT NULL,
    installment_number INTEGER NOT NULL CHECK (installment_number > 0),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    sanction_order_number VARCHAR(100),
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    released_at TIMESTAMPTZ
);

-- 10. Financial Transactions / Payments
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    invoice_number VARCHAR(100),
    invoice_date DATE,
    payment_date DATE NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    purpose TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Documents & Evidentiary Files
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (
        document_type IN ('SANCTION_ORDER', 'INVOICE', 'COMPLETION_CERTIFICATE', 'UTILIZATION_CERTIFICATE', 'INSPECTION_REPORT', 'SITE_PHOTO', 'TENDER_DOCUMENT')
    ),
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash_sha256 VARCHAR(64) NOT NULL,
    uploaded_by UUID REFERENCES profiles(id),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE
);

-- 12. Extracted OCR Metadata from Documents
CREATE TABLE IF NOT EXISTS document_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    extracted_vendor_name TEXT,
    extracted_amount NUMERIC(15, 2),
    extracted_date DATE,
    extracted_location TEXT,
    extracted_text_content TEXT,
    extraction_confidence NUMERIC(4, 3) CHECK (extraction_confidence BETWEEN 0 AND 1),
    mismatch_flags JSONB DEFAULT '[]'::jsonb,
    extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Physical Inspections
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES profiles(id),
    inspection_date DATE NOT NULL,
    physical_progress_percentage INTEGER CHECK (physical_progress_percentage BETWEEN 0 AND 100),
    quality_rating VARCHAR(20) CHECK (quality_rating IN ('EXCELLENT', 'SATISFACTORY', 'POOR', 'NON_EXISTENT')),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    geo_distance_meters NUMERIC(10, 2),
    findings_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
