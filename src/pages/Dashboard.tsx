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
  CartesianGrid,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  const kpis = appStore.getSystemKPIs();
  const criticalProjects = appStore.getProjects({
    riskLevel: selectedRisk !== 'ALL' ? selectedRisk : 'CRITICAL',
    stateId: selectedState !== 'ALL' ? selectedState : undefined,
    pageSize: 4,
  }).items;

  const pieRiskData = [
    { name: 'Low (0-29)', value: kpis.lowCount, color: '#2e7d32' },
    { name: 'Moderate (30-59)', value: kpis.mediumCount, color: '#C9A962' },
    { name: 'Elevated (60-79)', value: kpis.highCount, color: '#d97706' },
    { name: 'Critical (80-100)', value: kpis.criticalCount, color: '#8B2635' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME I"
        title="Command Center & Intelligence Overview"
        subtitle="Real-time algorithmic risk monitor across 1,050+ registered MPLADS scheme records."
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

      {/* 2. ARCHIVAL METRIC CARDS WITH 3D TILT & ANIMATED COUNTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Interactive3DCard>
          <DossierCard flourish={false} className="space-y-1 hover-glow-brass">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.2em] text-[#C9A962] uppercase block">
              REGISTERED WORKS
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              <AnimatedCounter value={kpis.totalProjects} duration={1400} />
            </div>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">Across 8 state jurisdictions</p>
          </DossierCard>
        </Interactive3DCard>

        <Interactive3DCard>
          <DossierCard flourish={false} className="space-y-1 hover-glow-brass">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.2em] text-[#C9A962] uppercase block">
              SANCTIONED OUTLAY
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              <AnimatedCounter value={kpis.totalSanctioned / 10000000} decimals={1} prefix="₹" suffix=" Cr" duration={1400} />
            </div>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">
              Disbursed: ₹{(kpis.totalUtilized / 10000000).toFixed(1)} Cr
            </p>
          </DossierCard>
        </Interactive3DCard>

        <Interactive3DCard>
          <DossierCard variant="crimson" flourish={false} className="space-y-1 hover-glow-brass">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.2em] text-[#fca5a5] uppercase block">
              CRITICAL ANOMALIES
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#fca5a5]">
              <AnimatedCounter value={kpis.criticalCount} duration={1200} />
            </div>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">Priority forensic review</p>
          </DossierCard>
        </Interactive3DCard>

        <Interactive3DCard>
          <DossierCard flourish={false} className="space-y-1 hover-glow-brass">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.2em] text-[#C9A962] uppercase block">
              ACTIVE CASEFILES
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              <AnimatedCounter value={kpis.openInvestigationsCount} suffix=" Active" duration={1000} />
            </div>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">Formal inquiry in progress</p>
          </DossierCard>
        </Interactive3DCard>
      </div>

      {/* QUICK COMMAND LAUNCHPAD */}
      <div className="p-4 bg-[#251E19]/80 border border-[#C9A962]/40 rounded-[4px] shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-['Cinzel'] font-bold text-[#C9A962]">
          <Sparkles className="w-4 h-4 text-[#C9A962]" />
          <span>TACTICAL SHORTCUTS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/projects/proj-10291"
            className="px-3 py-1.5 bg-[#8B2635]/20 hover:bg-[#8B2635]/40 border border-[#8B2635] text-[#fca5a5] rounded text-xs font-['Cinzel'] font-bold tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>🚩</span> AUDIT FLAGSHIP #10291
          </Link>
          <Link
            to="/map"
            className="px-3 py-1.5 bg-[#1C1714] hover:bg-[#2E2620] border border-[#4A3F35] hover:border-[#C9A962] text-[#E8DFD4] rounded text-xs font-['Cinzel'] font-bold tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>🗺️</span> POSTGIS GEO-MAP
          </Link>
          <Link
            to="/copilot"
            className="px-3 py-1.5 bg-[#C9A962]/10 hover:bg-[#C9A962]/20 border border-[#C9A962]/40 hover:border-[#C9A962] text-[#C9A962] rounded text-xs font-['Cinzel'] font-bold tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>🤖</span> SENTINEL AI COPILOT
          </Link>
          <Link
            to="/ocr"
            className="px-3 py-1.5 bg-[#1C1714] hover:bg-[#2E2620] border border-[#4A3F35] hover:border-[#C9A962] text-[#E8DFD4] rounded text-xs font-['Cinzel'] font-bold tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>📄</span> OCR VOUCHER AUDITOR
          </Link>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Priority Anomaly Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
            <h3 className="text-xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#8B2635]" strokeWidth={1.5} />
              Priority Anomaly Queue
            </h3>
            <Link
              to="/projects"
              className="text-xs font-['Cinzel'] font-bold tracking-widest text-[#C9A962] hover:underline flex items-center gap-1"
            >
              EXAMINE ALL 1,050 WORKS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {criticalProjects.map((proj) => (
              <DossierCard
                key={proj.id}
                variant={proj.risk_score >= 80 ? 'crimson' : 'default'}
                className="space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#C9A962] font-bold">
                        #{proj.project_code}
                      </span>
                      <span className="text-xs font-['Cinzel'] text-[#9C8B7A]">
                        {proj.category_name}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] mt-0.5">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic">
                      {proj.location_name}, {proj.district_name}, {proj.state_name}
                    </p>
                  </div>

                  <RiskBadge score={proj.risk_score} size="md" />
                </div>

                <div className="pt-2 border-t border-[#4A3F35] flex flex-wrap items-center justify-between gap-2 text-xs font-['Crimson_Pro']">
                  <div className="flex items-center gap-3 text-[#9C8B7A]">
                    <span>
                      Sanctioned: <strong className="text-[#E8DFD4]">₹{(proj.sanctioned_amount / 100000).toFixed(2)} L</strong>
                    </span>
                    <span>
                      Contractor: <strong className="text-[#E8DFD4]">{proj.vendor_name || 'N/A'}</strong>
                    </span>
                  </div>

                  <Link to={`/projects/${proj.project_code}`}>
                    <ClassicalButton variant="secondary" size="sm">
                      WHY FLAGGED?
                    </ClassicalButton>
                  </Link>
                </div>
              </DossierCard>
            ))}
          </div>
        </div>

        {/* Right: Risk Tier Breakdown & Copilot Callout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <DossierCard flourish={false} className="space-y-4">
            <h3 className="text-lg font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              Risk Tier Distribution
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieRiskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C1714" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#251E19',
                      borderColor: '#4A3F35',
                      borderWidth: 1,
                      fontFamily: 'Crimson Pro',
                      borderRadius: 4,
                      color: '#E8DFD4',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-['Cinzel'] font-bold">
              {pieRiskData.map((tier) => (
                <div key={tier.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: tier.color }} />
                  <span className="text-[#9C8B7A]">
                    {tier.name}: <strong className="text-[#E8DFD4]">{tier.value}</strong>
                  </span>
                </div>
              ))}
            </div>
          </DossierCard>

          {/* Sentinel AI Copilot Callout */}
          <DossierCard variant="elevated" className="space-y-3">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-widest text-[#C9A962] uppercase block">
              GROQ SENTINEL COPILOT
            </span>
            <h4 className="text-lg font-bold font-['Cormorant_Garamond'] text-[#E8DFD4]">
              Grounded Forensic Intelligence
            </h4>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic leading-relaxed">
              Query natural language patterns with zero hallucination. All answers cite verifiable
              treasury records and Schedule of Rates benchmarks.
            </p>
            <div className="pt-2">
              <Link to="/sentinel-ai">
                <ClassicalButton variant="primary" size="sm">
                  LAUNCH COPILOT
                </ClassicalButton>
              </Link>
            </div>
          </DossierCard>
        </div>
      </div>
    </div>
  );
};
