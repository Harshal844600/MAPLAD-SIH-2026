import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Calendar,
  Building,
  User,
  Banknote,
  RotateCcw,
  Sparkles,
  FileSearch,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
  Compass,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  RiskScoreGauge,
  ClassicalModal,
  WaxSeal,
  EmptyState,
  VolumeHeader,
  ArchiveLabel,
  OrnateDivider,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { explainWhyProjectFlagged } from '../services/ai';
import { SentinelAIAnalysisResult } from '../types';

export const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = appStore.getProjectById(projectId || 'MPLAD-10291');
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<SentinelAIAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'graph' | 'financials' | 'documents'>('overview');

  if (!project) {
    return (
      <EmptyState
        title="ARCHIVE RECORD NOT FOUND"
        description={`The implementation dossier for index "${projectId}" could not be retrieved from the central registry.`}
        actionText="RETURN TO PROJECT ARCHIVE"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const anomalies = appStore.getProjectAnomalies(project.id);
  const transactions = appStore.getProjectTransactions(project.id);
  const documents = appStore.getProjectDocuments(project.id);

  const handleWhyFlaggedClick = async () => {
    setIsWhyFlaggedOpen(true);
    if (!aiAnalysis) {
      setIsAiLoading(true);
      try {
        const result = await explainWhyProjectFlagged(project, anomalies, transactions, documents);
        setAiAnalysis(result);
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleRecalculateRisk = () => {
    appStore.recalculateProjectRisk(project.id);
    setAiAnalysis(null);
    window.location.reload();
  };

  const handleOpenInvestigation = () => {
    const newCase = appStore.createInvestigation(
      project.id,
      `Forensic Inquiry: Multi-layer Anomaly on #${project.project_code}`,
      project.risk_level
    );
    navigate(`/investigations/${newCase.id}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. PROJECT VOLUME HEADER & DOSSIER BANNER */}
      <VolumeHeader
        volume="VOLUME II — DOSSIER"
        title={`PROJECT DOSSIER: #${project.project_code}`}
        subtitle={`Official implementation and expenditure record registered under the ${project.state_name} jurisdiction.`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <ClassicalButton
              variant="secondary"
              size="md"
              icon={<Sparkles className="w-4 h-4 text-[#C9A962]" />}
              onClick={handleWhyFlaggedClick}
            >
              SYNTHESIZE EVIDENCE
            </ClassicalButton>

            <ClassicalButton
              variant="primary"
              size="md"
              icon={<FileSearch className="w-4 h-4 text-[#1C1714]" />}
              onClick={handleOpenInvestigation}
            >
              OPEN INVESTIGATION
            </ClassicalButton>

            <ClassicalButton
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5 text-[#C9A962]" />}
              title="Recalculate live risk engine"
              onClick={handleRecalculateRisk}
            >
              RE-AUDIT
            </ClassicalButton>
          </div>
        }
      />

      {/* 2. MAIN DOSSIER BANNER */}
      <DossierCard className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-['Cinzel'] font-bold text-xs tracking-widest px-2.5 py-1 bg-[#1C1714] text-[#C9A962] border border-[#C9A962]/40 rounded">
                #{project.project_code}
              </span>
              <span className="text-xs font-['Cinzel'] tracking-wider px-2.5 py-1 bg-[#3D332B] text-[#E8DFD4] border border-[#4A3F35] rounded">
                {project.category_name}
              </span>
              <span className="text-xs font-['Cinzel'] px-2.5 py-1 bg-[#1C1714] text-[#9C8B7A] border border-[#4A3F35] rounded">
                STATUS: {project.status.toUpperCase()}
              </span>
              {project.risk_score >= 80 && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#8B2635]/20 border border-[#8B2635] text-[#E8DFD4] rounded font-['Cinzel'] text-xs tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#8B2635]" /> PRIORITY FORENSIC AUDIT
                </div>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] leading-tight">
              {project.title}
            </h2>

            <p className="text-sm font-['Crimson_Pro'] text-[#9C8B7A] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C9A962] shrink-0" />
              <span>
                {project.location_name}, {project.district_name}, {project.state_name} (
                {project.latitude.toFixed(5)}° N, {project.longitude.toFixed(5)}° E)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#1C1714] p-4 border border-[#4A3F35] rounded">
            <div className="text-right font-['Cinzel']">
              <span className="text-[10px] text-[#9C8B7A] block tracking-wider">SANCTIONED AMOUNT</span>
              <span className="text-xl font-bold text-[#C9A962]">
                ₹{(project.sanctioned_amount / 100000).toFixed(2)} LAKH
              </span>
            </div>
            <div className="w-[1px] h-10 bg-[#4A3F35]" />
            <RiskBadge score={project.risk_score} size="md" />
          </div>
        </div>

        {/* Archival Dossier Tabs */}
        <div className="flex flex-wrap gap-1 pt-4 border-t border-[#4A3F35] font-['Cinzel'] text-xs tracking-wider">
          {[
            { id: 'overview', label: 'DOSSIER OVERVIEW & RISK' },
            { id: 'timeline', label: 'CHRONOLOGY' },
            { id: 'graph', label: 'RELATIONAL GRAPH' },
            { id: 'financials', label: `LEDGER (${transactions.length})` },
            { id: 'documents', label: `ARCHIVE RECORDS (${documents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 transition-all rounded-t border-b-2 font-semibold ${
                activeTab === tab.id
                  ? 'bg-[#1C1714] text-[#C9A962] border-[#C9A962]'
                  : 'text-[#9C8B7A] border-transparent hover:text-[#E8DFD4] hover:bg-[#1C1714]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </DossierCard>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: OVERVIEW & RISK BREAKDOWN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Project Metadata & Anomalies List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ClassicalCard className="p-6 space-y-4">
              <ArchiveLabel text="IMPLEMENTATION METADATA & JURISDICTION" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-['Crimson_Pro']">
                <div className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded">
                  <span className="text-[10px] font-['Cinzel'] tracking-wider text-[#9C8B7A] block">
                    MEMBER OF PARLIAMENT
                  </span>
                  <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#E8DFD4]">{project.mp_name}</p>
                  <p className="text-xs text-[#9C8B7A] italic">{project.constituency_name}</p>
                </div>
                <div className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded">
                  <span className="text-[10px] font-['Cinzel'] tracking-wider text-[#9C8B7A] block">
                    IMPLEMENTING AGENCY
                  </span>
                  <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#E8DFD4]">{project.implementing_agency}</p>
                </div>
                <div className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded">
                  <span className="text-[10px] font-['Cinzel'] tracking-wider text-[#9C8B7A] block">
                    AWARDED CONTRACTOR
                  </span>
                  <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#C9A962]">{project.vendor_name || 'Direct Execution'}</p>
                </div>
                <div className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded">
                  <span className="text-[10px] font-['Cinzel'] tracking-wider text-[#9C8B7A] block">
                    SANCTION GAZETTE DATE
                  </span>
                  <p className="font-['Cinzel'] text-sm font-semibold text-[#E8DFD4]">{project.sanction_date}</p>
                </div>
              </div>
            </ClassicalCard>

            {/* Detected Anomalies List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#E8DFD4]">
                  Forensic Risk Indicators ({anomalies.length})
                </h3>
                <span className="text-[10px] font-['Cinzel'] text-[#C9A962] tracking-widest">
                  ALGORITHM v2026.01
                </span>
              </div>

              {anomalies.map((anom) => (
                <ClassicalCard
                  key={anom.id}
                  className={`p-5 space-y-2.5 transition-all ${
                    anom.severity === 'CRITICAL'
                      ? 'border-l-4 border-l-[#8B2635] bg-[#2A1D1A]'
                      : 'border-l-4 border-l-[#C9A962] bg-[#251E19]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Cinzel'] text-xs font-bold px-2 py-0.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                      {anom.rule_code}
                    </span>
                    <span
                      className={`text-xs font-['Cinzel'] tracking-wider font-semibold ${
                        anom.severity === 'CRITICAL' ? 'text-[#C9A962]' : 'text-[#9C8B7A]'
                      }`}
                    >
                      {anom.category} • +{anom.score_impact} PTS
                    </span>
                  </div>
                  <h4 className="text-lg font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
                    {anom.title}
                  </h4>
                  <p className="text-sm font-['Crimson_Pro'] text-[#E8DFD4] leading-relaxed">
                    {anom.description}
                  </p>
                  <div className="text-xs font-['Crimson_Pro'] text-[#9C8B7A] italic border-t border-[#4A3F35] pt-2">
                    <strong className="text-[#C9A962] font-['Cinzel'] tracking-wide">EVIDENCE RECORD: </strong>
                    {anom.evidence_summary}
                  </div>
                </ClassicalCard>
              ))}
            </div>
          </div>

          {/* Right: Explainable Risk Gauge & Subscores (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ClassicalCard className="p-6 space-y-6 text-center">
              <ArchiveLabel text="COMPOSITE RISK RATING" />

              <div className="py-2">
                <RiskScoreGauge score={project.risk_score} size="lg" />
              </div>

              {/* Subscores breakdown */}
              <div className="space-y-3 pt-4 border-t border-[#4A3F35] text-left">
                <p className="text-xs font-['Cinzel'] tracking-wider text-[#C9A962] uppercase">
                  Explainable Factor Attribution
                </p>

                {[
                  { label: 'Financial Irregularities (25%)', score: project.subscores.financial },
                  { label: 'Timeline Chronology (20%)', score: project.subscores.timeline },
                  { label: 'Vendor Concentration (20%)', score: project.subscores.vendor },
                  { label: 'Geographic Overlap (15%)', score: project.subscores.geographic },
                  { label: 'Document & OCR Mismatches (15%)', score: project.subscores.documents },
                  { label: 'Semantic Duplication (5%)', score: project.subscores.duplicate },
                ].map((factor) => (
                  <div key={factor.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-['Crimson_Pro'] text-sm text-[#E8DFD4]">
                      <span>{factor.label}</span>
                      <span className="font-['Cinzel'] font-bold text-[#C9A962]">{factor.score}/100</span>
                    </div>
                    <div className="w-full bg-[#1C1714] h-2 rounded-full overflow-hidden border border-[#4A3F35]">
                      <div
                        className={`h-full ${
                          factor.score >= 80
                            ? 'bg-[#8B2635]'
                            : factor.score >= 60
                            ? 'bg-[#C9A962]'
                            : factor.score >= 30
                            ? 'bg-[#9C8B7A]'
                            : 'bg-[#4A3F35]'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ClassicalCard>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE TIMELINE */}
      {activeTab === 'timeline' && (
        <ClassicalCard className="p-6 md:p-8 space-y-6">
          <div className="border-b border-[#4A3F35] pb-3">
            <ArchiveLabel text="VOLUME IV — CHRONOLOGICAL RECORD" />
            <h3 className="text-2xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] mt-1">
              Forensic Chronological Evidence Sequence
            </h3>
            <p className="text-sm font-['Crimson_Pro'] text-[#9C8B7A]">
              Historical ledger timeline highlighting milestone inversions and conflicting transaction timestamps.
            </p>
          </div>

          <div className="relative pl-6 space-y-8 border-l-2 border-[#4A3F35] before:absolute before:-left-1.5 before:top-0 before:w-3 before:h-3 before:bg-[#C9A962] before:rounded-full">
            {/* Event 1: Sanction */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#251E19] border-2 border-[#C9A962]" />
              <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded">
                <span className="text-xs font-['Cinzel'] font-bold text-[#C9A962]">15-MAR-2024</span>
                <h4 className="font-['Cormorant_Garamond'] font-bold text-lg text-[#E8DFD4]">
                  Official Administrative Sanction Order Issued
                </h4>
                <p className="text-xs font-['Crimson_Pro'] text-[#9C8B7A]">
                  Sanction order #RES/485 for ₹48,50,000 gazetted by DM Prayagraj.
                </p>
              </div>
            </div>

            {/* Event 2: Inverted Completion Cert */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#8B2635] border-2 border-[#E8DFD4] animate-pulse" />
              <div className="p-4 bg-[#2A1D1A] border border-[#8B2635] rounded">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Cinzel'] font-bold text-[#8B2635]">28-FEB-2024 (INVERTED)</span>
                  <span className="text-xs font-['Cinzel'] font-bold text-[#8B2635] bg-[#1C1714] px-2 py-0.5 border border-[#8B2635] rounded">
                    CHRONOLOGICAL CONFLICT
                  </span>
                </div>
                <h4 className="font-['Cormorant_Garamond'] font-bold text-lg text-[#E8DFD4]">
                  Completion Certificate Signed (Predates Sanction by 15 Days!)
                </h4>
                <p className="text-xs font-['Crimson_Pro'] text-[#E8DFD4]">
                  File records indicate physical work completion certified prior to administrative funding sanction.
                </p>
              </div>
            </div>

            {/* Event 3: Milestone Disbursement 1 */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#251E19] border-2 border-[#C9A962]" />
              <div className="p-4 bg-[#1C1714] border border-[#4A3F35] rounded">
                <span className="text-xs font-['Cinzel'] font-bold text-[#C9A962]">15-APR-2024</span>
                <h4 className="font-['Cormorant_Garamond'] font-bold text-lg text-[#E8DFD4]">
                  First Running Bill Disbursed (₹18.20 Lakh)
                </h4>
                <p className="text-xs font-['Crimson_Pro'] text-[#9C8B7A]">
                  Invoice #INV-APX-884 cleared to Apex Infrastructure via PFMS portal.
                </p>
              </div>
            </div>

            {/* Event 4: Duplicate Disbursement */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#8B2635] border-2 border-[#E8DFD4]" />
              <div className="p-4 bg-[#2A1D1A] border border-[#8B2635] rounded">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-['Cinzel'] font-bold text-[#8B2635]">28-APR-2024 (DUPLICATE)</span>
                  <span className="text-xs font-['Cinzel'] font-bold text-[#8B2635] bg-[#1C1714] px-2 py-0.5 border border-[#8B2635] rounded">
                    DUAL PAYMENT DETECTED
                  </span>
                </div>
                <h4 className="font-['Cormorant_Garamond'] font-bold text-lg text-[#E8DFD4]">
                  Second Payout for Identical Invoice #INV-APX-884 (₹18.20 Lakh)
                </h4>
                <p className="text-xs font-['Crimson_Pro'] text-[#E8DFD4]">
                  Duplicate transaction reference PFMS/2024/TXN-91450 cleared for the same plinth beam milestone.
                </p>
              </div>
            </div>
          </div>
        </ClassicalCard>
      )}

      {/* TAB 3: EVIDENCE GRAPH NETWORK */}
      {activeTab === 'graph' && (
        <ClassicalCard className="p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#4A3F35] pb-3">
            <div>
              <ArchiveLabel text="RELATIONAL ENTITY MAP" />
              <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] mt-1">
                Relational Evidence Graph (Interactive Forensic Nodes)
              </h3>
              <p className="text-xs font-['Crimson_Pro'] text-[#9C8B7A]">
                Multi-entity relationships between contractors, duplicate invoices, and overlapping GPS boundaries.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#1C1714] text-xs font-['Cinzel'] font-bold text-[#C9A962] border border-[#4A3F35] rounded">
              TOPOLOGICAL MAP
            </span>
          </div>

          <div className="w-full h-96 bg-[#1C1714] border border-[#4A3F35] rounded relative overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Connectors */}
              <line x1="400" y1="200" x2="180" y2="100" stroke="#4A3F35" strokeWidth="2" strokeDasharray="5 5" />
              <line x1="400" y1="200" x2="620" y2="100" stroke="#8B2635" strokeWidth="2.5" />
              <line x1="400" y1="200" x2="220" y2="300" stroke="#8B2635" strokeWidth="2.5" />
              <line x1="400" y1="200" x2="580" y2="300" stroke="#C9A962" strokeWidth="2" strokeDasharray="5 5" />
              <line x1="620" y1="100" x2="720" y2="200" stroke="#8B2635" strokeWidth="2" strokeDasharray="4 4" />

              {/* Center Node: Project */}
              <g transform="translate(400, 200)">
                <circle r="46" fill="#251E19" stroke="#C9A962" strokeWidth="2.5" />
                <text textAnchor="middle" y="-6" fontFamily="Cinzel" fontWeight="bold" fontSize="11" fill="#E8DFD4">
                  MPLAD-10291
                </text>
                <text textAnchor="middle" y="14" fontFamily="Cinzel" fontSize="9" fill="#8B2635" fontWeight="bold">
                  91/100 CRITICAL
                </text>
              </g>

              {/* Node: Vendor Apex */}
              <g transform="translate(180, 100)">
                <rect x="-70" y="-25" width="140" height="50" rx="4" fill="#251E19" stroke="#4A3F35" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fontFamily="Cinzel" fontWeight="bold" fontSize="10" fill="#E8DFD4">
                  Apex Infrastructure
                </text>
                <text textAnchor="middle" y="14" fontFamily="Crimson Pro" fontSize="11" fill="#9C8B7A">
                  24 Constituency Works
                </text>
              </g>

              {/* Node: Duplicate Invoices */}
              <g transform="translate(620, 100)">
                <rect x="-75" y="-25" width="150" height="50" rx="4" fill="#2A1D1A" stroke="#8B2635" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fontFamily="Cinzel" fontWeight="bold" fontSize="10" fill="#E8DFD4">
                  Invoice #INV-APX-884
                </text>
                <text textAnchor="middle" y="14" fontFamily="Cinzel" fontSize="9" fill="#8B2635" fontWeight="bold">
                  2x Payouts (₹36.40 L)
                </text>
              </g>

              {/* Node: Ghost GPS Overlap */}
              <g transform="translate(220, 300)">
                <rect x="-75" y="-25" width="150" height="50" rx="4" fill="#2A1D1A" stroke="#8B2635" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fontFamily="Cinzel" fontWeight="bold" fontSize="10" fill="#E8DFD4">
                  GPS Overlap (8m)
                </text>
                <text textAnchor="middle" y="14" fontFamily="Crimson Pro" fontSize="11" fill="#9C8B7A">
                  2023 Panchayat Asset
                </text>
              </g>

              {/* Node: Completion Cert */}
              <g transform="translate(580, 300)">
                <rect x="-70" y="-25" width="140" height="50" rx="4" fill="#251E19" stroke="#C9A962" strokeWidth="1.5" />
                <text textAnchor="middle" y="-3" fontFamily="Cinzel" fontWeight="bold" fontSize="10" fill="#C9A962">
                  Completion Cert
                </text>
                <text textAnchor="middle" y="14" fontFamily="Crimson Pro" fontSize="11" fill="#9C8B7A">
                  Signed 28-Feb-2024
                </text>
              </g>
            </svg>
          </div>
        </ClassicalCard>
      )}

      {/* TAB 4: FINANCIALS */}
      {activeTab === 'financials' && (
        <ClassicalCard className="p-6 space-y-4">
          <ArchiveLabel text="EXPENDITURE LEDGER" />
          <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
            Disbursement Ledger & Payment Transactions
          </h3>
          <div className="overflow-x-auto border border-[#4A3F35] rounded">
            <table className="w-full text-left font-['Crimson_Pro'] text-sm">
              <thead>
                <tr className="bg-[#1C1714] border-b border-[#4A3F35] font-['Cinzel'] text-xs text-[#C9A962] tracking-wider">
                  <th className="p-3">Reference</th>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Amount (₹)</th>
                  <th className="p-3">Milestone Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4A3F35]/50 text-[#E8DFD4]">
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className={t.invoice_number === 'INV-APX-884' ? 'bg-[#8B2635]/10' : 'hover:bg-[#1C1714]/30'}
                  >
                    <td className="p-3 font-mono text-xs">{t.transaction_reference}</td>
                    <td className="p-3 font-['Cinzel'] font-bold text-[#C9A962]">{t.invoice_number}</td>
                    <td className="p-3 font-['Cinzel'] text-xs text-[#9C8B7A]">{t.payment_date}</td>
                    <td className="p-3 font-['Cinzel'] font-bold text-[#E8DFD4]">₹{t.amount.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-xs text-[#9C8B7A]">{t.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClassicalCard>
      )}

      {/* TAB 5: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <ClassicalCard
              key={doc.id}
              className={`p-5 space-y-3 ${
                doc.extraction?.mismatch_flags?.length ? 'border-l-4 border-l-[#8B2635] bg-[#2A1D1A]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-['Cinzel'] tracking-wider px-2 py-0.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                  {doc.document_type}
                </span>
                <span className="text-xs text-[#9C8B7A] font-mono">
                  {(doc.file_size_bytes / 1024).toFixed(0)} KB
                </span>
              </div>
              <h4 className="text-base font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] truncate">
                {doc.file_name}
              </h4>
              {doc.extraction && (
                <div className="text-xs p-3 bg-[#1C1714] border border-[#4A3F35] rounded space-y-1 font-['Crimson_Pro']">
                  <p>
                    <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px]">EXTRACTED SUM: </strong>
                    <span className="font-['Cinzel'] font-semibold text-[#E8DFD4]">
                      ₹{doc.extraction.extracted_amount?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </p>
                  <p>
                    <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px]">EXTRACTED DATE: </strong>
                    <span className="font-['Cinzel'] text-[#E8DFD4]">{doc.extraction.extracted_date || 'N/A'}</span>
                  </p>
                  {doc.extraction.mismatch_flags && (
                    <p className="text-[#8B2635] font-['Cinzel'] font-bold text-[11px] pt-1">
                      ⚠️ FLAGS: {doc.extraction.mismatch_flags.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </ClassicalCard>
          ))}
        </div>
      )}

      {/* 4. "WHY FLAGGED?" FORENSIC MODAL */}
      <ClassicalModal
        isOpen={isWhyFlaggedOpen}
        onClose={() => setIsWhyFlaggedOpen(false)}
        title={`FORENSIC SYNTHESIS: #${project.project_code}`}
        subtitle="AI-Powered Evidence Grounded Explanation Layer (Groq Llama-3.3 70B)"
        maxWidth="2xl"
        actions={
          <>
            <ClassicalButton variant="ghost" size="md" onClick={() => setIsWhyFlaggedOpen(false)}>
              DISMISS
            </ClassicalButton>
            <ClassicalButton
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setIsWhyFlaggedOpen(false);
                handleOpenInvestigation();
              }}
            >
              LAUNCH CASE INVESTIGATION
            </ClassicalButton>
          </>
        }
      >
        {isAiLoading ? (
          <div className="text-center py-12 space-y-3 font-['Crimson_Pro']">
            <div className="w-12 h-12 mx-auto border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin" />
            <h4 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
              Consulting the Sentinel Knowledge Graph...
            </h4>
            <p className="text-sm text-[#9C8B7A]">
              Cross-referencing Schedule of Rates, duplicate invoice hashes, and PostGIS geo-buffers.
            </p>
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-6 font-['Crimson_Pro'] text-[#E8DFD4]">
            {/* Top Summary Banner */}
            <div className="p-4 bg-[#1C1714] border border-[#C9A962]/50 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-['Cinzel'] font-bold uppercase tracking-wider text-[#C9A962]">
                  GROUNDED INVESTIGATION SUMMARY
                </span>
                <span className="text-xs font-['Cinzel'] font-bold text-[#9C8B7A]">
                  CONFIDENCE: {Math.round(aiAnalysis.confidence * 100)}%
                </span>
              </div>
              <p className="text-base text-[#E8DFD4] leading-relaxed font-semibold">
                {aiAnalysis.summary}
              </p>
            </div>

            {/* Key Findings List (Facts vs Inferences) */}
            <div className="space-y-3">
              <h4 className="text-lg font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
                Key Forensic Findings
              </h4>
              {aiAnalysis.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-['Cormorant_Garamond'] font-bold text-base text-[#E8DFD4]">
                      {finding.title}
                    </h5>
                    <span className="text-[10px] font-['Cinzel'] px-2 py-0.5 bg-[#8B2635]/20 text-[#E8DFD4] border border-[#8B2635] rounded">
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-xs text-[#9C8B7A]">
                    <strong className="text-[#C9A962] font-['Cinzel']">FACT: </strong> {finding.fact}
                  </p>
                  <p className="text-xs text-[#E8DFD4]">
                    <strong className="text-[#8B2635] font-['Cinzel']">INFERENCE: </strong> {finding.inference}
                  </p>
                </div>
              ))}
            </div>

            {/* Why it Matters */}
            <div className="p-3 bg-[#3D332B]/50 border border-[#C9A962]/40 rounded text-xs space-y-1">
              <strong className="font-['Cinzel'] text-[#C9A962] tracking-wider">WHY THIS MATTERS:</strong>
              <p className="text-[#E8DFD4]">{aiAnalysis.whyItMatters}</p>
            </div>

            {/* Recommended Next Steps */}
            <div className="space-y-2">
              <h4 className="text-base font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
                Recommended Investigation Protocol:
              </h4>
              <ul className="list-disc list-inside text-xs space-y-1 text-[#9C8B7A]">
                {aiAnalysis.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="text-[#E8DFD4]">{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </ClassicalModal>
    </div>
  );
};

