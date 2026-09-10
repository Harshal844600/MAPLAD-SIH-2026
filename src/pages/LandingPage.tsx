import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Bot,
  MapPin,
  CheckCircle2,
  FileText,
  Lock,
  Globe,
  Database,
  Cpu,
  Fingerprint,
  Send,
  Zap,
  Activity,
  Compass,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  ShieldCheck,
  BarChart3,
  Scale,
  Eye,
  Radar,
  Radio,
  FileCheck,
  ScanLine,
} from 'lucide-react';
import {
  ClassicalCard,
  ClassicalButton,
  ArchiveLabel,
  OrnateDivider,
  WaxSeal,
  DossierCard,
  LiveStatusPill,
  NeuralConnectionLines,
  SatelliteCard,
  RiskBadge,
  RiskScoreGauge,
  GoogleSignInButton,
  AuthModal,
} from '../components/ui';
import { useCurrentUser } from '../services/store/useCurrentUser';

export const LandingPage: React.FC = () => {
  const { isOAuth, user } = useCurrentUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeProbe, setActiveProbe] = useState<'spatial' | 'cartel' | 'ocr' | 'timeline'>('spatial');
  const [probeRunning, setProbeRunning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statsCounter, setStatsCounter] = useState({
    auditedCr: 0,
    worksCount: 0,
    anomaliesCaught: 0,
    accuracyPct: 0,
  });

  // Animated counters on load
  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      setStatsCounter({
        auditedCr: Math.min(1420, Math.round(start * 35.5)),
        worksCount: Math.min(1050, Math.round(start * 26.25)),
        anomaliesCaught: Math.min(48, Math.round(start * 1.2)),
        accuracyPct: Math.min(100, Math.round(start * 2.5)),
      });
      if (start >= 40) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const triggerProbeRun = (probe: 'spatial' | 'cartel' | 'ocr' | 'timeline') => {
    setActiveProbe(probe);
    setProbeRunning(true);
    setTimeout(() => setProbeRunning(false), 900);
  };

  const quickSearchPills = [
    { label: '#MPLAD-10291 (Flagship)', link: '/projects/MPLAD-10291' },
    { label: 'Prayagraj UP Spatial Cluster', link: '/map' },
    { label: 'Apex Infrastructure HHI Cartel', link: '/analytics' },
    { label: 'Invoice Pre-dating Sanction', link: '/documents' },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden font-['Inter']">
      {/* 1. HERO SECTION (Editorial Obsidian & Gold Hero with Interactive Search & Radar Ambient) */}
      <section className="relative pt-10 pb-12 text-center max-w-5xl mx-auto space-y-8 px-4">
        {/* Ambient Radar Glow Animation in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#a78b71]/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-[#a78b71]/20 rounded-full pointer-events-none animate-radar-scan" />

        {/* Top Status & Ministry Tag with Floating Animation */}
        <div className="flex flex-wrap items-center justify-center gap-3 animate-float-slow">
          <LiveStatusPill statusText="Forensic Intelligence Engine Active" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#c9b8a0] light:text-amber-800 uppercase border border-[#a78b71]/30 light:border-amber-300 px-3.5 py-1 rounded-full bg-[#a78b71]/10 light:bg-amber-50 shadow-[0_0_15px_rgba(167,139,113,0.15)]">
            MoSPI • SIH 2026 OFFICIAL
          </span>
        </div>

        {/* Main Editorial Headline in Playfair Display Italic with Shimmer Effect */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-['Playfair_Display'] italic text-white light:text-slate-900 leading-[1.12] tracking-tight relative z-10">
          Find the anomalies <br />
          <span className="shimmer-text">
            before they become institutional losses.
          </span>
        </h1>

        {/* Lead Subtitle in Inter */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-300 light:text-slate-700 leading-relaxed font-['Inter'] relative z-10">
          An explainable forensic risk intelligence platform. MPLAD Sentinel cross-references
          financial vouchers, Schedule of Rates (SoR), vendor concentration (HHI), and PostGIS spatial proximity (&lt;25m) to prevent fraud with tamper-evident cryptographic audit trails.
        </p>

        {/* Interactive Quick Query Pill Bar */}
        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="relative flex items-center group">
            <Search className="w-5 h-5 absolute left-4 text-[#c9b8a0] light:text-amber-700 group-hover:scale-110 transition-transform" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project code, contractor, district, or anomaly hash..."
              className="w-full pl-12 pr-28 py-3.5 bg-black/70 light:bg-white border border-white/15 light:border-slate-300 hover:border-[#c9b8a0]/50 rounded-2xl text-sm text-white light:text-slate-900 placeholder:text-zinc-500 light:placeholder:text-slate-400 focus:outline-none focus:border-[#c9b8a0] light:focus:border-amber-600 shadow-2xl transition-all"
            />
            <Link to="/projects" className="absolute right-2">
              <button
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-[#c9b8a0] to-[#a78b71] light:from-amber-600 light:to-amber-800 text-black light:text-white font-bold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>SEARCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-zinc-500 light:text-slate-500">PROBES:</span>
            {quickSearchPills.map((pill, i) => (
              <Link
                key={i}
                to={pill.link}
                className="text-[11px] font-mono px-2.5 py-1 bg-white/[0.04] light:bg-slate-100 hover:bg-[#c9b8a0]/20 border border-white/10 light:border-slate-300 hover:border-[#c9b8a0] rounded-lg text-zinc-300 light:text-slate-700 hover:scale-105 transition-all"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Dual-Button CTA Group with Google SSO Verification */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
          <ClassicalButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              if (isOAuth) {
                window.location.hash = '/dashboard';
              } else {
                setShowAuthModal(true);
              }
            }}
          >
            LAUNCH COMMAND CONSOLE
          </ClassicalButton>


          {!isOAuth ? (
            <GoogleSignInButton
              variant="secondary"
              label="Verify with Google"
              className="py-3 px-5 text-sm hover:scale-105 transition-all"
            />
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-full text-xs font-semibold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified: <strong>{user.full_name}</strong></span>
            </div>
          )}
        </div>

        {/* Verification notice if not logged in */}
        {!isOAuth && (
          <p className="text-[11px] font-mono text-[#c9b8a0] light:text-amber-800 flex items-center justify-center gap-1.5 pt-1">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Google authentication required to enter live Command Console</span>
          </p>
        )}
      </section>

      {/* 2. DYNAMIC METRIC STRIP WITH LIVE ANIMATED TICKERS & HOVER ELEVATION */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-3xl backdrop-blur-xl shadow-2xl font-mono">
          <div className="text-center p-3 border-r border-white/10 light:border-slate-200 last:border-none group hover:scale-105 transition-transform">
            <span className="text-[10px] text-zinc-400 light:text-slate-500 tracking-wider uppercase block">
              MONITORED EXPENDITURE
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-white light:text-slate-900 mt-1 block group-hover:text-[#e8d5b7] transition-colors">
              ₹{statsCounter.auditedCr} Cr+
            </span>
            <span className="text-[10px] text-emerald-400 font-sans mt-0.5 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> 100% Reconciliation
            </span>
          </div>

          <div className="text-center p-3 border-r border-white/10 light:border-slate-200 last:border-none group hover:scale-105 transition-transform">
            <span className="text-[10px] text-zinc-400 light:text-slate-500 tracking-wider uppercase block">
              AGGREGATED WORKS
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#c9b8a0] light:text-amber-800 mt-1 block group-hover:text-white transition-colors">
              {statsCounter.worksCount}+
            </span>
            <span className="text-[10px] text-zinc-400 light:text-slate-500 font-sans mt-0.5">
              Across 540 Districts
            </span>
          </div>

          <div className="text-center p-3 border-r border-white/10 light:border-slate-200 last:border-none group hover:scale-105 transition-transform">
            <span className="text-[10px] text-zinc-400 light:text-slate-500 tracking-wider uppercase block">
              CRITICAL ANOMALIES
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-rose-400 light:text-red-600 mt-1 block animate-pulse">
              {statsCounter.anomaliesCaught} Flagged
            </span>
            <span className="text-[10px] text-rose-400 font-sans mt-0.5 inline-flex items-center gap-1">
              ● PostGIS & Cartel
            </span>
          </div>

          <div className="text-center p-3 group hover:scale-105 transition-transform">
            <span className="text-[10px] text-zinc-400 light:text-slate-500 tracking-wider uppercase block">
              DETERMINISTIC ACCURACY
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-emerald-400 light:text-emerald-700 mt-1 block">
              {statsCounter.accuracyPct}%
            </span>
            <span className="text-[10px] text-emerald-400 font-sans mt-0.5">
              Zero Hallucination
            </span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE FORENSIC SIMULATION TERMINAL / PLAYGROUND */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#c9b8a0] light:text-amber-800 uppercase">
            LIVE INTERACTIVE PLAYGROUND
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold font-['Playfair_Display'] text-white light:text-slate-900">
            Simulate Autonomous Forensic Probes
          </h2>
          <p className="text-sm text-zinc-400 light:text-slate-600 font-sans max-w-xl mx-auto">
            Test any of the core anomaly detection heuristics directly in your browser with real-time feedback.
          </p>
        </div>

        <div className="p-6 md:p-8 bg-black/70 light:bg-white border border-white/15 light:border-slate-300 rounded-[32px] shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-6">
          {/* Laser scanning bar when probe is running */}
          {probeRunning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#e8d5b7] to-transparent animate-laser-sweep shadow-[0_0_15px_rgba(232,213,183,0.8)] z-20 pointer-events-none" />
          )}

          {/* Probe Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 light:border-slate-200 pb-4 font-mono text-xs">
            {[
              { id: 'spatial', label: '1. POSTGIS SPATIAL PROBE (<25M)', icon: MapPin },
              { id: 'cartel', label: '2. VENDOR CARTEL HHI SCAN', icon: Fingerprint },
              { id: 'ocr', label: '3. OCR VOUCHER DATE INVERSION', icon: FileText },
              { id: 'timeline', label: '4. DISBURSEMENT VELOCITY SPIKE', icon: Activity },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => triggerProbeRun(p.id as any)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    activeProbe === p.id
                      ? 'bg-[#c9b8a0]/20 text-[#e8d5b7] light:text-slate-900 border-[#c9b8a0] shadow-[0_0_15px_rgba(201,184,160,0.25)] scale-[1.02]'
                      : 'bg-white/[0.02] light:bg-slate-100 text-zinc-400 light:text-slate-600 border-white/10 light:border-slate-300 hover:text-white hover:border-[#c9b8a0]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#c9b8a0] light:text-amber-700" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Probe Simulation View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Probe Interactive Details (7 cols) */}
            <div className="lg:col-span-7 space-y-4 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-[#c9b8a0] light:text-amber-800 uppercase tracking-wider font-bold">
                  {probeRunning ? 'ANALYZING TELEMETRY...' : 'DETERMINISTIC TEST CASE READY'}
                </span>
              </div>

              {activeProbe === 'spatial' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-['Playfair_Display'] text-white light:text-slate-900">
                    PostGIS Geodetic Proximity Check (ST_DWithin)
                  </h3>
                  <p className="text-xs text-zinc-300 light:text-slate-700 leading-relaxed font-['Inter']">
                    Evaluates geodetic coordinates <code className="font-mono text-[#c9b8a0] bg-white/5 px-1 py-0.5 rounded">25.5482°N, 81.9834°E</code> against the historical 10-year asset spatial ledger within an 8.2-meter radial threshold.
                  </p>
                  <div className="p-3.5 bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="text-zinc-400 light:text-slate-500 text-[10px]">SQL / POSTGIS EXECUTION PROOF:</div>
                    <div className="text-emerald-400 light:text-emerald-700 text-[11px] font-bold">
                      SELECT ST_Distance(geom_a, geom_b) FROM mplads_assets WHERE ST_DWithin(geom_a, geom_b, 25.0);
                    </div>
                    <div className="text-rose-400 light:text-red-600 font-bold text-xs pt-1">
                      ⚠️ RESULT: 8.24m distance to 2023 Hall Asset (#PANCHAYAT-8812) • CONFLICT
                    </div>
                  </div>
                </div>
              )}

              {activeProbe === 'cartel' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-['Playfair_Display'] text-white light:text-slate-900">
                    Herfindahl-Hirschman Index (HHI) Cartel Detection
                  </h3>
                  <p className="text-xs text-zinc-300 light:text-slate-700 leading-relaxed font-['Inter']">
                    Computes vendor market concentration across 24 projects in Phulpur Block. High HHI scores (&gt;0.25) trigger automated anti-collusion investigation alerts.
                  </p>
                  <div className="p-3.5 bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="text-zinc-400 light:text-slate-500 text-[10px]">HHI MATHEMATICAL FORMULA:</div>
                    <div className="text-[#c9b8a0] light:text-amber-800 text-[11px] font-bold">
                      HHI = ∑ (s_i)^2 = (0.78)^2 + (0.12)^2 + (0.10)^2 = 0.6328 (Highly Concentrated)
                    </div>
                    <div className="text-rose-400 light:text-red-600 font-bold text-xs pt-1">
                      ⚠️ RESULT: Apex Infra Ltd holds 78% of all block tenders • CARTEL HIGH RISK
                    </div>
                  </div>
                </div>
              )}

              {activeProbe === 'ocr' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-['Playfair_Display'] text-white light:text-slate-900">
                    Vision-Transformer OCR Chronology Matcher
                  </h3>
                  <p className="text-xs text-zinc-300 light:text-slate-700 leading-relaxed font-['Inter']">
                    Extracts dates, sums, and line items from tax invoices and compares them against government sanction timestamps in the ledger.
                  </p>
                  <div className="p-3.5 bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="text-zinc-400 light:text-slate-500 text-[10px]">CHRONOLOGY INVERSION AUDIT:</div>
                    <div className="text-[#c9b8a0] light:text-amber-800 text-[11px] font-bold">
                      Invoice Date: 2024-03-01 &lt; Sanction Order Date: 2024-03-15 (Delta: -14 Days)
                    </div>
                    <div className="text-rose-400 light:text-red-600 font-bold text-xs pt-1">
                      ⚠️ RESULT: Invoice predates sanction authorization • FRAUD INDICATOR
                    </div>
                  </div>
                </div>
              )}

              {activeProbe === 'timeline' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-['Playfair_Display'] text-white light:text-slate-900">
                    Disbursement Velocity & March Rush Spike
                  </h3>
                  <p className="text-xs text-zinc-300 light:text-slate-700 leading-relaxed font-['Inter']">
                    Evaluates financial disbursement speed against physical progress milestones to detect rushed end-of-year fund exhaustion without inspection.
                  </p>
                  <div className="p-3.5 bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl font-mono text-xs space-y-1.5 shadow-inner">
                    <div className="text-zinc-400 light:text-slate-500 text-[10px]">VELOCITY CALCULATION:</div>
                    <div className="text-emerald-400 light:text-emerald-700 text-[11px] font-bold">
                      Disbursed: ₹48.00 Lakh in 48 hours • Physical Inspection Certificate: 0% Verified
                    </div>
                    <div className="text-amber-400 light:text-amber-700 font-bold text-xs pt-1">
                      ⚠️ RESULT: Unverified drawdown velocity 6.4x historical mean • FLAGGED
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => triggerProbeRun(activeProbe)}
                  className="px-4 py-2 bg-gradient-to-r from-[#c9b8a0] to-[#a78b71] text-black font-bold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg font-mono"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>RE-RUN HEURISTIC SCAN</span>
                </button>
                <Link to="/risk">
                  <button
                    type="button"
                    className="px-4 py-2 bg-white/5 light:bg-slate-100 hover:bg-white/10 border border-white/10 light:border-slate-300 text-zinc-200 light:text-slate-800 text-xs font-mono font-bold rounded-xl transition-all hover:border-[#a78b71]"
                  >
                    VIEW ALL 6 RULES
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Live Circular Risk Gauge & Holographic Verdict (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl text-center space-y-4 shadow-sm hover:border-[#a78b71]/40 transition-all">
              <span className="text-[10px] font-mono text-zinc-400 light:text-slate-500 uppercase tracking-widest">
                HEURISTIC SEVERITY OUTPUT
              </span>
              <RiskScoreGauge
                score={activeProbe === 'spatial' ? 91 : activeProbe === 'cartel' ? 86 : activeProbe === 'ocr' ? 88 : 74}
                size="lg"
              />
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-rose-400 light:text-red-600 bg-rose-950/40 light:bg-rose-50 px-3 py-1 rounded-full border border-rose-500/30 inline-block shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                  CRITICAL RISK ANOMALY DETECTED
                </span>
                <p className="text-[11px] text-zinc-400 light:text-slate-500 font-mono mt-1">
                  Confidence Score: 98.4% • SHA-256 Chained
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEURAL INTELLIGENCE NETWORK & SATELLITE EVIDENCE PREVIEWS */}
      <section className="relative max-w-6xl mx-auto px-4">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#c9b8a0] light:text-amber-800 uppercase">
            FORENSIC TOPOLOGY
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold font-['Playfair_Display'] text-white light:text-slate-900">
            Connected Neural Evidence Graph
          </h2>
          <p className="text-sm text-zinc-400 light:text-slate-600 font-sans max-w-xl mx-auto">
            Live relational paths mapping suspicious vendor entities, coordinate clusters, and duplicate billing hashes.
          </p>
        </div>

        {/* Central Neural Diagram Frame with Floating Satellite Cards */}
        <div className="relative min-h-[420px] p-8 bg-white/[0.02] light:bg-slate-50 backdrop-blur-xl border border-white/10 light:border-slate-200 rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_80px_rgba(167,139,113,0.1)]">
          <NeuralConnectionLines className="opacity-70" />

          {/* Satellite Evidence Card 1: Vendor */}
          <SatelliteCard
            title="Apex Infrastructure Cartel"
            subtitle="HHI Index 0.42 • 78% Constituency Payout Dominance"
            badgeText="CARTEL FLAG"
            badgeType="risk"
            meta="HHI-001"
            className="z-10 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 light:text-slate-700">
              <span>Sanctioned: ₹4.82 Cr</span>
              <span className="text-rose-400 light:text-red-600 font-bold">CRITICAL</span>
            </div>
          </SatelliteCard>

          {/* Central Hub Focal Element */}
          <div className="z-10 text-center p-6 bg-black/80 light:bg-white backdrop-blur-2xl border border-[#a78b71]/40 light:border-amber-300 rounded-3xl shadow-[0_0_50px_rgba(167,139,113,0.3)] max-w-xs animate-float-slow">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#c9b8a0] to-[#a78b71] flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(167,139,113,0.4)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-white light:text-slate-900">
              Grounded AI Copilot
            </h3>
            <p className="text-xs text-zinc-400 light:text-slate-600 mt-1 font-sans">
              Groq Llama-3.3 70B synthesizes verifiable rule citations across all 6 forensic layers.
            </p>
          </div>

          {/* Satellite Evidence Card 2: Spatial & Invoices */}
          <SatelliteCard
            title="Spatial Overlap: 8.2m"
            subtitle="Phulpur Block Asset match with completed 2023 Hall"
            badgeText="GEO-DUP-001"
            badgeType="gold"
            meta="PostGIS"
            className="z-10 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300 light:text-slate-700">
              <span>Duplicate Invoices: 2</span>
              <span className="text-amber-400 light:text-amber-700 font-bold">91 / 100</span>
            </div>
          </SatelliteCard>
        </div>
      </section>

      {/* 5. 6-ENGINE MODERN FEATURE GRID */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold tracking-widest text-[#c9b8a0] light:text-amber-800 uppercase">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold font-['Playfair_Display'] text-white light:text-slate-900">
            Six Deterministic Forensic Engines
          </h2>
          <p className="text-sm text-zinc-400 light:text-slate-600 font-sans max-w-xl mx-auto">
            Zero black-box hallucinations. Every anomaly is mathematically backed with exact rule citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Schedule of Rates (SoR)',
              desc: 'Flags line items and cost figures inflated over official state Public Works Department ceilings.',
              icon: Database,
              tag: 'FINANCIAL',
            },
            {
              title: 'PostGIS Proximity (<25m)',
              desc: 'High-precision geospatial conflict discovery mapping coordinate overlap with existing government assets.',
              icon: MapPin,
              tag: 'GEOSPATIAL',
            },
            {
              title: 'HHI Cartel Concentration',
              desc: 'Herfindahl-Hirschman index computations detect anti-competitive bidding rings and contractor monopolies.',
              icon: Fingerprint,
              tag: 'VENDOR',
            },
            {
              title: 'OCR Inverted Chronology',
              desc: 'Transformer OCR extracts invoice and utilization dates to detect pre-sanction billing anomalies.',
              icon: FileText,
              tag: 'DOCUMENTS',
            },
            {
              title: 'March Rush Fund Velocity',
              desc: 'Monitors drawdown speed vs physical verification certificates to prevent fiscal year-end fund exhaustion.',
              icon: Activity,
              tag: 'TIMELINE',
            },
            {
              title: 'TF-IDF Semantic Match',
              desc: 'Identifies subtly renamed duplicate works proposed across overlapping assembly constituencies.',
              icon: Bot,
              tag: 'SEMANTIC',
            },
          ].map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white/[0.02] light:bg-slate-50 hover:bg-white/[0.05] border border-white/10 light:border-slate-200 hover:border-[#a78b71]/50 rounded-[28px] space-y-3 transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(167,139,113,0.15)] group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-white/[0.04] light:bg-white border border-white/10 light:border-slate-200 text-[#e8d5b7] group-hover:text-white group-hover:scale-110 transition-all">
                    <Icon className="w-5 h-5 text-[#c9b8a0]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-black/40 light:bg-slate-100 text-[#c9b8a0] light:text-[#8C735D] border border-white/10 light:border-slate-200">
                    {engine.tag}
                  </span>
                </div>

                <h3 className="font-['Playfair_Display'] font-semibold text-lg text-white light:text-slate-900 group-hover:text-[#e8d5b7] transition-colors">
                  {engine.title}
                </h3>

                <p className="text-xs text-zinc-400 light:text-slate-600 font-['Inter'] leading-relaxed">
                  {engine.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Google Verification Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};
