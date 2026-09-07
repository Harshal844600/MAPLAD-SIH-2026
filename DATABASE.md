# 🗄️ MPLAD SENTINEL — DATABASE ARCHITECTURE & POSTGIS SPECIFICATION

## 1. Relational Schema Map

The PostgreSQL schema is structured across 6 logical domains:

1. **Administrative Geography & Profiles**:
   * `profiles`: User identities, designations, roles, jurisdiction IDs.
   * `states`, `districts`, `constituencies`: Administrative hierarchy across India.
2. **Project & Financial Ledgers**:
   * `projects`: Core scheme asset records, coordinates (`geom GEOMETRY(Point, 4326)`), exact numeric monetary amounts (`NUMERIC(15, 2)`).
   * `fund_allocations`: Installment release orders.
   * `transactions`: Vendor payment vouchers and transaction references.
3. **Vendors & Contractors**:
   * `vendors`: Registered corporate contractors, PAN, GSTIN, and blacklist status.
4. **Evidentiary Documents & OCR**:
   * `documents`: Immutable file metadata and storage references.
   * `document_extractions`: Structured OCR parsed fields (amounts, dates, vendors) and mismatch flags.
5. **Multi-Layer Anomaly Engine**:
   * `detection_rules`: Active rule catalog (`FIN-COST-001`, `GEO-DUP-001`, etc.) and weights.
   * `anomalies`: Detected rule violations with evidence payloads.
   * `risk_scores`: Versioned composite calculation results (0–100) and subscores.
6. **Investigations & Governance**:
   * `investigations`: Formal case files and assignment metadata.
   * `investigation_notes`: Confidential investigator notes with timestamp history.
   * `audit_logs`: Tamper-evident, append-only system audit log with SHA-256 hash chains.

---

## 2. PostGIS Spatial Operations

* **Spatial Indexing**: `CREATE INDEX idx_projects_geom ON projects USING GIST (geom);`
* **Proximity Overlap Query**:
```sql
SELECT p1.project_code, p2.project_code, ST_Distance(p1.geom::geography, p2.geom::geography) AS distance_meters
FROM projects p1
JOIN projects p2 ON p1.id != p2.id AND ST_DWithin(p1.geom::geography, p2.geom::geography, 25)
WHERE p1.status = 'SANCTIONED' AND p2.status = 'COMPLETED';
```
