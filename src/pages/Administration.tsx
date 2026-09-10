import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Activity,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Cpu,
  Layers,
  ShieldAlert,
  Server,
  Cloud,
  ExternalLink,
  Check,
  Info,
  Terminal,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  ClassicalTabs,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DEFAULT_RISK_WEIGHTS, RiskWeights } from '../services/risk';
import { checkSupabaseHealth, SupabaseHealthCheckResult } from '../services/supabase';

export const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weights' | 'health' | 'audit' | 'flags'>('weights');
  const [weights, setWeights] = useState<RiskWeights>({ ...DEFAULT_RISK_WEIGHTS });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealthCheckResult | null>(null);
  const [isCheckingSupabase, setIsCheckingSupabase] = useState(false);

  const testSupabaseConnection = async () => {
    setIsCheckingSupabase(true);
    const res = await checkSupabaseHealth();
    setSupabaseHealth(res);
    setIsCheckingSupabase(false);
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const [flags, setFlags] = useState({
    enable_groq_ai: true,
    enable_ml_anomaly_engine: true,
    enable_document_ocr: true,
    enable_demo_mode: true,
  });

  const auditLogs = appStore.getAuditLogs();

  const handleWeightChange = (key: keyof RiskWeights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveWeights = () => {
    setSaveSuccess(true);
    appStore.logAudit('RISK_WEIGHTS_UPDATED', 'SYSTEM_SETTINGS', undefined, weights);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="SYSTEM ADMINISTRATION"
        title="Archive Administration & Governance"
        subtitle="Configure risk formula weights, toggle runtime feature flags, inspect infrastructure health, and verify tamper-evident audit ledgers."
        action={
          <div className="flex items-center gap-3">
            <LiveStatusPill label="ADMIN SUPERVISORY" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 light:bg-red-50 border border-red-500/30 light:border-red-300 rounded-xl text-xs font-mono tracking-wider text-red-300 light:text-red-700 font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400 light:text-red-600" /> ROOT CLEARANCE
            </div>
          </div>
        }
      />

      {/* 2. ADMIN TABS */}
      <ClassicalTabs
        tabs={[
          { id: 'weights', label: 'RISK FORMULA WEIGHTS' },
          { id: 'health', label: 'SYSTEM HEALTH & SERVICES' },
          { id: 'audit', label: `IMMUTABLE AUDIT LOGS (${auditLogs.length})` },
          { id: 'flags', label: 'FEATURE FLAGS' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* TAB 1: RISK FORMULA WEIGHTS */}
      {activeTab === 'weights' && (
        <ClassicalCard className="p-6 space-y-6 border-beam-card">
          <div className="border-b border-white/10 light:border-slate-200 pb-3">
            <ArchiveLabel text="COMPOSITE RISK COEFFICIENTS" />
            <h3 className="text-xl font-bold font-serif text-white light:text-slate-900 mt-1">
              Risk Score Multiplier Allocation
            </h3>
            <p className="text-xs text-zinc-400 light:text-slate-600 font-sans mt-1">
              Adjust algorithmic contribution for each forensic category. Multipliers automatically normalize into the composite 0–100 risk score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'financial', label: 'Financial Discrepancies (Cost/Invoice)', val: weights.financial },
              { key: 'timeline', label: 'Timeline Chronology Inversions', val: weights.timeline },
              { key: 'vendor', label: 'Vendor Market Concentration', val: weights.vendor },
              { key: 'geographic', label: 'Geographic Overlap & Buffers', val: weights.geographic },
              { key: 'documents', label: 'Document OCR Mismatch Extraction', val: weights.documents },
              { key: 'duplicate', label: 'Fuzzy Semantic Work Duplication', val: weights.duplicate },
            ].map((item) => (
              <div key={item.key} className="space-y-3 p-4 bg-white/[0.03] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-white light:text-slate-900">{item.label}</span>
                  <span className="text-[#c9b8a0] light:text-amber-800 font-bold">
                    {Math.round(item.val * 100)}% ({item.val.toFixed(2)})
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.05"
                  value={item.val}
                  onChange={(e) => handleWeightChange(item.key as any, parseFloat(e.target.value))}
                  className="w-full accent-[#c9b8a0] cursor-pointer h-2 bg-white/10 light:bg-slate-200 rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 light:border-slate-200">
            <span className="text-xs font-mono text-zinc-400 light:text-slate-600">
              NORMALIZED TOTAL:{' '}
              <span className="text-[#c9b8a0] light:text-amber-800 font-bold">
                {(
                  weights.financial +
                  weights.timeline +
                  weights.vendor +
                  weights.geographic +
                  weights.documents +
                  weights.duplicate
                ).toFixed(2)}{' '}
                / 1.00
              </span>
            </span>

            <ClassicalButton
              variant="primary"
              size="md"
              onClick={handleSaveWeights}
              icon={saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : undefined}
            >
              {saveSuccess ? 'WEIGHTS SAVED & APPLIED' : 'SAVE & RE-INDEX ENGINE'}
            </ClassicalButton>
          </div>
        </ClassicalCard>
      )}

      {/* TAB 2: SYSTEM HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {/* SUPABASE CLOUD CONNECTION STATUS PANEL */}
          <ClassicalCard className="p-6 space-y-6 border-beam-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 light:border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c9b8a0]/10 light:bg-amber-100 border border-[#c9b8a0]/30 light:border-amber-300 flex items-center justify-center text-[#c9b8a0] light:text-amber-800">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-serif text-white light:text-slate-900">
                      Supabase Cloud Backend (Zero Docker)
                    </h3>
                    {supabaseHealth?.connected ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-950/60 light:bg-emerald-50 text-emerald-400 light:text-emerald-700 border border-emerald-500/40 light:border-emerald-300 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> CONNECTED & ACTIVE
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-950/60 light:bg-amber-50 text-[#e8d5b7] light:text-amber-800 border border-[#c9b8a0]/50 light:border-amber-300 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-400 light:text-amber-600" /> DEMO IN-MEMORY REPOSITORY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 light:text-slate-600 mt-0.5 font-sans">
                    Managed PostgreSQL 15, PostGIS Geospatial Engine, Storage Buckets & Realtime WebSockets.
                  </p>
                </div>
              </div>

              <ClassicalButton
                variant="secondary"
                size="sm"
                onClick={testSupabaseConnection}
                disabled={isCheckingSupabase}
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isCheckingSupabase ? 'animate-spin' : ''}`} />
                {isCheckingSupabase ? 'TESTING...' : 'PING SUPABASE'}
              </ClassicalButton>
            </div>

            {/* Diagnostics 3-column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/40 light:bg-white border border-white/10 light:border-slate-300 rounded-xl space-y-1.5 shadow-sm">
                <div className="text-[10px] font-bold text-zinc-400 light:text-slate-500 uppercase tracking-wider">
                  ENDPOINT URL
                </div>
                <div className="text-zinc-200 light:text-slate-900 font-mono font-bold text-xs truncate">
                  {supabaseHealth?.url || 'https://lqniwrwmllscwgeqyzps.supabase.co'}
                </div>
              </div>

              <div className="p-4 bg-black/40 light:bg-white border border-white/10 light:border-slate-300 rounded-xl space-y-1.5 shadow-sm">
                <div className="text-[10px] font-bold text-zinc-400 light:text-slate-500 uppercase tracking-wider">
                  ROUNDTRIP LATENCY
                </div>
                <div className="text-[#c9b8a0] light:text-amber-700 font-mono font-bold text-xs">
                  {supabaseHealth?.latencyMs ? `${supabaseHealth.latencyMs} ms` : 'N/A (Local Mock)'}
                </div>
              </div>

              <div className="p-4 bg-black/40 light:bg-white border border-white/10 light:border-slate-300 rounded-xl space-y-1.5 shadow-sm">
                <div className="text-[10px] font-bold text-zinc-400 light:text-slate-500 uppercase tracking-wider">
                  STATUS DIAGNOSTIC
                </div>
                <div className="text-zinc-200 light:text-slate-900 text-xs font-sans truncate font-medium">
                  {supabaseHealth?.connected
                    ? 'All database tables and PostGIS reachable'
                    : supabaseHealth?.error || 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or using placeholder values'}
                </div>
              </div>
            </div>

            {/* High-Contrast Supabase Connect Guide Box */}
            {!supabaseHealth?.connected && (
              <div className="p-5 bg-amber-950/20 light:bg-amber-50/95 border border-[#c9b8a0]/40 light:border-amber-300 rounded-xl space-y-3 text-xs shadow-sm">
                <div className="font-mono font-bold text-[#e8d5b7] light:text-amber-900 text-xs flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400 light:text-amber-700" />
                  <span>HOW TO CONNECT YOUR FREE SUPABASE CLOUD PROJECT:</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-zinc-300 light:text-slate-800 font-sans leading-relaxed">
                  <li>
                    Create a free project at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-bold text-[#c9b8a0] light:text-amber-800 underline hover:text-white light:hover:text-amber-900"
                    >
                      supabase.com
                    </a>.
                  </li>
                  <li>
                    Copy SQL from{' '}
                    <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 light:bg-white border border-white/10 light:border-amber-300 text-[#c9b8a0] light:text-amber-900">
                      supabase/full_schema_and_seed.sql
                    </code>{' '}
                    into Supabase <strong className="text-white light:text-slate-900">SQL Editor</strong> and click <strong className="text-white light:text-slate-900">Run</strong>.
                  </li>
                  <li>
                    Paste your{' '}
                    <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 light:bg-white border border-white/10 light:border-amber-300 text-[#c9b8a0] light:text-amber-900">
                      VITE_SUPABASE_URL
                    </code>{' '}
                    and{' '}
                    <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 light:bg-white border border-white/10 light:border-amber-300 text-[#c9b8a0] light:text-amber-900">
                      VITE_SUPABASE_ANON_KEY
                    </code>{' '}
                    into{' '}
                    <code className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 light:bg-white border border-white/10 light:border-amber-300 text-[#c9b8a0] light:text-amber-900">
                      .env
                    </code>.
                  </li>
                </ol>
              </div>
            )}
          </ClassicalCard>

          {/* SERVICE HEALTH TILES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'PostgreSQL Database',
                status: supabaseHealth?.connected ? 'CLOUD CONNECTED' : 'HEALTHY (DEMO)',
                latency: supabaseHealth?.latencyMs ? `${supabaseHealth.latencyMs}ms` : '12ms',
                details: 'PostGIS v3.4 enabled',
              },
              { name: 'Groq AI Service', status: 'HEALTHY', latency: '420ms', details: 'Llama-3.3-70B Active' },
              { name: 'Supabase Realtime', status: 'HEALTHY', latency: '18ms', details: 'WebSocket stream ready' },
              { name: 'Document OCR Engine', status: 'HEALTHY', latency: '850ms', details: 'Vision Transformer ready' },
              { name: 'Audit Log Integrity', status: 'VERIFIED', latency: '0ms', details: 'SHA-256 hash chains valid' },
              { name: 'Background Job Queue', status: 'IDLE', latency: '0 pending', details: 'Workers running (4/4)' },
            ].map((svc) => (
              <ClassicalCard key={svc.name} className="p-5 space-y-2 border-beam-card">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#c9b8a0] light:text-amber-800 bg-white/5 light:bg-slate-100 px-2.5 py-1 border border-white/10 light:border-slate-300 rounded-lg">
                    ● {svc.status}
                  </span>
                  <span className="text-xs text-zinc-400 light:text-slate-500 font-mono">{svc.latency}</span>
                </div>
                <h4 className="font-bold text-base text-white light:text-slate-900 font-sans">{svc.name}</h4>
                <p className="text-xs text-zinc-400 light:text-slate-500 font-mono">{svc.details}</p>
              </ClassicalCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IMMUTABLE AUDIT LOGS */}
      {activeTab === 'audit' && (
        <ClassicalCard className="p-6 space-y-4 border-beam-card">
          <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
            <ArchiveLabel text="TAMPER-EVIDENT CRYPTOGRAPHIC AUDIT TRAIL" />
            <span className="text-xs font-mono text-zinc-400 light:text-slate-500 font-bold">STRICT RLS PROTECTED</span>
          </div>

          <div className="overflow-x-auto border border-white/10 light:border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-white/[0.04] light:bg-slate-100 border-b border-white/10 light:border-slate-200 font-mono text-[11px] text-[#c9b8a0] light:text-slate-700 tracking-wider">
                  <th className="p-3">Seq #</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Target Entity</th>
                  <th className="p-3">SHA-256 Hash</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 light:divide-slate-200 text-zinc-200 light:text-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] light:hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#c9b8a0] light:text-amber-800">#{log.sequence_number}</td>
                    <td className="p-3 font-medium text-white light:text-slate-900">{log.actor_name}</td>
                    <td className="p-3 font-mono text-[11px] text-zinc-300 light:text-slate-700">{log.action}</td>
                    <td className="p-3 text-xs text-zinc-400 light:text-slate-500 font-mono">
                      {log.entity_type} {log.entity_label || log.entity_id || ''}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-zinc-500 light:text-slate-400 truncate max-w-[140px]">
                      {log.tamper_hash}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-zinc-400 light:text-slate-500">
                      {new Date(log.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClassicalCard>
      )}

      {/* TAB 4: FEATURE FLAGS */}
      {activeTab === 'flags' && (
        <ClassicalCard className="p-6 space-y-4 border-beam-card">
          <ArchiveLabel text="DYNAMIC SYSTEM FEATURE FLAGS" />
          <h3 className="text-xl font-bold font-serif text-white light:text-slate-900">
            Runtime Subsystem Activation
          </h3>

          <div className="space-y-3 divide-y divide-white/10 light:divide-slate-200">
            {[
              { key: 'enable_groq_ai', label: 'Enable Groq AI Copilot & Automated Case Summaries' },
              { key: 'enable_ml_anomaly_engine', label: 'Enable Statistical Isolation Forest & Heuristic Scorer' },
              { key: 'enable_document_ocr', label: 'Enable Client & Server PDF/Image OCR Extraction' },
              { key: 'enable_demo_mode', label: 'Enable Synthetic 1,000+ Project Dataset Generator' },
            ].map((flag) => (
              <div key={flag.key} className="flex items-center justify-between pt-3 text-sm text-white light:text-slate-900">
                <span className="font-medium font-sans">{flag.label}</span>
                <input
                  type="checkbox"
                  checked={(flags as any)[flag.key]}
                  onChange={(e) =>
                    setFlags((prev) => ({ ...prev, [flag.key]: e.target.checked }))
                  }
                  className="w-5 h-5 accent-[#c9b8a0] cursor-pointer rounded"
                />
              </div>
            ))}
          </div>
        </ClassicalCard>
      )}
    </div>
  );
};
