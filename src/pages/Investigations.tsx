import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch,
  Plus,
  ArrowRight,
  ShieldAlert,
  Archive,
  Clock,
  UserCheck,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
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
        title="Forensic Investigation Casebooks"
        subtitle="Formal inquiry casebooks, officer assignments, evidentiary records, and parliamentary audit findings."
        action={
          <div className="flex items-center gap-3">
            <LiveStatusPill label="AUDIT DOCKET" />
            <Link to="/projects">
              <ClassicalButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
                OPEN CASE FROM ARCHIVE
              </ClassicalButton>
            </Link>
          </div>
        }
      />

      {/* 2. STATUS FILTER TABS */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStatus(s.id)}
            className={`px-4 py-2 font-bold rounded-xl transition-all tracking-wider border ${
              filterStatus === s.id
                ? 'bg-[#c9b8a0]/15 text-[#e8d5b7] light:text-slate-900 border-[#c9b8a0] shadow-[0_0_15px_rgba(201,184,160,0.2)]'
                : 'bg-white/[0.03] light:bg-slate-100 text-zinc-400 light:text-slate-600 border-white/10 light:border-slate-300 hover:text-white hover:border-[#c9b8a0]/50'
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
            className={`p-6 space-y-4 border-beam-card ${
              inv.priority === 'CRITICAL' ? 'border-l-4 border-l-red-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs px-2.5 py-1 bg-white/5 light:bg-slate-200 text-[#c9b8a0] light:text-slate-900 border border-white/10 light:border-slate-300 rounded-lg">
                CASE #{inv.case_number}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-1 border rounded-lg uppercase tracking-wider ${
                  inv.status === 'UNDER_REVIEW'
                    ? 'bg-amber-950/40 light:bg-amber-50 text-amber-300 light:text-amber-700 border-amber-500/30'
                    : inv.status === 'ESCALATED'
                    ? 'bg-red-950/40 light:bg-red-50 text-red-300 light:text-red-700 border-red-500/30'
                    : inv.status === 'RESOLVED'
                    ? 'bg-emerald-950/40 light:bg-emerald-50 text-emerald-300 light:text-emerald-700 border-emerald-500/30'
                    : 'bg-white/5 light:bg-slate-100 text-zinc-400 light:text-slate-600 border-white/10 light:border-slate-200'
                }`}
              >
                {inv.status.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-xl font-bold font-serif text-white light:text-slate-900 leading-snug">
              {inv.title}
            </h3>

            <p className="text-xs text-zinc-400 light:text-slate-600 line-clamp-2 leading-relaxed">
              {inv.resolution_summary || `Statutory investigation docket into execution discrepancies on ${inv.project_title}.`}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 light:border-slate-200 text-xs font-mono text-zinc-400 light:text-slate-500">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 light:text-slate-400 block">ASSIGNED LEAD</span>
                <span className="text-white light:text-slate-800 font-medium">{inv.assigned_officer_name || 'Unassigned'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 light:text-slate-400 block">PRIORITY TIER</span>
                <span
                  className={`font-bold ${
                    inv.priority === 'CRITICAL' ? 'text-red-400 light:text-red-600' : 'text-[#c9b8a0] light:text-amber-700'
                  }`}
                >
                  {inv.priority}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link to={`/investigations/${inv.id}`}>
                <ClassicalButton
                  variant="primary"
                  size="sm"
                  className="w-full justify-between"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  INSPECT EVIDENCE & NOTES
                </ClassicalButton>
              </Link>
            </div>
          </DossierCard>
        ))}
      </div>
    </div>
  );
};
