import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
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
    <div className="space-y-8 pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME III"
        title="RISK REGISTER & DETECTION ENGINE"
        subtitle="Explainable mathematical risk calculation engine cross-validating 6 forensic anomaly dimensions."
        action={
          <span className="font-['Cinzel'] text-xs font-bold px-3 py-1.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded tracking-widest">
            ALGORITHM v1.4.2-HYBRID
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
          <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
            <ArchiveLabel text="ACTIVE DETECTION RULES MATRIX" />
            <span className="text-[10px] font-['Cinzel'] text-[#9C8B7A] tracking-wider">
              6 CORE EVALUATORS
            </span>
          </div>

          {[
            {
              code: 'FIN-COST-001',
              title: 'Excessive Unit Cost Deviation',
              category: 'FINANCIAL',
              impact: '+18-25 PTS',
              desc: 'Flags projects where sanctioned cost exceeds standard Schedule of Rates benchmark by >40% without site terrain justification.',
              status: 'ACTIVE',
            },
            {
              code: 'FIN-DUP-002',
              title: 'Duplicate Payment Invoice Reference',
              category: 'FINANCIAL',
              impact: '+30 PTS',
              desc: 'Identifies multiple disbursements cleared against identical invoice numbers or hash signatures to the same contractor.',
              status: 'ACTIVE',
            },
            {
              code: 'TIME-SEQ-001',
              title: 'Completion Before Sanction Date',
              category: 'TIMELINE',
              impact: '+28 PTS',
              desc: 'Flags impossible milestone sequences where completion certificate timestamp predates administrative sanction authorization.',
              status: 'ACTIVE',
            },
            {
              code: 'GEO-DUP-001',
              title: 'GPS Coordinate Overlap (<25m)',
              category: 'GEOGRAPHIC',
              impact: '+28 PTS',
              desc: 'PostGIS spatial buffer detector flagging projects located within 25 meters of pre-existing completed infrastructure.',
              status: 'ACTIVE',
            },
            {
              code: 'VEN-CONC-001',
              title: 'High Vendor Concentration (HHI)',
              category: 'VENDOR',
              impact: '+18-24 PTS',
              desc: 'Detects single contractor securing over 60% of constituency works within one financial year.',
              status: 'ACTIVE',
            },
            {
              code: 'DOC-MIS-001',
              title: 'Invoice OCR Amount vs Sanction Mismatch',
              category: 'DOCUMENT',
              impact: '+18 PTS',
              desc: 'OCR parsing flags billed invoice total exceeding sanction ceiling or differing from milestone payment record.',
              status: 'ACTIVE',
            },
          ]
            .filter((r) => activeCategory === 'ALL' || r.category === activeCategory)
            .map((rule) => (
              <ClassicalCard key={rule.code} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-['Cinzel'] font-bold text-xs px-2 py-0.5 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                      {rule.code}
                    </span>
                    <span className="text-xs font-['Cinzel'] tracking-wider text-[#E8DFD4]">{rule.category}</span>
                  </div>
                  <span className="text-xs font-['Cinzel'] font-bold text-[#8B2635] bg-[#8B2635]/15 px-2 py-0.5 border border-[#8B2635] rounded">
                    {rule.impact}
                  </span>
                </div>
                <h4 className="text-lg font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">{rule.title}</h4>
                <p className="text-sm text-[#9C8B7A] font-['Crimson_Pro'] leading-relaxed">{rule.desc}</p>
              </ClassicalCard>
            ))}
        </div>

        {/* Right: High Risk Projects (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
            <ArchiveLabel text="FLAGGED IMPLEMENTATIONS" />
            <span className="text-[10px] font-['Cinzel'] text-[#8B2635] tracking-widest font-semibold">
              CRITICAL SEVERITY
            </span>
          </div>

          <div className="space-y-3">
            {criticalProjects.map((p) => (
              <ClassicalCard
                key={p.id}
                className={`p-4 space-y-2 transition-all ${
                  p.risk_score >= 80 ? 'border-l-4 border-l-[#8B2635] bg-[#2A1D1A]' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Cinzel'] font-bold text-xs text-[#C9A962]">{p.project_code}</span>
                  <RiskBadge score={p.risk_score} size="sm" />
                </div>
                <h4 className="font-['Cormorant_Garamond'] font-bold text-base text-[#E8DFD4] line-clamp-1">
                  {p.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-[#9C8B7A] font-['Crimson_Pro'] pt-2 border-t border-[#4A3F35]">
                  <span className="italic">{p.district_name}, {p.state_name}</span>
                  <Link to={`/projects/${p.project_code}`} className="font-['Cinzel'] font-bold text-[#C9A962] hover:text-[#E8DFD4] flex items-center gap-1 transition-colors">
                    EXAMINE DOSSIER <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </ClassicalCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

