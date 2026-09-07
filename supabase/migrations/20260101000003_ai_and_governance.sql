-- ==============================================================================
-- MPLAD SENTINEL — MIGRATION 003: AI RUNS, AUDIT LOGS, JOBS & GOVERNANCE
-- ==============================================================================

-- 1. AI Analysis Runs (Reproducibility & Grounding Audit)
CREATE TABLE IF NOT EXISTS ai_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    investigation_id UUID REFERENCES investigations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id),
    prompt_version VARCHAR(50) NOT NULL DEFAULT 'v2.1-evidence-grounded',
    model_name VARCHAR(100) NOT NULL, -- e.g., groq/llama-3.3-70b-versatile
    model_version VARCHAR(50) NOT NULL,
    input_context_hash VARCHAR(64) NOT NULL, -- SHA-256 of grounding JSON
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    latency_ms INTEGER,
    response_payload JSONB NOT NULL,
    confidence_rating NUMERIC(4, 3),
    cited_evidence_ids JSONB DEFAULT '[]'::jsonb,
    is_safe_vetted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Chat Sessions & Conversation History
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('USER', 'ASSISTANT', 'SYSTEM')),
    message_text TEXT NOT NULL,
    cited_sources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Asynchronous Background Jobs Queue
CREATE TYPE job_status AS ENUM (
    'PENDING',
    'RUNNING',
    'COMPLETED',
    'FAILED',
    'RETRYING',
    'DEAD_LETTER'
);

CREATE TABLE IF NOT EXISTS background_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type VARCHAR(50) NOT NULL, -- e.g., BULK_CSV_IMPORT, RISK_RECALC, AI_CASE_SYNTHESIS
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status job_status NOT NULL DEFAULT 'PENDING',
    priority INTEGER NOT NULL DEFAULT 5,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    error_message TEXT,
    idempotency_key VARCHAR(100) UNIQUE,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. In-App Permission-Aware Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    target_role user_role,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- PROJECT, INVESTIGATION, AUDIT
    entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. System Settings & Dynamic Risk Weights
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES profiles(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Dynamic Feature Flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    minimum_role user_role NOT NULL DEFAULT 'VIEWER',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tamper-Evident Immutable Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_number BIGSERIAL,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., PROJECT_VIEWED, RISK_RECALCULATED, INVESTIGATION_ESCALATED
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    tamper_hash VARCHAR(64), -- SHA-256 hash chaining to previous row
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON audit_logs(created_at DESC);
