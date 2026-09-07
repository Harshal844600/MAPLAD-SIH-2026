# 🔒 MPLAD SENTINEL — SECURITY & GOVERNANCE MODEL

## 1. Authentication & Role-Based Access Control (RBAC)

MPLAD Sentinel enforces strict multi-role governance:

| Role | Scope of Access | Permissions |
| :--- | :--- | :--- |
| **SUPER_ADMIN** | National (All States & Districts) | Full system configuration, risk weights, global audits, user management. |
| **STATE_ADMIN** | State-level projects | State analytics, state-wide project overview, district officer assignments. |
| **DISTRICT_OFFICER** | Assigned District | Case management, physical inspection uploads, voucher approvals. |
| **MP_USER** | Assigned Constituency | Constituency progress monitoring, recommendation ledger review. |
| **AUDITOR** | National / Assigned Audit Scope | Read-only forensic analysis, dossier generation, anomaly review. |
| **VIEWER** | Public / Anonymized | Public summary dashboards and transparency views. |

---

## 2. Row Level Security (RLS) & Database Policies

All sensitive PostgreSQL tables (`projects`, `transactions`, `documents`, `anomalies`, `investigations`, `audit_logs`) have Row Level Security enabled. Geographic and departmental filters ensure officers cannot read or write data outside their administrative jurisdiction.

---

## 3. Tamper-Evident Immutable Audit Trail

* **Append-Only Enforcement**: Database trigger `prevent_audit_log_tampering()` prohibits `UPDATE` or `DELETE` operations on `audit_logs` for all database users including administrators.
* **Cryptographic Hash Chaining**: Every log entry records an incremental sequence number, actor ID, action name, and a SHA-256 hash chaining to the previous log entry.

---

## 4. Groq AI Security & Prompt Injection Defense

* **Zero Direct Database Access**: LLMs are isolated from raw database queries. All inputs are mapped to typed `GroundingContext` structures.
* **Input Sanitization**: Untrusted text from uploaded documents and user notes is sanitized by `sanitizeUntrustedText()` to remove prompt injection overrides.
* **Anti-Defamation Phrasing Filter**: `enforceSafetyLanguage()` ensures generated outputs strictly adhere to objective, non-accusatory terminology.

---

## 5. File Upload & Document Security

* Uploaded vouchers and site photos undergo MIME type validation, file size limits (max 15MB), filename sanitization, and SHA-256 integrity checksumming.
* Documents are stored in isolated Supabase Storage buckets with short-lived signed URLs.
