-- ==============================================================================
-- MPLAD SENTINEL — MIGRATION 005: DETECTION RULES & SYSTEM SEED DATA
-- ==============================================================================

-- 1. Insert Standard Detection Rules Catalog
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

-- 2. Insert Standard Project Categories with Benchmarks
INSERT INTO project_categories (name, description, standard_benchmark_cost_per_unit, standard_duration_days) VALUES
('Roads & Bridges', 'Construction of CC roads, culverts, and blacktop approach roads in rural & semi-urban areas', 1500000.00, 180),
('Drinking Water & Sanitation', 'Installation of high-yield borewells, RO treatment plants, and overhead community tanks', 800000.00, 90),
('Education & Skill Centers', 'Smart classrooms, school laboratory equipment, and youth skill training halls', 2200000.00, 240),
('Public Health Infrastructure', 'Primary health sub-center upgrades, ambulance procurement, and diagnostic clinics', 3500000.00, 300),
('Community Centers & Halls', 'Multipurpose community centers, Barat Ghars, and public recreation auditoriums', 4500000.00, 270),
('Renewable Energy & Lighting', 'Solar street lights, rooftop solar panels for public buildings, and micro-grids', 1200000.00, 120)
ON CONFLICT (name) DO NOTHING;

-- 3. Default System Risk Weights
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

-- 4. Default Feature Flags
INSERT INTO feature_flags (name, is_enabled, description, minimum_role) VALUES
('enable_groq_ai', TRUE, 'Enable LLM investigation copilot and automated case synthesizers', 'VIEWER'),
('enable_ml_anomaly_engine', TRUE, 'Run statistical isolation forest and heuristic anomaly detectors', 'VIEWER'),
('enable_document_ocr', TRUE, 'Allow automated extraction and mismatch validation from uploaded PDFs and images', 'DISTRICT_OFFICER'),
('enable_demo_mode', TRUE, 'Provide realistic synthetic 1000+ project dataset for testing and evaluation', 'VIEWER')
ON CONFLICT (name) DO NOTHING;
