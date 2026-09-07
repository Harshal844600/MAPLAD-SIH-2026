-- ==============================================================================
-- MPLAD SENTINEL — MIGRATION 004: ROW LEVEL SECURITY & TAMPER POLICIES
-- ==============================================================================

-- Enable Row Level Security (RLS) on all sensitive tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_runs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_auth_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's district
CREATE OR REPLACE FUNCTION get_auth_user_district()
RETURNS UUID AS $$
  SELECT district_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function to get current user's state
CREATE OR REPLACE FUNCTION get_auth_user_state()
RETURNS UUID AS $$
  SELECT state_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 1. Profiles RLS
CREATE POLICY profiles_read_all ON profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY profiles_update_self_or_admin ON profiles
  FOR UPDATE USING (
    id = auth.uid() OR get_auth_user_role() = 'SUPER_ADMIN'
  );

-- 2. Projects RLS (Role and Geography Scope)
CREATE POLICY projects_role_scope_select ON projects
  FOR SELECT USING (
    get_auth_user_role() IN ('SUPER_ADMIN', 'AUDITOR', 'VIEWER')
    OR (get_auth_user_role() = 'STATE_ADMIN' AND state_id = get_auth_user_state())
    OR (get_auth_user_role() = 'DISTRICT_OFFICER' AND district_id = get_auth_user_district())
    OR (get_auth_user_role() = 'MP_USER' AND mp_id = auth.uid())
    OR is_demo = TRUE
  );

-- 3. Investigations RLS
CREATE POLICY investigations_role_scope ON investigations
  FOR ALL USING (
    get_auth_user_role() IN ('SUPER_ADMIN', 'AUDITOR')
    OR assigned_officer_id = auth.uid()
    OR (get_auth_user_role() = 'DISTRICT_OFFICER' AND project_id IN (
        SELECT id FROM projects WHERE district_id = get_auth_user_district()
    ))
  );

-- 4. Audit Logs RLS: Strict Append-Only (NO UPDATE / NO DELETE allowed by anyone)
CREATE POLICY audit_logs_read ON audit_logs
  FOR SELECT USING (
    get_auth_user_role() IN ('SUPER_ADMIN', 'AUDITOR')
  );

CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Enforce append-only trigger on audit_logs
CREATE OR REPLACE FUNCTION prevent_audit_log_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are strictly immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_tampering();
