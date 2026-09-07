import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch,
  Plus,
  ArrowRight,
  ShieldAlert,
  Archive,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  VolumeHeader,
  ArchiveLabel,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { InvestigationCase, InvestigationStatus } from '../types';

export const Investigations: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<InvestigationStatus | 'ALL'>('ALL');
  const investigations = appStore.getInvestigations();

  const filtered =
    filterStatus === 'ALL'
      ? investigations
      : investigations.filter((i) => i.status === filterStatus);

  const statuses: { id: InvestigationStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'ALL CASE DOSSIERS' },
    { id: 'NEW', label: 'NEW INQUIRIES' },
    { id: 'UNDER_REVIEW', label: 'UNDER REVIEW' },
    { id: 'ESCALATED', label: 'ESCALATED' },
    { id: 'RESOLVED', label: 'RESOLVED' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. VOLUME HEADER */}
      <VolumeHeader
        volume="VOLUME V"
        title="FORENSIC INVESTIGATION CASEBOOKS"
        subtitle="Formal inquiry casebooks, officer assignments, evidentiary records, and audit findings."
        action={
          <Link to="/projects">
            <ClassicalButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
              OPEN CASE FROM ARCHIVE
            </ClassicalButton>
          </Link>
        }
      />

      {/* 2. STATUS FILTER TABS */}
      <div className="flex flex-wrap gap-2 font-['Cinzel'] text-xs">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStatus(s.id)}
            className={`px-4 py-2 font-bold rounded transition-all tracking-wider border ${
              filterStatus === s.id
                ? 'bg-[#1C1714] text-[#C9A962] border-[#C9A962] shadow-md'
                : 'bg-[#251E19] text-[#9C8B7A] border-[#4A3F35] hover:text-[#E8DFD4] hover:border-[#C9A962]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 3. CASEBOOK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((inv) => (
          <DossierCard
            key={inv.id}
            className={`p-6 space-y-4 ${
              inv.priority === 'CRITICAL' ? 'border-l-4 border-l-[#8B2635] bg-[#2A1D1A]' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Cinzel'] font-bold text-xs px-2.5 py-1 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                CASE #{inv.case_number}
              </span>
              <span
                className={`text-[10px] font-['Cinzel'] font-bold px-2.5 py-1 border rounded uppercase tracking-wider ${
                  inv.status === 'UNDER_REVIEW'
                    ? 'bg-[#3D332B] text-[#C9A962] border-[#C9A962]'
                    : inv.status === 'ESCALATED'
                    ? 'bg-[#8B2635]/20 text-[#E8DFD4] border-[#8B2635]'
                    : 'bg-[#1C1714] text-[#9C8B7A] border-[#4A3F35]'
                }`}
              >
                {inv.status}
              </span>
            </div>

            <h3 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] leading-snug">
              {inv.title}
            </h3>

            <div className="p-3 bg-[#1C1714] border border-[#4A3F35] rounded space-y-1.5 text-xs font-['Crimson_Pro'] text-[#E8DFD4]">
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px]">LINKED RECORD: </strong>
                #{inv.project_code} — {inv.project_title}
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px]">ASSIGNED OFFICER: </strong>
                {inv.assigned_officer_name || 'Unassigned'}
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px]">EVIDENCE RECORDS: </strong>
                {inv.evidence_count} Attached Exhibits
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#4A3F35]">
              <RiskBadge score={inv.risk_score} size="sm" />

              <Link to={`/investigations/${inv.id}`}>
                <ClassicalButton
                  variant="secondary"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  ENTER CASEBOOK
                </ClassicalButton>
              </Link>
            </div>
          </DossierCard>
        ))}
      </div>
    </div>
  );
};

