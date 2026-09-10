import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Layers,
  Database,
  MapPin,
  Clock,
  Fingerprint,
  FileCheck,
} from 'lucide-react';
import {
  ClassicalCard,
  RiskBadge,
  ClassicalTabs,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { AnomalyCategory } from '../types';

export const RiskIntelligence: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<AnomalyCategory | 'ALL'>('ALL');

  const categories: { id: AnomalyCategory | 'ALL'; label: string; count: number }[] = [
    { id: 'ALL', label: 'ALL FORENSIC LAYERS', count: 124 },
    { id: 'FINANCIAL', label: 'FINANCIAL (COST & INVOICES)', count: 48 },
    { id: 'TIMELINE', label: 'TIMELINE & MILESTONES', count: 26 },
    { id: 'VENDOR', label: 'VENDOR CONCENTRATION', count: 18 },
    { id: 'GEOGRAPHIC', label: 'GEOGRAPHIC OVERLAP', count: 14 },
    { id: 'DOCUMENT', label: 'DOCUMENT & OCR MISMATCHES', count: 12 },
    { id: 'DUPLICATE', label: 'SEMANTIC DUPLICATION', count: 6 },
  ];

  const criticalProjects = appStore.getProjects({
    riskLevel: 'CRITICAL',
    pageSize: 6,
  }).items;

  return (
    <div className="space-y-8 pb-12 animate-page-enter">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME III"
        title="Risk Register & Forensic Detection Matrix"
        subtitle="Explainable mathematical risk calculation engine cross-validating 6 forensic anomaly dimensions in real time."
        action={
          <span className="font-mono text-xs font-bold px-3 py-1.5 bg-white/[0.04] text-[#e8d5b7] border border-[#a78b71]/30 rounded-full tracking-wider shadow-sm">
            ALGORITHM v2026.01-HYBRID
          </span>
        }
      />

      {/* 2. CATEGORY FILTER TABS */}
      <ClassicalTabs
        tabs={categories.map((c) => ({
          id: c.id,
          label: c.label,
          count: c.count,
        }))}
        activeTab={activeCategory}
        onChange={(id) => setActiveCategory(id as any)}
      />

      {/* 3. MAIN GRID: ACTIVE ANOMALY RULES & HIGHEST RISK CASES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Forensic Rules Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <ArchiveLabel text="ACTIVE DETECTION RULES MATRIX" />
            <span className="text-[10px] font-mono text-[#c9b8a0] tracking-wider uppercase">
              6 CORE EVALUATORS
            </span>
          </div>

          {[
            {
              code: 'FIN-COST-001',
              title: 'Excessive Unit Cost Deviation',
              category: 'FINANCIAL',
              impact: '+25 PTS',
              desc: 'Flags line items where sanctioned cost exceeds official state Schedule of Rates (SoR) standard benchmarks by >40%.',
              icon: Database,
            },
            {
              code: 'FIN-DUP-002',
              title: 'Duplicate Payment Invoice Reference',
              category: 'FINANCIAL',
              impact: '+30 PTS',
              desc: 'Identifies multiple disbursements cleared against identical invoice numbers or hash signatures to the same contractor entity.',
              icon: Scale,
            },
            {
              code: 'TIME-SEQ-001',
              title: 'Completion Before Sanction Date',
              category: 'TIMELINE',
              impact: '+28 PTS',
              desc: 'Flags impossible milestone sequences where completion certificate timestamp predates administrative sanction authorization.',
              icon: Clock,
            },
            {
              code: 'GEO-DUP-001',
              title: 'GPS Coordinate Proximity (<25m)',
              category: 'GEOGRAPHIC',
              impact: '+28 PTS',
              desc: 'PostGIS spatial buffer detector flagging infrastructure located within 25 meters of pre-existing completed assets.',
              icon: MapPin,
            },
            {
              code: 'VEN-CONC-001',
              title: 'High Vendor Concentration (HHI)',
              category: 'VENDOR',
              impact: '+24 PTS',
              desc: 'Detects single contractor capturing over 60% of total constituency tenders within one financial allocation cycle.',
              icon: Fingerprint,
            },
            {
              code: 'DOC-MIS-001',
              title: 'Invoice OCR Amount vs Sanction Ceiling',
              category: 'DOCUMENT',
              impact: '+18 PTS',
              desc: 'OCR parsing flags billed invoice total exceeding sanction ceiling or differing from milestone measurement records.',
              icon: FileCheck,
            },
          ]
            .filter((r) => activeCategory === 'ALL' || r.category === activeCategory)
            .map((rule) => {
              const Icon = rule.icon;
              return (
                <div
                  key={rule.code}
                  className="p-5 bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#a78b71]/50 rounded-[24px] space-y-2.5 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(167,139,113,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 bg-black/40 text-[#e8d5b7] border border-white/10 rounded-full">
                        {rule.code}
                      </span>
                      <span className="text-xs font-mono tracking-wider text-gray-400">{rule.category}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/30 px-2.5 py-1 border border-rose-500/40 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                      {rule.impact}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold font-['Playfair_Display'] text-white flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#c9b8a0]" />
                    {rule.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 font-['Inter'] leading-relaxed">{rule.desc}</p>
                </div>
              );
            })}
        </div>

        {/* Right: High Risk Projects (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <ArchiveLabel text="FLAGGED IMPLEMENTATIONS" />
            <span className="text-[10px] font-mono text-rose-400 tracking-wider font-semibold uppercase">
              CRITICAL SEVERITY
            </span>
          </div>

          <div className="space-y-3">
            {criticalProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 bg-rose-950/15 backdrop-blur-md border border-rose-500/30 hover:border-rose-500/60 rounded-[24px] space-y-2.5 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#e8d5b7]">#{p.project_code}</span>
                  <RiskBadge score={p.risk_score} size="sm" />
                </div>
                <h4 className="font-['Playfair_Display'] font-semibold text-base text-white line-clamp-1">
                  {p.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-gray-300 font-['Inter'] pt-2.5 border-t border-white/10">
                  <span className="truncate">{p.district_name}, {p.state_name}</span>
                  <Link
                    to={`/projects/${p.project_code}`}
                    className="font-mono font-semibold text-[#c9b8a0] hover:text-white flex items-center gap-1 transition-colors shrink-0 ml-2"
                  >
                    EXAMINE <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
