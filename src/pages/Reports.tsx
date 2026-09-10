import React, { useState } from 'react';
import {
  Printer,
  Download,
  ShieldAlert,
  FileText,
  Calendar,
  CheckCircle2,
  FileCheck,
  Building,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  WaxSeal,
  VolumeHeader,
  ArchiveLabel,
  LiveStatusPill,
} from '../components/ui';
import { appStore } from '../services/store/appStore';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'dossier' | 'executive'>('dossier');
  const flagshipProject = appStore.getProjectById('MPLAD-10291')!;
  const anomalies = appStore.getProjectAnomalies(flagshipProject.id);
  const kpis = appStore.getSystemKPIs();

  const handlePrint = () => {
    window.print();
    appStore.logAudit('REPORT_PRINTED', 'REPORT', undefined, { type: reportType });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 light:border-slate-200 pb-4 no-print">
        <VolumeHeader
          volume="VOLUME V"
          title="Archive & Official Publications"
          subtitle="Formal statutory audit dossiers formatted for parliamentary and ministerial submission."
        />

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 light:bg-slate-100 border border-white/10 light:border-slate-300 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setReportType('dossier')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                reportType === 'dossier'
                  ? 'bg-[#c9b8a0]/20 text-[#e8d5b7] light:text-slate-900 border border-[#c9b8a0]/40'
                  : 'text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              CASE DOSSIER (#10291)
            </button>
            <button
              onClick={() => setReportType('executive')}
              className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                reportType === 'executive'
                  ? 'bg-[#c9b8a0]/20 text-[#e8d5b7] light:text-slate-900 border border-[#c9b8a0]/40'
                  : 'text-zinc-400 light:text-slate-600 hover:text-white'
              }`}
            >
              EXECUTIVE BRIEFING
            </button>
          </div>

          <ClassicalButton
            variant="primary"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            PRINT / SAVE PDF
          </ClassicalButton>
        </div>
      </div>

      {/* PRINTABLE DOSSIER CONTAINER */}
      {reportType === 'dossier' ? (
        <DossierCard className="p-8 md:p-12 space-y-8 print:border-none print:shadow-none print:p-0 border-beam-card">
          {/* Official Letterhead */}
          <div className="text-center border-b border-white/10 light:border-slate-200 pb-6 space-y-2 relative">
            <div className="absolute top-0 right-0">
              <WaxSeal icon="★" size="md" />
            </div>
            <ArchiveLabel text="CONFIDENTIAL STATUTORY AUDIT DOSSIER" />
            <h3 className="text-2xl md:text-3xl font-bold font-serif uppercase tracking-wider text-white light:text-slate-900 mt-2">
              Government of India • Ministry of Statistics & Programme Implementation
            </h3>
            <p className="text-xs font-mono font-bold text-[#c9b8a0] light:text-amber-800 tracking-widest">
              MPLADS FORENSIC RISK INTELLIGENCE DIVISION • CASE DOSSIER #INV-2026-10291
            </p>
          </div>

          {/* Project Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono p-5 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl">
            <div className="space-y-2">
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">PROJECT CODE</span>
                <span className="font-bold text-[#c9b8a0] light:text-amber-800">#{flagshipProject.project_code}</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">PROJECT TITLE</span>
                <span className="text-white light:text-slate-900 font-sans font-semibold">{flagshipProject.title}</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">CONSTITUENCY JURISDICTION</span>
                <span className="text-zinc-300 light:text-slate-800">{flagshipProject.constituency_name} ({flagshipProject.state_name})</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">MEMBER OF PARLIAMENT</span>
                <span className="text-zinc-300 light:text-slate-800">{flagshipProject.mp_name}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">SANCTIONED OUTLAY</span>
                <span className="text-white light:text-slate-900 font-bold">₹{flagshipProject.sanctioned_amount.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">DISBURSED TO DATE</span>
                <span className="text-white light:text-slate-900 font-bold">₹{flagshipProject.utilized_amount.toLocaleString('en-IN')} (100%)</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">AWARDED CONTRACTOR</span>
                <span className="text-zinc-300 light:text-slate-800">{flagshipProject.vendor_name}</span>
              </div>
              <div>
                <span className="text-zinc-500 light:text-slate-500 text-[10px] block">ALGORITHMIC RISK RATING</span>
                <span className="font-bold text-red-400 light:text-red-600">91 / 100 (CRITICAL)</span>
              </div>
            </div>
          </div>

          {/* Executive Findings */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold font-serif text-white light:text-slate-900 border-b border-white/10 light:border-slate-200 pb-2">
              1. Summary of Detected Irregularities
            </h4>
            <p className="text-sm leading-relaxed text-zinc-300 light:text-slate-700 font-sans">
              Algorithmic examination across the financial, chronological, and geospatial layers
              identified 5 major inconsistencies on Project #{flagshipProject.project_code}. Multi-layer
              cross-referencing indicates probable duplicate invoice disbursement and spatial overlap
              with pre-existing asset infrastructure.
            </p>

            <div className="space-y-3">
              {anomalies.map((a, i) => (
                <div key={a.id} className="p-4 border border-white/10 light:border-slate-200 bg-white/[0.02] light:bg-slate-50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="font-bold text-white light:text-slate-900">
                      {i + 1}. [{a.rule_code}] {a.title}
                    </span>
                    <span className="text-red-400 light:text-red-600 font-bold text-[10px] bg-red-950/40 light:bg-red-50 px-2 py-0.5 rounded border border-red-500/30">
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-zinc-300 light:text-slate-700 font-sans">{a.description}</p>
                  <p className="text-zinc-400 light:text-slate-500 text-xs pt-1 font-mono">
                    <strong className="text-[#c9b8a0] light:text-amber-800">EVIDENCE REF: </strong> {a.evidence_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Investigator Directives */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold font-serif text-white light:text-slate-900 border-b border-white/10 light:border-slate-200 pb-2">
              2. Investigator Officer Directives & Statutory Actions
            </h4>
            <div className="p-5 bg-red-950/20 light:bg-red-50/70 border border-red-500/30 rounded-xl text-xs space-y-2.5 text-zinc-200 light:text-slate-800">
              <p>
                <strong className="text-[#c9b8a0] light:text-amber-800 font-mono">DIRECTIVE 1: </strong> Direct District Magistrate Prayagraj to freeze subsequent fund drawdowns for RES Division Project #10291.
              </p>
              <p>
                <strong className="text-[#c9b8a0] light:text-amber-800 font-mono">DIRECTIVE 2: </strong> Issue formal summon to Apex Infrastructure & Heavy Works Ltd. regarding duplicate clearing of Invoice #INV-APX-884.
              </p>
              <p>
                <strong className="text-[#c9b8a0] light:text-amber-800 font-mono">DIRECTIVE 3: </strong> Mobilize State Quality Monitor (SQM) for physical verification survey at Gram Panchayat Saidabad.
              </p>
            </div>
          </div>

          {/* Sign-Off Block */}
          <div className="pt-8 border-t border-white/10 light:border-slate-200 flex justify-between items-end text-xs font-mono text-zinc-400 light:text-slate-500">
            <div>
              <p>Date of Report Generation: {new Date().toLocaleDateString('en-IN')}</p>
              <p>System Verifier: Sentinel Forensic Engine v2.0</p>
            </div>
            <div className="text-right space-y-1">
              <div className="h-10 border-b border-white/20 light:border-slate-300 w-48 ml-auto" />
              <p className="font-serif font-bold text-base text-white light:text-slate-900">Dr. Rameshwar Sharma, IAS</p>
              <p className="font-mono text-[10px] text-zinc-500 light:text-slate-500">Principal Director of Audits & Inspections</p>
            </div>
          </div>
        </DossierCard>
      ) : (
        /* EXECUTIVE SUMMARY VIEW */
        <DossierCard className="p-8 space-y-6 border-beam-card">
          <div className="text-center border-b border-white/10 light:border-slate-200 pb-4">
            <ArchiveLabel text="STATISTICAL BRIEFING" />
            <h3 className="text-2xl font-bold font-serif uppercase text-white light:text-slate-900 mt-1">
              National MPLADS Implementation Briefing
            </h3>
            <p className="text-xs font-mono text-zinc-400 light:text-slate-500 tracking-wider">QUARTERLY AUDIT CYCLE • ALL SCHEME DATA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono">
            <div className="p-6 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl">
              <span className="text-xs text-zinc-400 light:text-slate-500 tracking-wider block">TOTAL AUDITED WORKS</span>
              <p className="text-3xl font-bold text-white light:text-slate-900 font-serif mt-1">{kpis.totalProjects}</p>
            </div>
            <div className="p-6 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-xl">
              <span className="text-xs text-zinc-400 light:text-slate-500 tracking-wider block">SANCTIONED OUTLAY</span>
              <p className="text-3xl font-bold text-[#c9b8a0] light:text-amber-800 font-serif mt-1">
                ₹{(kpis.totalSanctioned / 10000000).toFixed(1)} Cr
              </p>
            </div>
            <div className="p-6 bg-red-950/20 light:bg-red-50 border border-red-500/30 rounded-xl">
              <span className="text-xs text-red-400 light:text-red-600 tracking-wider block">CRITICAL RISK ASSETS</span>
              <p className="text-3xl font-bold text-red-400 light:text-red-600 font-serif mt-1">{kpis.criticalCount}</p>
            </div>
          </div>
        </DossierCard>
      )}
    </div>
  );
};
