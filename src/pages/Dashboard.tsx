// ==============================================================================
// MPLAD SENTINEL — ROLE-ADAPTIVE COMMAND CENTER DASHBOARD
// ==============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  FolderGit2,
  Banknote,
  AlertTriangle,
  FileSearch,
  ArrowRight,
  Sparkles,
  Bot,
  MapPin,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  UserCheck,
  CheckCircle2,
  Clock,
  Camera,
  Layers,
  KeyRound,
} from 'lucide-react';
import {
  ClassicalCard,
  ClassicalButton,
  RiskBadge,
  ClassicalSelect,
  VolumeHeader,
  DossierCard,
  ArchiveLabel,
  AnimatedCounter,
  Interactive3DCard,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { DEMO_STATES } from '../services/demo/syntheticData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';
import { useCurrentUser } from '../services/store/useCurrentUser';

export const Dashboard: React.FC = () => {
  const { user, role, roleMetadata, can } = useCurrentUser();
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const selectedStateObj = DEMO_STATES.find((s) => s.id === selectedState);

  // Overall KPIs filtered by selected jurisdiction & risk
  const kpis = appStore.getSystemKPIs({
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
    riskLevel: selectedRisk !== 'ALL' ? selectedRisk : undefined,
  });

  // State-specific risk breakdown for the Donut Chart
  const stateKpis = appStore.getSystemKPIs({
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
  });

  const criticalProjects = appStore.getProjects({
    riskLevel: selectedRisk !== 'ALL' ? selectedRisk : 'CRITICAL',
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
    pageSize: 6,
  }).items;

  const totalMonitoredWorks = stateKpis.totalProjects || 1050;
  const pieRiskData = [
    {
      name: 'Low Risk',
      tierKey: 'LOW',
      range: '0-29',
      value: stateKpis.lowCount,
      color: '#10B981',
      lightColor: '#059669',
      accentBg: 'rgba(16, 185, 129, 0.15)',
      description: 'Standard compliance velocity; negligible audit risk',
    },
    {
      name: 'Moderate',
      tierKey: 'MEDIUM',
      range: '30-59',
      value: stateKpis.mediumCount,
      color: '#F59E0B',
      lightColor: '#D97706',
      accentBg: 'rgba(245, 158, 11, 0.15)',
      description: 'Minor variance in SoR benchmark or delivery pace',
    },
    {
      name: 'Elevated',
      tierKey: 'HIGH',
      range: '60-79',
      value: stateKpis.highCount,
      color: '#F97316',
      lightColor: '#EA580C',
      accentBg: 'rgba(249, 115, 22, 0.15)',
      description: 'Multi-indicator flags requiring supervisory review',
    },
    {
      name: 'Critical',
      tierKey: 'CRITICAL',
      range: '80-100',
      value: stateKpis.criticalCount,
      color: '#EF4444',
      lightColor: '#DC2626',
      accentBg: 'rgba(239, 68, 68, 0.2)',
      description: 'High-confidence duplicate invoice or geo-overlap',
    },
  ];

  return (
    <div className="space-y-8 animate-page-enter font-['Inter']">
      {/* 1. ROLE WELCOME & CLEARANCE STATUS BANNER */}
      <div className="p-5 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 rounded-3xl backdrop-blur-md shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#a78b71]/15 border border-[#a78b71]/40 flex items-center justify-center text-[#e8d5b7] shadow-[0_0_20px_rgba(167,139,113,0.25)]">
            <UserCheck className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-['Playfair_Display'] italic text-white">
                Welcome, {user.full_name}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#a78b71]/20 text-[#e8d5b7] border border-[#a78b71]/40 rounded-full">
                {role}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {user.designation || roleMetadata.title} •{' '}
              <span className="text-[#c9b8a0]">{user.department || roleMetadata.department}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase text-gray-400 block">
              AUTHORIZED JURISDICTION
            </span>
            <span className="text-xs font-semibold text-white">
              {user.constituency_name || user.district_name || user.state_name || 'National Oversight'}
            </span>
          </div>
          <Link
            to="/permissions"
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white rounded-full flex items-center gap-1.5 transition-all font-mono"
            title="Inspect permissions assigned to this role"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#c9b8a0]" />
            <span>Clearance: {roleMetadata.clearanceLevel}</span>
          </Link>
        </div>
      </div>

      {/* 2. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME I"
        title="Command Center & Intelligence Overview"
        subtitle="Real-time algorithmic risk surveillance across registered MPLADS scheme works."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <ClassicalSelect
                options={[
                  { value: 'ALL', label: 'All Jurisdictions' },
                  ...DEMO_STATES.map((s) => ({ value: s.id, label: s.name })),
                ]}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              />
            </div>
            <div className="w-44">
              <ClassicalSelect
                options={[
                  { value: 'ALL', label: 'All Risk Tiers' },
                  { value: 'CRITICAL', label: 'Critical Only' },
                  { value: 'HIGH', label: 'Elevated Only' },
                  { value: 'MEDIUM', label: 'Moderate Only' },
                ]}
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              />
            </div>
          </div>
        }
      />

      {/* 3. ROLE-ADAPTIVE & JURISDICTION-AWARE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Primary Scope / Projects */}
        <Interactive3DCard>
          <div className="p-6 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[24px] space-y-2 transition-all duration-300 hover:border-[#a78b71]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(167,139,113,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] uppercase">
                {selectedStateObj
                  ? `${selectedStateObj.name.toUpperCase()} WORKS`
                  : role === 'MP_OFFICER'
                  ? 'CONSTITUENCY WORKS'
                  : role === 'DISTRICT_OFFICER'
                  ? 'DISTRICT WORKS'
                  : role === 'FIELD_OFFICER'
                  ? 'ASSIGNED SITES'
                  : 'REGISTERED WORKS'}
              </span>
              <FolderGit2 className="w-4 h-4 text-[#a78b71]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-white">
              <AnimatedCounter
                value={kpis.totalProjects}
                duration={1400}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>
                {selectedStateObj
                  ? `${kpis.districtCount} district jurisdictions`
                  : role === 'MP_OFFICER'
                  ? 'Pune LS Seat'
                  : role === 'DISTRICT_OFFICER'
                  ? 'Pune District'
                  : role === 'FIELD_OFFICER'
                  ? 'Physical visits'
                  : `${kpis.stateCount || 8} state jurisdictions`}
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12.4%
              </span>
            </div>
          </div>
        </Interactive3DCard>

        {/* Card 2: Financial Outlay / Fund Utilization */}
        <Interactive3DCard>
          <div className="p-6 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[24px] space-y-2 transition-all duration-300 hover:border-[#a78b71]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(167,139,113,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] uppercase">
                {selectedStateObj
                  ? `${selectedStateObj.name.toUpperCase()} OUTLAY`
                  : role === 'AUDITOR'
                  ? 'AUDIT DISCREPANCIES'
                  : 'SANCTIONED OUTLAY'}
              </span>
              <Banknote className="w-4 h-4 text-[#a78b71]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-white">
              <AnimatedCounter
                value={kpis.totalSanctioned / 10000000}
                decimals={1}
                prefix="₹"
                suffix=" Cr"
                duration={1400}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>
                Disbursed: ₹{(kpis.totalReleased / 10000000).toFixed(1)} Cr
              </span>
              <span className="text-[#c9b8a0] font-mono text-[11px]">
                {kpis.utilizationRate.toFixed(1)}% Utilized
              </span>
            </div>
          </div>
        </Interactive3DCard>

        {/* Card 3: Anomalies / Verification Queue */}
        <Interactive3DCard>
          <div className="p-6 bg-rose-950/20 backdrop-blur-md border border-rose-500/30 rounded-[24px] space-y-2 transition-all duration-300 hover:border-rose-500/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(239,68,68,0.25)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-300 uppercase">
                {selectedStateObj
                  ? `${selectedStateObj.name.toUpperCase()} ANOMALIES`
                  : role === 'FIELD_OFFICER'
                  ? 'PENDING INSPECTION'
                  : role === 'DISTRICT_OFFICER'
                  ? 'VERIFICATION QUEUE'
                  : 'CRITICAL ANOMALIES'}
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-rose-400">
              <AnimatedCounter
                value={kpis.criticalCount}
                duration={1200}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>
                {selectedStateObj
                  ? `In ${selectedStateObj.name}`
                  : role === 'FIELD_OFFICER'
                  ? 'Awaiting photo uploads'
                  : role === 'DISTRICT_OFFICER'
                  ? 'Pending collector sign-off'
                  : 'Forensic review required'}
              </span>
              <span className="text-rose-400 font-mono text-[11px] font-bold">URGENT</span>
            </div>
          </div>
        </Interactive3DCard>

        {/* Card 4: Casefiles / Insights */}
        <Interactive3DCard>
          <div className="p-6 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[24px] space-y-2 transition-all duration-300 hover:border-[#a78b71]/50 hover:shadow-[0_12px_30px_rgba(0,0,0,0.5),0_0_25px_rgba(167,139,113,0.2)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] uppercase">
                {selectedStateObj
                  ? `${selectedStateObj.name.toUpperCase()} INQUIRIES`
                  : role === 'DATA_ANALYST'
                  ? 'HHI CONCENTRATION'
                  : role === 'FIELD_OFFICER'
                  ? 'COMPLETED VISITS'
                  : 'ACTIVE CASEFILES'}
              </span>
              <FileSearch className="w-4 h-4 text-[#a78b71]" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-['Playfair_Display'] text-white">
              <AnimatedCounter
                value={kpis.openInvestigationsCount}
                suffix=" Active"
                duration={1000}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span>
                {selectedStateObj
                  ? `${selectedStateObj.name} inquiries`
                  : role === 'DATA_ANALYST'
                  ? 'Non-competitive cartel'
                  : role === 'FIELD_OFFICER'
                  ? 'Verified with GPS'
                  : 'Formal inquiry underway'}
              </span>
              <span className="text-amber-400 font-mono text-[11px] font-semibold flex items-center gap-0.5">
                <Activity className="w-3 h-3" /> Live
              </span>
            </div>
          </div>
        </Interactive3DCard>
      </div>

      {/* 4. QUICK COMMAND LAUNCHPAD */}
      <div className="p-4 bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[24px] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c9b8a0] tracking-wide uppercase">
          <Sparkles className="w-4 h-4 text-[#a78b71]" />
          <span>AUTHORIZED COMMAND SHORTCUTS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {can('projects.view') && (
            <Link
              to="/projects/MPLAD-10291"
              className="px-3.5 py-1.5 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 text-rose-300 rounded-full text-xs font-mono font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.2)]"
            >
              <span>🚩</span> AUDIT FLAGSHIP #10291
            </Link>
          )}

          {can('geo.view') && (
            <Link
              to="/map"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a78b71]/50 text-gray-200 hover:text-white rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c9b8a0]" /> POSTGIS GEO-MAP
            </Link>
          )}

          {can('ai.view') && (
            <Link
              to="/sentinel-ai"
              className="px-3.5 py-1.5 bg-[#a78b71]/15 hover:bg-[#a78b71]/30 border border-[#a78b71]/40 text-[#e8d5b7] rounded-full text-xs font-mono font-semibold tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-[#e8d5b7]" /> SENTINEL AI COPILOT
            </Link>
          )}

          {can('documents.ocr') && (
            <Link
              to="/documents"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a78b71]/50 text-gray-200 hover:text-white rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-[#c9b8a0]" /> OCR ARCHIVE
            </Link>
          )}

          {can('reports.view') && (
            <Link
              to="/reports"
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a78b71]/50 text-gray-200 hover:text-white rounded-full text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-[#c9b8a0]" /> AUDIT DOSSIERS
            </Link>
          )}
        </div>
      </div>

      {/* 5. VISUAL ANALYTICS & RISK GAUGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Interactive Risk Distribution Donut Chart */}
        <ClassicalCard variant="default" className="p-6 space-y-4 relative flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
            <div>
              <ArchiveLabel text="SURVEILLANCE BREAKDOWN" />
              <h3 className="font-['Playfair_Display'] font-semibold text-base text-white light:text-slate-900 mt-1">
                Risk Distribution Tiers
              </h3>
            </div>
            {selectedRisk !== 'ALL' ? (
              <button
                onClick={() => setSelectedRisk('ALL')}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 light:text-amber-800 border border-amber-500/40 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="Clear tier filter"
              >
                <span>FILTER: {selectedRisk}</span>
                <span className="text-xs">×</span>
              </button>
            ) : (
              <LiveStatusPill statusText={`${totalMonitoredWorks.toLocaleString()} Works`} />
            )}
          </div>

          {/* Donut Container with Central KPI Display */}
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  {...({
                    data: pieRiskData,
                    cx: "50%",
                    cy: "50%",
                    innerRadius: 66,
                    outerRadius: 88,
                    paddingAngle: 4,
                    dataKey: "value",
                    activeIndex: activePieIndex !== null ? activePieIndex : undefined,
                    activeShape: (props: any) => {
                      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                      return (
                        <g>
                          <Sector
                            cx={cx}
                            cy={cy}
                            innerRadius={innerRadius - 3}
                            outerRadius={outerRadius + 8}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            fill={fill}
                            cornerRadius={6}
                          />
                          <Sector
                            cx={cx}
                            cy={cy}
                            startAngle={startAngle}
                            endAngle={endAngle}
                            innerRadius={outerRadius + 11}
                            outerRadius={outerRadius + 14}
                            fill={fill}
                            opacity={0.35}
                            cornerRadius={2}
                          />
                        </g>
                      );
                    },
                    onMouseEnter: (_: any, index: number) => setActivePieIndex(index),
                    onMouseLeave: () => setActivePieIndex(null),
                    onClick: (entry: any) => {
                      const key = entry?.tierKey || entry?.payload?.tierKey;
                      if (key) {
                        setSelectedRisk((prev) => (prev === key ? 'ALL' : key));
                      }
                    },
                    className: "cursor-pointer outline-none focus:outline-none",
                  } as any)}
                >
                  {pieRiskData.map((entry) => {
                    const isSelected = selectedRisk === entry.tierKey;
                    return (
                      <Cell
                        key={`cell-${entry.tierKey}`}
                        fill={entry.color}
                        stroke={isSelected ? '#ffffff' : 'rgba(0,0,0,0.5)'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="transition-all duration-300 hover:opacity-95"
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      const pct = ((d.value / (totalMonitoredWorks || 1)) * 100).toFixed(1);
                      return (
                        <div className="p-3 bg-black/90 light:bg-white backdrop-blur-md border border-white/20 light:border-slate-300 rounded-2xl shadow-xl font-['Inter'] space-y-1.5 min-w-[190px] text-xs pointer-events-none">
                          <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: d.color }} />
                              <strong className="font-semibold text-white light:text-slate-900">{d.name}</strong>
                            </div>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 light:bg-slate-100 text-gray-300 light:text-slate-700">
                              {d.range}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between pt-0.5">
                            <span className="text-base font-mono font-bold text-white light:text-slate-900">
                              {d.value.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">works</span>
                            </span>
                            <span className="text-xs font-mono font-bold" style={{ color: d.color }}>
                              {pct}%
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-400 light:text-slate-500 font-['Inter'] leading-tight">
                            {d.description}
                          </p>
                          <div className="text-[9px] font-mono text-[#c9b8a0] light:text-[#78350F] pt-1 border-t border-white/10 light:border-slate-200">
                            ⚡ Click to filter priority ledger
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Dynamic Center Hole KPI Display */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-all duration-300 flex flex-col items-center justify-center">
              {activePieIndex !== null ? (
                <div className="animate-scale-in space-y-0.5">
                  <span
                    className="text-[9px] font-mono font-bold tracking-widest uppercase block px-2 py-0.5 rounded-full border shadow-xs"
                    style={{
                      color: pieRiskData[activePieIndex].color,
                      backgroundColor: pieRiskData[activePieIndex].accentBg,
                      borderColor: pieRiskData[activePieIndex].color,
                    }}
                  >
                    {pieRiskData[activePieIndex].tierKey}
                  </span>
                  <div className="text-2xl font-mono font-bold text-white light:text-slate-900 leading-none pt-1">
                    {pieRiskData[activePieIndex].value.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-gray-300 light:text-slate-600 block">
                    {((pieRiskData[activePieIndex].value / (totalMonitoredWorks || 1)) * 100).toFixed(1)}% of total
                  </span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 light:text-slate-500 block">
                    TOTAL MONITORED
                  </span>
                  <div className="text-2xl font-mono font-bold text-white light:text-slate-900 leading-none">
                    {totalMonitoredWorks.toLocaleString()}
                  </div>
                  <span className="text-[10px] font-mono text-[#c9b8a0] light:text-[#78350F] block">
                    4 Risk Tiers
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Legend Grid (Clickable Filter Cards) */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-white/10 light:border-slate-200">
            {pieRiskData.map((d, idx) => {
              const isSelected = selectedRisk === d.tierKey;
              const isHovered = activePieIndex === idx;
              const pct = ((d.value / (totalMonitoredWorks || 1)) * 100).toFixed(0);

              return (
                <button
                  key={d.tierKey}
                  type="button"
                  onClick={() => setSelectedRisk(isSelected ? 'ALL' : d.tierKey)}
                  onMouseEnter={() => setActivePieIndex(idx)}
                  onMouseLeave={() => setActivePieIndex(null)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-white/10 light:bg-slate-100 border-white/40 light:border-slate-400 shadow-sm scale-[1.02]'
                      : isHovered
                      ? 'bg-white/5 light:bg-slate-50 border-white/20 light:border-slate-300'
                      : 'bg-white/[0.02] light:bg-white border-white/5 light:border-slate-200 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${d.tierKey === 'CRITICAL' ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="font-semibold text-gray-200 light:text-slate-800 text-[11px] truncate">
                        {d.name.split(' ')[0]}
                      </span>
                    </div>
                    <span className="font-bold text-white light:text-slate-900 ml-1 text-xs">
                      {d.value}
                    </span>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="space-y-0.5 w-full">
                    <div className="w-full bg-white/5 light:bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: d.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 light:text-slate-500 font-mono">
                      <span>Score: {d.range}</span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ClassicalCard>

        {/* Priority Forensic Alerts Ledger */}
        <ClassicalCard variant="default" className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <ArchiveLabel text="FORENSIC DOSSIER QUEUE" />
              <h3 className="font-['Playfair_Display'] font-semibold text-base text-white mt-1">
                Priority High-Risk Incident Ledger{selectedStateObj ? ` — ${selectedStateObj.name}` : ''}
              </h3>
            </div>
            <Link
              to="/projects"
              className="text-xs font-mono font-bold text-[#c9b8a0] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>FULL LEDGER</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {criticalProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#a78b71]/40 rounded-2xl transition-all flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#c9b8a0]">{p.project_code}</span>
                    <span className="text-xs font-semibold text-white truncate">{p.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {p.district_name}, {p.state_name} • Vendor:{' '}
                    <strong className="text-gray-300">{p.vendor_name || 'Unassigned'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      ₹{(p.sanctioned_amount / 100000).toFixed(1)} Lakh
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Sanctioned</span>
                  </div>

                  <RiskBadge level={p.risk_level} score={p.risk_score} />

                  <Link to={`/projects/${p.project_code}`}>
                    <button className="p-2 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all cursor-pointer">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </ClassicalCard>
      </div>
    </div>
  );
};
