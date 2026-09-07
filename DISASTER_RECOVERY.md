# 🚨 MPLAD SENTINEL — DISASTER RECOVERY & INCIDENT RUNBOOK

## 1. Objectives & Metrics

* **Recovery Point Objective (RPO)**: < 15 minutes (Continuous WAL archiving and transaction replay).
* **Recovery Time Objective (RTO)**: < 1 hour (Automated failover to secondary database region).

---

## 2. Backup & Verification Strategy

1. **Daily Automated Snapshots**: Complete PostgreSQL physical dump taken at 02:00 IST and encrypted with AES-256.
2. **Point-In-Time Recovery (PITR)**: 30-day WAL retention allowing recovery to any specific second.
3. **Automated Weekly Restore Drills**: Staging instance automatically provisions and validates data consistency against recent production backup snapshots.

---

## 3. Incident Classification & Escalation

| Severity | Incident Definition | Response SLA | Action Protocol |
| :--- | :--- | :--- | :--- |
| **SEV-1** | Database outage or corruption | 15 minutes | Immediate failover to read-replica, trigger incident war room. |
| **SEV-2** | Groq AI endpoint failure | 30 minutes | System automatically activates deterministic grounding fallback engine. |
| **SEV-3** | Upload/OCR processing degradation | 2 hours | Background job queue pauses, retries scheduled with exponential backoff. |
