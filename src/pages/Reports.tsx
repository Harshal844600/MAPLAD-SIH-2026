import React, { useState } from 'react';
import {
  Printer,
  Download,
  ShieldAlert,
  FileText,
  Calendar,
} from 'lucide-react';
import {
  ClassicalCard,
  DossierCard,
  ClassicalButton,
  WaxSeal,
  VolumeHeader,
  ArchiveLabel,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A3F35] pb-4 no-print">
        <div>
          <VolumeHeader
            volume="VOLUME V"
            title="ARCHIVE & OFFICIAL PUBLICATIONS"
            subtitle="Formal statutory audit dossiers formatted for official parliamentary and ministerial submission."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#1C1714] border border-[#4A3F35] rounded p-1 text-xs font-['Cinzel']">
            <button
              onClick={() => setReportType('dossier')}
              className={`px-3 py-1 font-bold rounded transition-colors ${
                reportType === 'dossier' ? 'bg-[#251E19] text-[#C9A962] border border-[#C9A962]/40' : 'text-[#9C8B7A]'
              }`}
            >
              CASE DOSSIER (#10291)
            </button>
            <button
              onClick={() => setReportType('executive')}
              className={`px-3 py-1 font-bold rounded transition-colors ${
                reportType === 'executive' ? 'bg-[#251E19] text-[#C9A962] border border-[#C9A962]/40' : 'text-[#9C8B7A]'
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
        <DossierCard className="p-8 md:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead */}
          <div className="text-center border-b border-[#4A3F35] pb-6 space-y-2 relative">
            <div className="absolute top-0 right-0">
              <WaxSeal icon="★" size="md" />
            </div>
            <ArchiveLabel text="CONFIDENTIAL AUDIT DOSSIER" />
            <h3 className="text-2xl md:text-3xl font-bold font-['Cormorant_Garamond'] uppercase tracking-wider text-[#E8DFD4] mt-2">
              Government of India • Ministry of Statistics & Programme Implementation
            </h3>
            <p className="text-xs font-['Cinzel'] font-bold text-[#C9A962] tracking-widest">
              MPLADS FORENSIC RISK INTELLIGENCE DIVISION • CASE DOSSIER #INV-2026-10291
            </p>
          </div>

          {/* Project Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-['Crimson_Pro'] p-5 bg-[#1C1714] border border-[#4A3F35] rounded">
            <div className="space-y-1.5">
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">PROJECT CODE: </strong>
                <span className="font-['Cinzel'] text-[#C9A962]">#{flagshipProject.project_code}</span>
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">PROJECT TITLE: </strong>
                <span className="text-[#E8DFD4] font-semibold">{flagshipProject.title}</span>
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">CONSTITUENCY JURISDICTION: </strong>
                {flagshipProject.constituency_name} ({flagshipProject.state_name})
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">MEMBER OF PARLIAMENT: </strong>
                {flagshipProject.mp_name}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">SANCTIONED OUTLAY: </strong>
                <span className="font-['Cinzel'] text-[#E8DFD4]">₹{flagshipProject.sanctioned_amount.toLocaleString('en-IN')}</span>
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">DISBURSED TO DATE: </strong>
                <span className="font-['Cinzel'] text-[#E8DFD4]">₹{flagshipProject.utilized_amount.toLocaleString('en-IN')} (100%)</span>
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">AWARDED CONTRACTOR: </strong>
                {flagshipProject.vendor_name}
              </p>
              <p>
                <strong className="text-[#9C8B7A] font-['Cinzel'] text-[10px] block">ALGORITHMIC RISK RATING: </strong>
                <span className="font-['Cinzel'] font-bold text-[#8B2635]">91 / 100 (CRITICAL)</span>
              </p>
            </div>
          </div>

          {/* Executive Findings */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] border-b border-[#4A3F35] pb-2">
              1. SUMMARY OF DETECTED IRREGULARITIES
            </h4>
            <p className="text-base font-['Crimson_Pro'] leading-relaxed text-[#E8DFD4]">
              Algorithmic examination across the financial, chronological, and geospatial layers
              identified 5 major inconsistencies on Project #{flagshipProject.project_code}. Multi-layer
              cross-referencing indicates probable duplicate invoice disbursement and spatial overlap
              with pre-existing asset infrastructure.
            </p>

            <div className="space-y-3 font-['Crimson_Pro']">
              {anomalies.map((a, i) => (
                <div key={a.id} className="p-4 border border-[#4A3F35] bg-[#1C1714] rounded space-y-1 text-xs">
                  <div className="flex justify-between items-center font-['Cinzel']">
                    <span className="font-bold text-[#E8DFD4]">
                      {i + 1}. [{a.rule_code}] {a.title}
                    </span>
                    <span className="text-[#8B2635] font-bold text-[10px]">{a.severity}</span>
                  </div>
                  <p className="text-[#E8DFD4] text-sm">{a.description}</p>
                  <p className="text-[#9C8B7A] italic text-xs pt-1">
                    <strong className="text-[#C9A962] font-['Cinzel'] text-[10px]">EVIDENCE REF: </strong> {a.evidence_summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Investigator Directives */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold font-['Cormorant_Garamond'] text-[#E8DFD4] border-b border-[#4A3F35] pb-2">
              2. INVESTIGATOR OFFICER DIRECTIVES & ACTIONS
            </h4>
            <div className="p-4 bg-[#2A1D1A] border border-[#8B2635] rounded text-sm font-['Crimson_Pro'] space-y-2 text-[#E8DFD4]">
              <p>
                <strong className="text-[#C9A962] font-['Cinzel'] text-xs">DIRECTIVE 1: </strong> Direct DM Prayagraj to freeze subsequent fund drawdowns for
                RES Division Project #10291.
              </p>
              <p>
                <strong className="text-[#C9A962] font-['Cinzel'] text-xs">DIRECTIVE 2: </strong> Issue formal summon to Apex Infrastructure & Heavy Works Ltd.
                regarding duplicate clearing of Invoice #INV-APX-884.
              </p>
              <p>
                <strong className="text-[#C9A962] font-['Cinzel'] text-xs">DIRECTIVE 3: </strong> Mobilize State Quality Monitor (SQM) for physical verification
                survey at Gram Panchayat Saidabad.
              </p>
            </div>
          </div>

          {/* Sign-Off Block */}
          <div className="pt-8 border-t border-[#4A3F35] flex justify-between items-end text-xs font-['Crimson_Pro'] text-[#9C8B7A]">
            <div>
              <p>Date of Report Generation: {new Date().toLocaleDateString('en-IN')}</p>
              <p>System Verifier: Sentinel Risk Engine v1.4.2</p>
            </div>
            <div className="text-right space-y-1">
              <div className="h-10 border-b border-[#4A3F35] w-48 ml-auto" />
              <p className="font-['Cormorant_Garamond'] font-bold text-base text-[#E8DFD4]">Dr. Rameshwar Sharma, IAS</p>
              <p className="font-['Cinzel'] text-[10px] text-[#9C8B7A]">Principal Director of Audits & Inspections</p>
            </div>
          </div>
        </DossierCard>
      ) : (
        /* EXECUTIVE SUMMARY VIEW */
        <DossierCard className="p-8 space-y-6">
          <div className="text-center border-b border-[#4A3F35] pb-4">
            <ArchiveLabel text="STATISTICAL BRIEFING" />
            <h3 className="text-2xl font-bold font-['Cormorant_Garamond'] uppercase text-[#E8DFD4] mt-1">
              National MPLADS Implementation Briefing
            </h3>
            <p className="text-xs font-['Cinzel'] text-[#9C8B7A] tracking-wider">QUARTERLY AUDIT CYCLE • ALL SCHEME DATA</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-['Cinzel']">
            <div className="p-5 bg-[#1C1714] border border-[#4A3F35] rounded">
              <span className="text-xs text-[#9C8B7A] tracking-wider block">TOTAL AUDITED WORKS</span>
              <p className="text-3xl font-bold text-[#E8DFD4] font-['Cormorant_Garamond'] mt-1">{kpis.totalProjects}</p>
            </div>
            <div className="p-5 bg-[#1C1714] border border-[#4A3F35] rounded">
              <span className="text-xs text-[#9C8B7A] tracking-wider block">SANCTIONED OUTLAY</span>
              <p className="text-3xl font-bold text-[#C9A962] font-['Cormorant_Garamond'] mt-1">
                ₹{(kpis.totalSanctioned / 10000000).toFixed(1)} Cr
              </p>
            </div>
            <div className="p-5 bg-[#2A1D1A] border border-[#8B2635] rounded">
              <span className="text-xs text-[#8B2635] tracking-wider block">CRITICAL RISK ASSETS</span>
              <p className="text-3xl font-bold text-[#8B2635] font-['Cormorant_Garamond'] mt-1">{kpis.criticalCount}</p>
            </div>
          </div>
        </DossierCard>
      )}
    </div>
  );
};

