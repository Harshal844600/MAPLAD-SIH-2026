# 🏛️ MPLAD SENTINEL — SYSTEM ARCHITECTURE SPECIFICATION

> **Explainable Multi-Layer Forensic Risk Intelligence & Governance Platform**  
> *Smart India Hackathon (SIH 2026)*

---

## 1. Complete System Architecture Diagram

```mermaid
graph TB
    %% STYLING DEFINITIONS
    classDef client fill:#251E19,stroke:#C9A962,stroke-width:2px,color:#E8DFD4;
    classDef service fill:#1C1714,stroke:#4A3F35,stroke-width:1.5px,color:#E8DFD4;
    classDef engine fill:#2A1D1A,stroke:#8B2635,stroke-width:2px,color:#fca5a5;
    classDef ai fill:#2E2620,stroke:#C9A962,stroke-width:2px,color:#C9A962;
    classDef cloud fill:#15110E,stroke:#3b82f6,stroke-width:2px,color:#93c5fd;
    classDef sec fill:#1C1714,stroke:#10b981,stroke-width:2px,color:#6ee7b7;

    %% 1. PRESENTATION LAYER
    subgraph UI ["🖥️ PRESENTATION & UI LAYER (React 19 + TypeScript + Vite)"]
        A1["🏛️ Command Center Dashboard"]:::client
        A2["📁 Project Archive Ledger"]:::client
        A3["🕸️ Interactive Evidence Graph"]:::client
        A4["🗺️ PostGIS Geospatial Asset Map"]:::client
        A5["📄 Document OCR Inspector"]:::client
        A6["🤖 Sentinel AI Copilot Room"]:::client
        A7["⚖️ Archive Governance & Audits"]:::client
    end

    %% 2. SECURITY & RBAC LAYER
    subgraph RBAC ["🔒 GOVERNANCE & ACCESS CONTROL (6-Tier RBAC)"]
        B1["🛡️ RoleGuard & Route Clearance Filter"]:::sec
        B2["👤 Active Profile: SUPER_ADMIN | STATE_ADMIN | DISTRICT_OFFICER | MP_USER | AUDITOR | VIEWER"]:::sec
    end

    %% 3. APPLICATION SERVICES LAYER
    subgraph APP ["⚙️ CLIENT REPOSITORY & CONTROLLER LAYER"]
        C1["📦 Central AppStore (Reactive Subscription State)"]:::service
        C2["📊 Dynamic KPI & Statistics Aggregator"]:::service
        C3["🗂️ Case Notes & Investigation Tracker"]:::service
    end

    %% 4. 6-LAYER FORENSIC DETECTION ENGINE
    subgraph ENGINE ["🔬 6-LAYER FORENSIC ANOMALY DETECTION ENGINE"]
        D1["💰 1. Financial Layer (25%)\n• Cost vs PWD SoR Benchmark (>40%)\n• Duplicate Invoice Payment Hashes"]:::engine
        D2["⏳ 2. Timeline Layer (20%)\n• Chronology Inversions (Completion before Sanction)\n• Execution Stagnation (>180 Days)"]:::engine
        D3["🏢 3. Vendor Layer (20%)\n• Herfindahl-Hirschman Index (HHI >60%)\n• National Blacklist & Shell Cross-Check"]:::engine
        D4["📍 4. Geographic Layer (15%)\n• PostGIS Proximity Match (<25m)\n• Out-of-Constituency Geo-Fence"]:::engine
        D5["📄 5. Document OCR Layer (15%)\n• Extracted Bill vs Sanction Ceiling\n• Invoice Date Predates Tender Date"]:::engine
        D6["🔁 6. Duplication Layer (5%)\n• Levenshtein Title Token Matching\n• State Scheme (PMGSY) Cross-Lookup"]:::engine
        D7["🧮 Composite Risk Score Multiplier (0 - 100 Gauge)"]:::engine
    end

    %% 5. AI INTELLIGENCE LAYER
    subgraph AI ["🤖 SENTINEL AI ENGINE (Groq Cloud)"]
        E1["📦 Context Builder (Vouchers, GPS, Timeline JSON Payload)"]:::ai
        E2["🛡️ Prompt Injection Sanitizer (Zero-DB Direct Access)"]:::ai
        E3["⚡ Groq API Gateway (Llama-3.3-70B-Versatile ~800ms)"]:::ai
        E4["⚖️ Anti-Defamation Phrasing Filter (CAG/MoSPI Compliant)"]:::ai
        E5["🔄 Deterministic Fallback Engine (Offline Resilience)"]:::ai
    end

    %% 6. CLOUD BACKEND & DATABASE
    subgraph CLOUD ["☁️ MANAGED BACKEND (Supabase Cloud — Zero Docker)"]
        F1[("🐘 PostgreSQL 15 Managed DB")]:::cloud
        F2["🗺️ PostGIS 3.4 Spatial Extensions"]:::cloud
        F3["🔒 Row-Level Security (RLS Geographic & Role Policies)"]:::cloud
        F4["🔗 SHA-256 Tamper-Evident Chained Audit Log"]:::cloud
        F5["📦 Storage Buckets (Scanned Vouchers & Signed Dossiers)"]:::cloud
    end

    %% CONNECTIONS
    UI --> B1 --> B2 --> APP
    APP --> ENGINE
    D1 & D2 & D3 & D4 & D5 & D6 --> D7 --> APP
    
    APP --> E1 --> E2 --> E3 --> E4 --> UI
    E3 -.->|Timeout / Offline| E5 --> UI
    
    APP <===>|Supabase JS Client| F1
    F1 --- F2 & F3 & F4 & F5
```

---

## 2. Layer-by-Layer Architectural Breakdown

### 🖥️ Layer 1: Presentation & Design System
* **Framework**: React 19, TypeScript, Vite, Tailwind CSS v4.
* **Aesthetics**: "Government Investigation Notebook" with rich dark mode, warm paper tones, brass glowing accents, and tactile physical dossier cards.
* **Visualizations**: 
  - Leaflet / OpenStreetMap for PostGIS spatial clustering.
  - Interactive SVG Relational Evidence Graph.
  - Recharts for financial and risk distribution analytics.

---

### 🔒 Layer 2: 6-Tier Role-Based Access Control (RBAC)
* **Clearance Levels**:
  - `SUPER_ADMIN` (MoSPI National Admin): Full supervisory access, risk weight calibration.
  - `STATE_ADMIN` (State Nodal Dept): State-wide analytics, project ledger.
  - `DISTRICT_OFFICER` (District Magistrate): Local site verification, voucher approval, field notes.
  - `MP_USER` (Member of Parliament): Constituency progress, AI synthesis queries.
  - `AUDITOR` (CAG of India): Independent forensic audits, dossier sign-offs.
  - `VIEWER` (Citizen): Public transparency portal (read-only).
* **Enforcement**: Frontend `RoleGuard` + Dynamic Navigation Filtering + Database PostgreSQL Row-Level Security (RLS).

---

### 🔬 Layer 3: 6-Layer Forensic Anomaly Engine
* **Deterministic Precision**: Operates on verified administrative data with explicit rule IDs (e.g., `FIN-COST-001`, `TIME-SEQ-001`, `GEO-DUP-001`).
* **Weighted Aggregator**:
  $$\text{Composite Risk} = 0.25(\text{Fin}) + 0.20(\text{Time}) + 0.20(\text{Ven}) + 0.15(\text{Geo}) + 0.15(\text{Doc}) + 0.05(\text{Dup})$$

---

### 🤖 Layer 4: Grounded Sentinel AI Copilot (Groq Llama-3.3 70B)
* **Zero-Hallucination Grounding**: Operates strictly on structured `GroundingContext` JSON payloads containing only documented facts.
* **Security Guardrails**:
  - `sanitizeUntrustedText`: Neutralizes prompt injection attempts from OCR inputs.
  - `enforceSafetyLanguage`: Transforms raw accusations into objective, legally defensible audit observations (*"Evidence conflict observed"* rather than defamatory claims).

---

### ☁️ Layer 5: Cloud Backend & Storage (Supabase Cloud)
* **PostgreSQL + PostGIS**: High-speed spatial queries (`ST_DWithin`) to detect physical asset overlaps within 25 meters.
* **Immutable Audit Trail**: Append-only PostgreSQL triggers enforcing SHA-256 cryptographic hash-chaining on every record change.
* **Serverless Scale**: Zero local Docker daemons required; connects instantly via HTTPS/WSS endpoints.
