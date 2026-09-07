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
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  RiskBadge,
  EmptyState,
  VolumeHeader,
  ArchiveLabel,
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
        title={`CASEBOOK INQUIRY: #${inv.case_number}`}
        subtitle={`Classified institutional investigation record into execution irregularities.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ClassicalButton
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange('ESCALATED')}
            >
              ⚠️ ESCALATE TO AUDIT GENERAL
            </ClassicalButton>
            <ClassicalButton
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange('RESOLVED')}
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

      <DossierCard className="p-6 md:p-8 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-['Cinzel'] font-bold text-xs px-2.5 py-1 bg-[#1C1714] text-[#C9A962] border border-[#4A3F35] rounded">
                CASE #{inv.case_number}
              </span>
              <span className="text-xs font-['Cinzel'] font-bold px-2.5 py-1 bg-[#3D332B] text-[#E8DFD4] border border-[#4A3F35] rounded">
                STATUS: {inv.status}
              </span>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#8B2635]/20 text-[#E8DFD4] border border-[#8B2635] rounded text-xs font-['Cinzel'] tracking-wider">
                <ShieldAlert className="w-3.5 h-3.5 text-[#8B2635]" /> CONFIDENTIAL INQUIRY
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] font-bold text-[#E8DFD4]">
              {inv.title}
            </h2>

            <p className="text-sm font-['Crimson_Pro'] text-[#9C8B7A]">
              Linked Asset:{' '}
              <Link
                to={`/projects/${inv.project_code}`}
                className="font-semibold text-[#C9A962] hover:text-[#E8DFD4] underline ml-1"
              >
                #{inv.project_code} — {inv.project_title}
              </Link>
            </p>
          </div>
        </div>
      </DossierCard>

      {/* 2. MAIN WORKSPACE (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Investigator Forensic Notes */}
        <div className="lg:col-span-7 space-y-6">
          <ClassicalCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#4A3F35] pb-2">
              <ArchiveLabel text={`OFFICER CASE NOTES (${notes.length})`} />
              <span className="text-[10px] font-['Cinzel'] text-[#9C8B7A]">APPEND-ONLY / TIMESTAMPED</span>
            </div>

            {/* Note Entry Form */}
            <form onSubmit={handleAddNote} className="space-y-3 pt-2">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log physical site inspection observations, treasury voucher discrepancies, or vendor summon details..."
                className="w-full p-3 bg-[#1C1714] border border-[#4A3F35] rounded font-['Crimson_Pro'] text-sm text-[#E8DFD4] focus:outline-none focus:border-[#C9A962]"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-['Cinzel'] text-[#9C8B7A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="rounded border-[#4A3F35] bg-[#1C1714]"
                  />
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#8B2635]" /> RESTRICTED INTERNAL RECORD
                  </span>
                </label>

                <ClassicalButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  disabled={!newNote.trim()}
                >
                  APPEND NOTE
                </ClassicalButton>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-3 pt-4 border-t border-[#4A3F35]">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 border rounded space-y-2 ${
                    note.is_confidential
                      ? 'bg-[#2A1D1A] border-[#8B2635]'
                      : 'bg-[#1C1714] border-[#4A3F35]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-['Cinzel']">
                    <span className="font-bold text-[#C9A962]">
                      ✍️ {note.author_name} ({note.author_role})
                    </span>
                    <span className="text-[#9C8B7A] font-mono text-[11px]">
                      {new Date(note.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-['Crimson_Pro'] text-[#E8DFD4] leading-relaxed">
                    {note.note_text}
                  </p>
                </div>
              ))}
            </div>
          </ClassicalCard>
        </div>

        {/* Right Column (5 cols): Case Metadata & Evidence Dossier */}
        <div className="lg:col-span-5 space-y-6">
          <ClassicalCard className="p-6 space-y-4">
            <ArchiveLabel text="CASE DOSSIER METADATA" />
            <div className="space-y-2 text-xs font-['Crimson_Pro'] text-[#E8DFD4]">
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">ASSIGNED INVESTIGATOR: </strong>
                {inv.assigned_officer_name}
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">SANCTIONED OUTLAY: </strong>
                ₹{project?.sanctioned_amount.toLocaleString('en-IN')}
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">CONTRACTOR IN QUESTION: </strong>
                {project?.vendor_name || 'Direct Res'}
              </p>
              <div className="pt-2">
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block mb-1">RISK SEVERITY: </strong>
                <RiskBadge score={inv.risk_score} size="sm" />
              </div>
            </div>
          </ClassicalCard>

          <ClassicalCard className="p-6 space-y-3 border-l-4 border-l-[#8B2635] bg-[#2A1D1A]">
            <ArchiveLabel text="RECOMMENDED AUDIT DIRECTIVES" />
            <ul className="list-disc list-inside text-xs space-y-2 font-['Crimson_Pro'] text-[#E8DFD4]">
              <li>Freeze milestone disbursement for Invoice #INV-APX-884 pending forensic verification.</li>
              <li>Dispatch Prayagraj District Vigilance squad for geo-tagged physical asset inspection.</li>
              <li>Issue formal clarification notice to Executive Engineer, Rural Engineering Services.</li>
            </ul>
          </ClassicalCard>
        </div>
      </div>
    </div>
  );
};

