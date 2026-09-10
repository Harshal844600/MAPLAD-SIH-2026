import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileSearch,
  Lock,
  Plus,
  Send,
  Download,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  FileCheck,
  Building,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Clock,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  EmptyState,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';
import { InvestigationStatus } from '../types';

export const InvestigationDetails: React.FC = () => {
  const { investigationId } = useParams<{ investigationId: string }>();
  const inv = appStore.getInvestigationById(investigationId || 'inv-10291');

  const [newNote, setNewNote] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [notes, setNotes] = useState(
    inv ? appStore.getInvestigationNotes(inv.id) : []
  );

  if (!inv) {
    return (
      <EmptyState
        title="INVESTIGATION RECORD NOT FOUND"
        description={`The inquiry casebook for index "${investigationId}" does not exist in the archival registry.`}
      />
    );
  }

  const project = appStore.getProjectById(inv.project_id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const added = appStore.addInvestigationNote(inv.id, newNote, isConfidential);
    setNotes([added, ...notes]);
    setNewNote('');
  };

  const handleStatusChange = (status: InvestigationStatus) => {
    appStore.updateInvestigationStatus(inv.id, status);
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. CASE VOLUME HEADER & DOSSIER BANNER */}
      <VolumeHeader
        volume="VOLUME V — CASEBOOK"
        title={`Inquiry Casebook #${inv.case_number}`}
        subtitle="Classified institutional investigation record into execution irregularities and fund allocations."
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <LiveStatusPill label="CLASSIFIED INQUIRY" />
            <ClassicalButton
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange('ESCALATED')}
              className="text-red-400 border-red-500/30 hover:bg-red-500/10"
            >
              ⚠️ ESCALATE TO CAG
            </ClassicalButton>
            <ClassicalButton
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange('RESOLVED')}
              className="text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            >
              ✅ CONCLUDE INQUIRY
            </ClassicalButton>
            <Link to="/reports">
              <ClassicalButton
                variant="primary"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
              >
                EXPORT CASE DOSSIER
              </ClassicalButton>
            </Link>
          </div>
        }
      />

      {/* 2. CASE BANNER */}
      <DossierCard className="p-6 md:p-8 space-y-4 border-beam-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-xs px-3 py-1 bg-white/5 light:bg-slate-200 text-[#c9b8a0] light:text-slate-900 border border-white/10 light:border-slate-300 rounded-lg">
              CASE #{inv.case_number}
            </span>
            <span
              className={`text-xs font-mono font-bold px-3 py-1 border rounded-lg uppercase tracking-wider ${
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

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 light:text-slate-600">
            <span>PRIORITY: <strong className="text-red-400 light:text-red-600">{inv.priority}</strong></span>
            <span>ASSIGNED: <strong className="text-white light:text-slate-900">{inv.assigned_officer_name || 'Assigned Officer'}</strong></span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold font-serif text-white light:text-slate-900">
          {inv.title}
        </h2>
        <p className="text-sm text-zinc-300 light:text-slate-700 leading-relaxed max-w-4xl">
          {inv.resolution_summary || `Statutory inquiry record into anomalies and fund drawdowns associated with ${inv.project_title}.`}
        </p>

        {project && (
          <div className="mt-4 p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 light:text-slate-400">
                LINKED ASSET INQUIRY
              </span>
              <p className="font-bold text-sm text-white light:text-slate-900">
                {project.title} (<span className="font-mono text-[#c9b8a0]">#{project.project_code}</span>)
              </p>
            </div>
            <Link to={`/projects/${project.project_code}`}>
              <ClassicalButton variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                OPEN ASSET PROFILE
              </ClassicalButton>
            </Link>
          </div>
        )}
      </DossierCard>

      {/* 3. GRID: OFFICER NOTES & INVESTIGATION FINDINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Confidential Notes & Log (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ClassicalCard className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#c9b8a0]" />
                <h3 className="text-lg font-bold font-serif text-white light:text-slate-900">
                  Officer Field Notes & Chain of Evidence
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 light:text-slate-500">
                {notes.length} Recorded Entries
              </span>
            </div>

            {/* Note Submission Form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Append formal witness testimony, site audit findings, or discrepancy notes..."
                rows={3}
                className="w-full p-3.5 bg-black/40 light:bg-white border border-white/15 light:border-slate-300 rounded-xl text-xs text-white light:text-slate-900 placeholder:text-zinc-600 light:placeholder:text-slate-400 focus:outline-none focus:border-[#c9b8a0] resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-400 light:text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="accent-[#c9b8a0] rounded"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#c9b8a0]" />
                  <span>Mark as Confidential / Restricted Clearance</span>
                </label>
                <ClassicalButton variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                  SUBMIT ENTRY
                </ClassicalButton>
              </div>
            </form>

            {/* Notes Timeline */}
            <div className="space-y-4 pt-4 border-t border-white/10 light:border-slate-200">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-xl border ${
                    n.is_confidential
                      ? 'bg-red-950/20 light:bg-red-50/60 border-red-500/30'
                      : 'bg-white/[0.02] light:bg-slate-50 border-white/10 light:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 light:text-slate-500 mb-2">
                    <span className="font-bold text-white light:text-slate-900 flex items-center gap-1.5">
                      {n.is_confidential && <Lock className="w-3 h-3 text-red-400 light:text-red-600" />}
                      {n.author_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-200 light:text-slate-800 leading-relaxed font-sans">
                    {n.note_text}
                  </p>
                </div>
              ))}
            </div>
          </ClassicalCard>
        </div>

        {/* Right: Key Evidence Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <ClassicalCard className="p-6 space-y-4">
            <ArchiveLabel text="STATUTORY AUDIT MILESTONES" />
            <h4 className="text-lg font-bold font-serif text-white light:text-slate-900">
              Inquiry Progression
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] light:bg-slate-100 border border-white/5 light:border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="text-white light:text-slate-900 block">1. Automated Anomaly Flagging</strong>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px]">Sentinel Engine Score: 88/100</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] light:bg-slate-100 border border-white/5 light:border-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <strong className="text-white light:text-slate-900 block">2. PostGIS Physical Audit</strong>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px]">8-meter duplication verified</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] light:bg-slate-100 border border-white/5 light:border-slate-200">
                <ShieldAlert className="w-4 h-4 text-amber-400 mt-0.5" />
                <div>
                  <strong className="text-white light:text-slate-900 block">3. Vendor Summons Issued</strong>
                  <span className="text-zinc-500 light:text-slate-500 font-mono text-[10px]">Formal notice sent to Apex Infra</span>
                </div>
              </div>
            </div>
          </ClassicalCard>
        </div>
      </div>
    </div>
  );
};
