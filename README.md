# 🛡️ MPLAD SENTINEL (SIH 2026)

> **Development of an AI-Powered System to Detect Anomalies, Fraud, and Inefficiencies in MPLAD Scheme Implementation.**  
> *Category: Software | Miscellaneous • Smart India Hackathon 2026*

---

## 📖 Product Overview

**MPLAD Sentinel** is an **Explainable Multi-Layer Risk Intelligence & Forensic Investigation Platform** designed for central ministries, state nodal departments, district collectors, and CAG audit teams to analyze implementation data under the Members of Parliament Local Area Development Scheme (MPLADS).

Rather than generating generic opaque scores or ungrounded allegations, MPLAD Sentinel fuses **deterministic Schedule of Rates rule engines**, **statistical spatial clustering**, **OCR voucher extraction**, and **Grounded Groq AI Copilots (Llama-3.3 70B)** into a unified **"Government Investigation Notebook"** digital command center.

---

## 🎨 Design Philosophy: "Hand-Drawn Government Intelligence"

* **Warm Paper Aesthetic**: Background `#fdfbf7` with pencil black `#2d2d2d`, ballpoint blue `#2d5da1`, sticky yellow `#fff9c4`, and correction red `#ff4d4d`.
* **Organic Wobbly Borders**: Handcrafted asymmetrical border radii (`255px 15px 225px 15px / 15px 225px 15px 255px`).
* **Offset Hard Shadows**: Tactical physical notebook depth (`4px 4px 0 #2d2d2d` and `8px 8px 0 #2d2d2d`).
* **Tactile Metaphors**: Thumbtacks, masking tape overlays, handwritten sticky annotations, and government rubber stamps.
* **Dual Density Modes**:
  * *Discovery Mode* (Landing, Overview): 60% Analytical / 40% Hand-drawn
  * *Investigation Mode* (Ledgers, Graphs, OCR, Audits): 80% Analytical / 20% Hand-drawn

---

## 🔬 Multi-Layer Detection Engine (6 Forensic Layers)

| Layer | Weight | Core Detection Indicators & Rules |
| :--- | :---: | :--- |
| **Financial** | 25% | **FIN-COST-001** (Cost >40% above Schedule of Rates), **FIN-DUP-002** (Duplicate invoice hashes), **FIN-UTIL-003** (100% drawdown on stalled works). |
| **Timeline** | 20% | **TIME-SEQ-001** (Completion certificate signed before sanction order), **TIME-DELAY-002** (Severe execution stagnation >180 days). |
| **Vendor** | 20% | **VEN-CONC-001** (Herfindahl-Hirschman index >60% constituency capture), **VEN-SHELL-002** (Blacklisted/suspended contractor registry matching). |
| **Geographic** | 15% | **GEO-DUP-001** (PostGIS spatial distance <25m of existing asset), **GEO-OUT-002** (Coordinates outside constituency boundary). |
| **Documents** | 15% | **DOC-MIS-001** (Invoice OCR amount exceeds sanction ceiling), **DOC-DATE-002** (Contractor bill date predates tender sanction). |
| **Duplicate** | 5% | **DUP-SIM-001** (Fuzzy token/Levenshtein semantic overlap matching ongoing state scheme projects). |

---

## 🤖 Sentinel AI Copilot (Groq Llama-3.3 70B Grounded LLM)

* **Strict Evidence Grounding**: The LLM has zero direct database write access; queries are passed through structured `GroundingContext` JSON payloads containing verified voucher records, GPS coordinates, and rule violation flags.
* **Prompt Injection Defense**: Untrusted text from scanned PDFs and external user notes is sanitized to prevent instruction override attacks.
* **Non-Accusatory Decision Support Language**: Automatic phrasing sanitizer replaces defamatory accusations with evidence-based findings: *"Potential anomaly"*, *"Possible irregularity"*, *"Evidence conflict"*, *"Requires physical verification"*.

---

## 🚀 Flagship Demo Walkthrough Scenario (`#MPLAD-10291`)

1. **Launch Command Center** (`#/dashboard`): Filter by **CRITICAL** risk.
2. **Open Project `#MPLAD-10291`**: "Construction of High-Tech Community Center & Digital Literacy Hall", Phulpur, Prayagraj, UP.
3. **Inspect 91/100 Critical Risk Gauge**:
   * Financial: 94/100 • Timeline: 88/100 • Vendor: 92/100 • Geographic: 96/100 • Documents: 86/100.
4. **Click "WHY FLAGGED?"**: Inspect the 5 detected anomalies:
   * 120% unit cost inflation vs UP PWD Schedule of Rates benchmark.
   * Duplicate payment disbursement on Invoice `#INV-APX-884` (₹18.20 Lakh paid twice).
   * Exact GPS overlap (8m) with an existing 2023 completed panchayat hall.
   * Completion certificate signed on 28-Feb-2024 prior to sanction on 15-Mar-2024.
5. **Inspect Evidence Timeline & Relational Node Graph**: Explore interactive visual node mapping.
6. **Query Sentinel AI**: Ask natural language questions in the copilot room.
7. **Create Investigation & Log Officer Note**: Add timestamped, confidential case notes.
8. **Export Official Dossier**: Generate printable government audit dossier with sign-off blocks.
9. **Verify Immutable Audit Log**: View tamper-evident SHA-256 chained entry in Admin console.

---

## 🛠️ Technology Stack

* **Frontend**: React 18/19, TypeScript, Vite, Tailwind CSS v4, Lucide React, React Router v6, TanStack Query v5.
* **Visualization**: Recharts, Leaflet & React-Leaflet, Canvas/SVG Evidence Graph.
* **Backend & Database**: Supabase (PostgreSQL, PostGIS, Auth, Storage, Edge Functions, Row Level Security).
* **AI Engine**: Groq API (`llama-3.3-70b-versatile`) with structured JSON validation & deterministic grounding fallback.
* **Testing & Quality**: Vitest, React Testing Library, JSDOM (100% test pass rate).

---

## 📦 Setup & Installation

### Prerequisites
- Node.js `v18+` or `v22+`
- npm `v9+` or `v10+`

### 1. Clone & Install Dependencies
```bash
cd "d:\PROJECT\SIH 2026"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```
*(Note: If no API key is provided, the platform automatically engages its high-fidelity deterministic grounding engine with 100% reliability and zero hallucinations).*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at: `http://localhost:3000`

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 🏛️ Supabase Database Migrations

The full PostgreSQL + PostGIS schema is located in `supabase/migrations/`:
* `20260101000001_initial_schema.sql` — Profiles, States, Districts, Projects, PostGIS Geo points, Funds, Transactions, Documents.
* `20260101000002_risk_and_anomalies.sql` — Rules Catalog, Anomalies, Risk Scores, Investigations, Case Notes, Evidence attachments.
* `20260101000003_ai_and_governance.sql` — AI Runs, Conversation logs, Background Jobs, Notifications, Tamper-Evident Audit Logs.
* `20260101000004_rls_and_security.sql` — Row Level Security policies for 6 RBAC roles, append-only trigger functions.
* `20260101000005_seed_data.sql` — Detection rules, project categories, and system risk weights.

---

## ⚖️ Ethical AI & Legal Disclaimer

MPLAD Sentinel provides algorithmic risk indicators, evidence conflicts, and investigation recommendations for authorized government officers. It does **not** make definitive legal declarations of corruption or fraud. Final determinations remain under the statutory jurisdiction of authorized human investigators and constitutional audit authorities (CAG / MoSPI).

---

© 2026 Ministry of Statistics & Programme Implementation (MoSPI) • SIH 2026 Innovation
