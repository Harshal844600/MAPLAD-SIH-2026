# 🏛️ MPLAD SENTINEL — SYSTEM ARCHITECTURE

## 1. High-Level Architectural Model

```text
                                MPLAD SENTINEL
                                      │
                     ┌────────────────┼────────────────┐
                     │                │                │
                  FRONTEND         SUPABASE          AI/ML
                     │                │                │
               React 18/19 TS      PostgreSQL       Rules Engine
               Tailwind Design     PostGIS          Statistical ML
               Handcrafted SVGs    Storage          Graph Network
               TanStack Query      Realtime         Groq Llama-3.3 70B
               Leaflet GIS         RLS Policies     Grounded Copilot
                     │                │                │
                     └────────────────┼────────────────┘
                                      │
                                      ▼
                        CROSS-VALIDATION ENGINE
                                      │
                                      ▼
                             RISK AGGREGATOR
                                      │
                                      ▼
                          EXPLAINABLE FINDINGS
                                      │
                                      ▼
                              SENTINEL AI
                                      │
                                      ▼
                         INVESTIGATION WORKSPACE
                                      │
                           ┌──────────┼──────────┐
                           ▼          ▼          ▼
                        EVIDENCE   REPORTS    ACTIONS
                           │          │          │
                           └──────────┼──────────┘
                                      ▼
                                 AUDIT TRAIL
                                      │
                                      ▼
                          MONITORING / GOVERNANCE
```

---

## 2. Component Layers

### 2.1 Presentation & Design System
* **Central Tokens**: Located in `src/design-system/`, standardizing colors (Warm Paper, Pencil Black, Correction Red), asymmetrical wobbly border radii, and hard offset shadows.
* **Component Primitives**: `WobblyCard`, `SketchButton`, `SketchInput`, `RiskBadge`, `RiskScoreGauge`, `StickyNote`, `SketchModal`, and hand-drawn SVGs (`SketchArrow`, `Squiggle`, `WavyUnderline`, `ThumbtackPin`, `TapeStrip`, `GovernmentStamp`).
* **Visual Density Modes**:
  * *Discovery Mode*: 60% analytical, 40% hand-drawn.
  * *Investigation Mode*: 80% analytical, 20% hand-drawn.

### 2.2 Forensic Multi-Layer Anomaly Detection
* **Financial Layer**: Evaluates project cost against standard Schedule of Rates benchmarks, identifies duplicate payment vouchers (`FIN-DUP-002`), and flags abnormal disbursement velocity.
* **Timeline Layer**: Flags milestone chronology inversions (`TIME-SEQ-001`) where completion precedes sanction.
* **Vendor Layer**: Computes constituency contractor concentration index (HHI) and cross-checks blacklists (`VEN-CONC-001`, `VEN-SHELL-002`).
* **Geographic Layer**: PostGIS spatial queries check proximity to existing completed projects (<25m) to catch ghost asset billing (`GEO-DUP-001`).
* **Document OCR Layer**: Parses scanned invoice metadata against sanctioned ceilings and checks invoice dates (`DOC-MIS-001`, `DOC-DATE-002`).
* **Duplicate Layer**: Computes semantic token similarity and budget matching across local scheme archives (`DUP-SIM-001`).

### 2.3 Grounded Groq AI Integration
* **Edge Function Proxy**: `supabase/functions/sentinel-ai/index.ts` safely passes queries to Groq without exposing API keys in client bundles.
* **Context Grounding**: Structured JSON containing only relevant vouchers, timeline dates, and spatial points.
* **Anti-Hallucination & Anti-Accusatory Guardrails**: Neutralizes prompt injection commands and transforms defamatory phrases into evidence-grounded risk indicators.

### 2.4 Governance & Auditability
* **Tamper-Evident Ledger**: Append-only audit log with SHA-256 hash chaining and strict database triggers preventing updates or deletions.
* **Role-Based Access Control**: 6 roles (`SUPER_ADMIN`, `STATE_ADMIN`, `DISTRICT_OFFICER`, `MP_USER`, `AUDITOR`, `VIEWER`) enforced via Supabase Row Level Security.
