# ☁️ Supabase Cloud (Zero Docker) Quick-Start Guide

Follow these 3 simple steps to connect **MPLAD Sentinel** directly to a live **Supabase Cloud** backend without installing Docker, WSL, or local PostgreSQL.

---

## 📋 Step 1: Create a Free Supabase Cloud Project

1. Navigate to **[https://supabase.com](https://supabase.com)** and sign in (or create a free account).
2. Click **New Project**.
3. Choose your Organization, set:
   - **Name**: `mplad-sentinel`
   - **Database Password**: *(save this securely)*
   - **Region**: `Mumbai (ap-south-1)` (or closest region)
   - **Pricing Plan**: Free ($0/month)
4. Click **Create new project** (takes ~60 seconds to provision).

---

## 🗄️ Step 2: Apply Database Schema & Demo Seed Data

1. In your Supabase Dashboard sidebar, click the **SQL Editor** tab (`>_`).
2. Click **+ New Query**.
3. Open the file [`supabase/full_schema_and_seed.sql`](file:///d:/PROJECT/SIH%202026/supabase/full_schema_and_seed.sql) in this repository.
4. Copy the entire file content, paste it into the Supabase SQL Editor, and click the green **Run** button.
5. You should see `Success. No rows returned` in the results pane.

*This script automatically sets up:*
- PostGIS 3.4 spatial extensions
- Complete tables: `profiles`, `states`, `districts`, `projects`, `transactions`, `documents`, `anomalies`, `investigations`, `case_notes`, `audit_logs`, `detection_rules`
- Row-Level Security (RLS) policies for 6 roles
- Append-only anti-tamper SHA-256 hash trigger functions
- Seeded detection rule weights and flagship demo project (`#MPLAD-10291`)

---

## 🔑 Step 3: Configure Environment Variables

1. In your Supabase Dashboard, go to **Project Settings (⚙️ icon at bottom left)** → **API**.
2. Copy:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **Project API Keys → `anon` `public`** (e.g. `eyJhbGciOi...`)
3. Open or create the [`.env`](file:///d:/PROJECT/SIH%202026/.env) file in your local project directory `d:\PROJECT\SIH 2026`:

```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Groq AI API Key for live Llama-3.3-70B copilot investigations
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🚀 Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000/#/administration](http://localhost:3000/#/administration) and switch to the **"SYSTEM HEALTH & SERVICES"** tab to see your live **Supabase Cloud** connection and real-time latency ping!
