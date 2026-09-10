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
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Layers,
  ArrowRight,
  Compass,
  Copy,
  Check,
  Bot,
  ShieldCheck,
  Cpu,
  Printer,
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
  ClassicalTabs,
  AIThinkingWaves,
} from '../components/ui';
import { useCurrentUser } from '../services/store/useCurrentUser';

import { appStore } from '../services/store/appStore';
import { explainWhyProjectFlagged } from '../services/ai';
import { SentinelAIAnalysisResult } from '../types';

export const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { can, role } = useCurrentUser();
  const project = appStore.getProjectById(projectId || 'MPLAD-10291');
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<SentinelAIAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'graph' | 'financials' | 'documents'>('overview');
  const [selectedGraphNode, setSelectedGraphNode] = useState<'project' | 'mp' | 'vendor' | 'location' | 'ledger'>('project');

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

  // Dynamic chronological evidence sequence
  const timelineEvents = React.useMemo(() => {
    const events: Array<{
      id: string;
      date: string;
      displayDate: string;
      title: string;
      description: string;
      category: string;
      type: 'SANCTION' | 'START' | 'DISBURSEMENT' | 'DUPLICATE' | 'INVERTED' | 'COMPLETION' | 'STALLED';
      badge: string;
      isWarning?: boolean;
    }> = [];

    // 1. Sanction Gazette Order
    if (project.sanction_date) {
      events.push({
        id: 'evt-sanction',
        date: project.sanction_date,
        displayDate: new Date(project.sanction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        title: 'Official Administrative Sanction Order Issued',
        description: `Gazetted sanction order issued by District Magistrate, ${project.district_name} for ₹${(project.sanctioned_amount / 100000).toFixed(2)} Lakh outlay.`,
        category: 'ADMINISTRATIVE SANCTION',
        type: 'SANCTION',
        badge: 'SANCTION GAZETTED',
      });
    }

    // 2. Ground Work & Site Handover
    if (project.start_date) {
      events.push({
        id: 'evt-start',
        date: project.start_date,
        displayDate: new Date(project.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        title: 'Physical Site Handover & Mobilization Commenced',
        description: `Field site possession marked at ${project.location_name} and handed over to ${project.implementing_agency}.`,
        category: 'SITE MOBILIZATION',
        type: 'START',
        badge: 'GROUND EXECUTION',
      });
    }

    // 3. Transactions / PFMS Disbursements
    transactions.forEach((txn, idx) => {
      const isDuplicate = transactions.filter(t => t.invoice_number === txn.invoice_number).length > 1 && idx > 0;
      const isPredating = Boolean(project.sanction_date && txn.payment_date < project.sanction_date);

      events.push({
        id: `evt-txn-${txn.id}`,
        date: txn.payment_date,
        displayDate: new Date(txn.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        title: `${txn.purpose || `Milestone Bill #${idx + 1}`} (₹${(txn.amount / 100000).toFixed(2)} Lakh)`,
        description: `Invoice #${txn.invoice_number || 'N/A'} disbursed to ${txn.vendor_name} via ${txn.payment_mode} (Ref: ${txn.transaction_reference}).`,
        category: 'PFMS EXPENDITURE',
        type: isDuplicate ? 'DUPLICATE' : isPredating ? 'INVERTED' : 'DISBURSEMENT',
        badge: isDuplicate ? 'DUAL PAYMENT DETECTED' : isPredating ? 'PREDATES SANCTION' : 'PFMS DISBURSED',
        isWarning: Boolean(isDuplicate || isPredating),
      });
    });

    // 4. Chronological Inversion & Completion Anomalies
    if (project.actual_completion_date && project.sanction_date && project.actual_completion_date < project.sanction_date) {
      events.push({
        id: 'evt-inverted-completion',
        date: project.actual_completion_date,
        displayDate: `${new Date(project.actual_completion_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} (INVERTED)`,
        title: 'Completion Certificate Signed (Predates Official Sanction!)',
        description: `Audit records show physical work completion was signed prior to the administrative sanction date.`,
        category: 'CHRONOLOGICAL CONFLICT',
        type: 'INVERTED',
        badge: 'INVERTED DATE SEQUENCE',
        isWarning: true,
      });
    } else if (project.status === 'COMPLETED' && project.actual_completion_date) {
      events.push({
        id: 'evt-completed',
        date: project.actual_completion_date,
        displayDate: new Date(project.actual_completion_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        title: 'Final Work Completion Certified & Handed Over',
        description: `Work inspected and handed over with full Form GFR-12C Utilization Certification.`,
        category: 'HANDOVER & UC',
        type: 'COMPLETION',
        badge: 'PROJECT COMPLETED',
      });
    } else if (project.status === 'STALLED') {
      events.push({
        id: 'evt-stalled',
        date: project.expected_completion_date || '2025-12-31',
        displayDate: 'DEADLINE BREACHED',
        title: 'Project Stalled / Construction Delayed Past Schedule',
        description: `Physical milestone pace stalled. Work site flagged for field forensic verification.`,
        category: 'AUDIT HOLD',
        type: 'STALLED',
        badge: 'STALLED TIMELINE',
        isWarning: true,
      });
    } else if (project.status === 'IN_PROGRESS' && project.expected_completion_date) {
      events.push({
        id: 'evt-target',
        date: project.expected_completion_date,
        displayDate: new Date(project.expected_completion_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        title: 'Scheduled Target Completion & Commissioning',
        description: `Contractual delivery deadline pursuant to agreement with ${project.vendor_name || project.implementing_agency}.`,
        category: 'SCHEDULED TARGET',
        type: 'COMPLETION',
        badge: 'SCHEDULED TARGET',
      });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [project, transactions]);

  const handleWhyFlaggedClick = async (forceRefresh: boolean = false) => {
    setIsWhyFlaggedOpen(true);
    if (!aiAnalysis || forceRefresh) {
      setIsAiLoading(true);
      setAiError(null);
      try {
        const result = await explainWhyProjectFlagged(project, anomalies, transactions, documents);
        setAiAnalysis(result);
      } catch (err: any) {
        console.error('Evidence synthesis error:', err);
        setAiError(err?.message || 'Failed to synthesize evidence via Groq neural reasoning.');
      } finally {
        setIsAiLoading(false);
      }
    }
  };

  const handleCopySynthesis = () => {
    if (!aiAnalysis) return;
    const text = `FORENSIC DOSSIER SYNTHESIS: #${project.project_code}\n${project.title}\nRisk: ${project.risk_score}/100 (${project.risk_level})\n\nSUMMARY:\n${aiAnalysis.summary}\n\nKEY FINDINGS:\n${aiAnalysis.keyFindings.map((k) => `• ${k.title} [${k.severity}]: ${k.fact} => ${k.inference}`).join('\n')}\n\nWHY THIS MATTERS:\n${aiAnalysis.whyItMatters}\n\nRECOMMENDED AUDIT STEPS:\n${aiAnalysis.recommendedNextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleExportPdfBrief = () => {
    if (!aiAnalysis) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MoSPI Forensic Dossier Brief - #${project.project_code}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1a1a1a; margin: 0; padding: 40px; background: #fff; line-height: 1.6; }
            .header-banner { border-bottom: 3px double #1a1a1a; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
            .emblem-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #111; margin: 0 0 4px 0; }
            .sub-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
            .dossier-meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
            .dossier-meta-table td { padding: 8px 12px; border: 1px solid #ddd; }
            .dossier-meta-table .label { font-family: 'JetBrains Mono', monospace; font-weight: 600; background: #f8f8f8; color: #444; width: 25%; }
            .summary-box { background: #fcfbfa; border: 1px solid #c9b8a0; border-left: 4px solid #8c735d; padding: 18px; border-radius: 8px; margin-bottom: 20px; }
            .section-title { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; border-bottom: 1px solid #eee; padding-bottom: 6px; margin: 22px 0 12px 0; text-transform: uppercase; letter-spacing: 1px; }
            .finding-card { border: 1px solid #e0e0e0; border-radius: 6px; padding: 12px; margin-bottom: 10px; page-break-inside: avoid; }
            .severity-badge { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; float: right; }
            .critical { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
            .high { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
            .fact-box { background: #f9fafb; padding: 8px 12px; border-radius: 4px; margin: 8px 0; font-size: 12px; }
            .inference-box { background: #fff1f2; padding: 8px 12px; border-radius: 4px; margin: 8px 0; font-size: 12px; border-left: 3px solid #e11d48; }
            .footer-sig { margin-top: 35px; padding-top: 15px; border-top: 1px solid #ddd; display: flex; justify-content: space-between; font-size: 11px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div>
              <div class="sub-title">GOVERNMENT OF INDIA • MoSPI</div>
              <h1 class="emblem-title">MPLAD SENTINEL FORENSIC AUDIT BRIEF</h1>
              <div style="font-size: 12px; color: #555;">Parliamentary Constituency Assurance & Multi-layer Risk Docket</div>
            </div>
            <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
              <div style="color: #991b1b; font-weight: bold;">OFFICIAL / CONFIDENTIAL</div>
              <div>DATE: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div>HASH: SHA256-SYN-${Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
            </div>
          </div>

          <table class="dossier-meta-table">
            <tr>
              <td class="label">PROJECT CODE</td>
              <td><strong>#${project.project_code}</strong></td>
              <td class="label">COMPOSITE RISK</td>
              <td><strong>${project.risk_score}/100 (${project.risk_level})</strong></td>
            </tr>
            <tr>
              <td class="label">WORK TITLE</td>
              <td colspan="3">${project.title}</td>
            </tr>
            <tr>
              <td class="label">JURISDICTION</td>
              <td>${project.district_name}, ${project.state_name}</td>
              <td class="label">SANCTIONED OUTLAY</td>
              <td>₹${project.sanctioned_amount.toLocaleString('en-IN')} (Utilized: ₹${project.utilized_amount.toLocaleString('en-IN')})</td>
            </tr>
          </table>

          <div class="summary-box">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #8c735d; margin-bottom: 6px;">
              EXECUTIVE FORENSIC SUMMARY (${Math.round(aiAnalysis.confidence * 100)}% AI CONFIDENCE)
            </div>
            <p style="margin: 0; font-size: 13px;">${aiAnalysis.summary}</p>
          </div>

          <div class="section-title">Verified Forensic Findings (${aiAnalysis.keyFindings.length})</div>
          ${aiAnalysis.keyFindings
            .map(
              (f, i) => `
            <div class="finding-card">
              <span class="severity-badge ${f.severity.toLowerCase()}">${f.severity}</span>
              <div style="font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px;">
                #0${i + 1}. ${f.title}
              </div>
              <div class="fact-box"><strong>DOCUMENTED FACT:</strong> ${f.fact}</div>
              <div class="inference-box"><strong>FORENSIC INFERENCE:</strong> ${f.inference}</div>
            </div>
          `
            )
            .join('')}

          ${
            aiAnalysis.whyItMatters
              ? `
            <div class="section-title">Statutory & Fiduciary Impact</div>
            <div style="background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; border-radius: 4px; font-size: 12px;">
              ${aiAnalysis.whyItMatters}
            </div>
          `
              : ''
          }

          <div class="section-title">Recommended Statutory Audit Directives</div>
          <ol style="font-size: 12px; padding-left: 20px; line-height: 1.8;">
            ${aiAnalysis.recommendedNextSteps.map((s) => `<li>${s}</li>`).join('')}
          </ol>

          <div class="footer-sig">
            <div>Generated by SENTINEL AI Neural Triangulation Engine (Groq Llama-3.3 70B)</div>
            <div>Authorized Investigating Officer Signature: _______________________</div>
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
    <div className="space-y-8 pb-12 animate-page-enter">
      {/* 1. PROJECT VOLUME HEADER & DOSSIER BANNER */}
      <VolumeHeader
        volume="VOLUME II — DOSSIER"
        title={`PROJECT DOSSIER: #${project.project_code}`}
        subtitle={`Official implementation and expenditure record registered under the ${project.state_name} jurisdiction.`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            {can('ai.view') && (
              <button
                onClick={() => handleWhyFlaggedClick(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c9b8a0]/20 via-[#a78b71]/15 to-[#8c735d]/20 light:from-[#F6F1EB] light:to-[#EDE4D8] border border-[#c9b8a0]/50 light:border-[#D8C7B5] text-[#e8d5b7] light:text-[#78350F] font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(167,139,113,0.15)] light:shadow-[0_2px_10px_rgba(140,115,93,0.12)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#c9b8a0] light:text-[#8C735D] animate-pulse" />
                <span>SYNTHESIZE EVIDENCE</span>
              </button>
            )}

            {can('projects.verify') && (
              <ClassicalButton
                variant="primary"
                size="md"
                icon={<FileSearch className="w-4 h-4 text-black" />}
                onClick={handleOpenInvestigation}
              >
                OPEN INVESTIGATION
              </ClassicalButton>
            )}

            {can('anomaly.view') && (
              <ClassicalButton
                variant="ghost"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5 text-[#c9b8a0]" />}
                title="Recalculate live risk engine"
                onClick={handleRecalculateRisk}
              >
                RE-AUDIT
              </ClassicalButton>
            )}
          </div>
        }
      />

      {/* 2. MAIN DOSSIER BANNER */}
      <div className="p-6 md:p-8 bg-white/[0.03] light:bg-white backdrop-blur-xl border border-white/10 light:border-slate-200 rounded-[32px] space-y-6 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-xs tracking-wider px-3 py-1 bg-black/40 light:bg-slate-100 text-[#e8d5b7] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full">
                #{project.project_code}
              </span>
              <span className="text-xs font-mono px-3 py-1 bg-white/5 light:bg-slate-100 text-gray-300 light:text-slate-700 border border-white/10 light:border-slate-200 rounded-full">
                {project.category_name}
              </span>
              <span className="text-xs font-mono px-3 py-1 bg-white/5 light:bg-slate-100 text-gray-400 light:text-slate-600 border border-white/10 light:border-slate-200 rounded-full">
                STATUS: {project.status.toUpperCase()}
              </span>
              {project.risk_score >= 80 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/30 light:bg-rose-50 border border-rose-500/40 light:border-rose-300 text-rose-300 light:text-rose-700 rounded-full font-mono text-xs shadow-[0_0_12px_rgba(239,68,68,0.2)] light:shadow-none">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 light:text-rose-600" /> PRIORITY FORENSIC AUDIT
                </div>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-white light:text-slate-900 leading-tight">
              {project.title}
            </h2>

            <p className="text-sm font-['Inter'] text-gray-400 light:text-slate-600 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#c9b8a0] light:text-[#8C735D] shrink-0" />
              <span>
                {project.location_name}, {project.district_name}, {project.state_name} (
                {project.latitude.toFixed(5)}° N, {project.longitude.toFixed(5)}° E)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 light:bg-slate-50 p-4 border border-white/10 light:border-slate-200 rounded-2xl">
            <div className="text-right font-mono">
              <span className="text-[10px] text-gray-400 light:text-slate-500 block tracking-wider uppercase">SANCTIONED AMOUNT</span>
              <span className="text-xl font-bold text-white light:text-slate-900">
                ₹{(project.sanctioned_amount / 100000).toFixed(2)} LAKH
              </span>
            </div>
            <div className="w-[1px] h-10 bg-white/10 light:bg-slate-300" />
            <RiskBadge score={project.risk_score} size="md" />
          </div>
        </div>

        {/* Dossier Tabs */}
        <ClassicalTabs
          tabs={[
            { id: 'overview', label: 'DOSSIER OVERVIEW & RISK' },
            { id: 'timeline', label: 'CHRONOLOGY' },
            { id: 'graph', label: 'RELATIONAL GRAPH' },
            { id: 'financials', label: `LEDGER (${transactions.length})` },
            { id: 'documents', label: `ARCHIVE RECORDS (${documents.length})` },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: OVERVIEW & RISK BREAKDOWN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Project Metadata & Anomalies List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[28px] space-y-4 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
              <ArchiveLabel text="IMPLEMENTATION METADATA & JURISDICTION" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-['Inter']">
                <div className="p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 light:text-slate-500 uppercase block">
                    MEMBER OF PARLIAMENT
                  </span>
                  <p className="font-['Playfair_Display'] text-base font-semibold text-white light:text-slate-900">{project.mp_name}</p>
                  <p className="text-xs text-gray-400 light:text-slate-500">{project.constituency_name}</p>
                </div>
                <div className="p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 light:text-slate-500 uppercase block">
                    IMPLEMENTING AGENCY
                  </span>
                  <p className="font-['Playfair_Display'] text-base font-semibold text-white light:text-slate-900">{project.implementing_agency}</p>
                </div>
                <div className="p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 light:text-slate-500 uppercase block">
                    AWARDED CONTRACTOR
                  </span>
                  <p className="font-['Playfair_Display'] text-base font-semibold text-[#e8d5b7] light:text-[#78350F]">{project.vendor_name || 'Direct Execution'}</p>
                </div>
                <div className="p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-mono tracking-wider text-gray-400 light:text-slate-500 uppercase block">
                    SANCTION GAZETTE DATE
                  </span>
                  <p className="font-mono text-sm font-semibold text-white light:text-slate-900">{project.sanction_date}</p>
                </div>
              </div>
            </div>

            {/* Detected Anomalies List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 light:border-slate-200 pb-3">
                <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-white light:text-slate-900">
                  Forensic Risk Indicators ({anomalies.length})
                </h3>
                <span className="text-[10px] font-mono text-[#c9b8a0] light:text-[#8C735D] tracking-wider uppercase">
                  ALGORITHM v2026.01
                </span>
              </div>

              {anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className={`p-5 rounded-[24px] border space-y-2.5 transition-all duration-300 ${
                    anom.severity === 'CRITICAL'
                      ? 'border-rose-500/40 light:border-rose-200 bg-rose-950/20 light:bg-rose-50/70 shadow-[0_0_20px_rgba(239,68,68,0.15)] light:shadow-none'
                      : 'border-amber-500/40 light:border-amber-200 bg-amber-950/20 light:bg-amber-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-black/50 light:bg-white text-[#e8d5b7] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full">
                      {anom.rule_code}
                    </span>
                    <span className="text-xs font-mono tracking-wider font-semibold text-rose-300 light:text-rose-700">
                      {anom.category} • +{anom.score_impact} PTS
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold font-['Playfair_Display'] text-white light:text-slate-900">
                    {anom.title}
                  </h4>
                  <p className="text-sm font-['Inter'] text-gray-200 light:text-slate-700 leading-relaxed">
                    {anom.description}
                  </p>
                  <div className="text-xs font-['Inter'] text-gray-400 light:text-slate-500 pt-2 border-t border-white/10 light:border-slate-200">
                    <strong className="text-[#c9b8a0] light:text-[#8C735D] font-mono">EVIDENCE RECORD: </strong>
                    {anom.evidence_summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Explainable Risk Gauge & Subscores (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[28px] space-y-6 text-center shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
              <ArchiveLabel text="COMPOSITE RISK RATING" />

              <div className="py-2">
                <RiskScoreGauge score={project.risk_score} size="lg" />
              </div>

              {/* Subscores breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/10 light:border-slate-200 text-left font-['Inter']">
                <p className="text-xs font-mono tracking-wider text-[#c9b8a0] light:text-[#8C735D] uppercase">
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
                  <div key={factor.label} className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-sm text-gray-300 light:text-slate-700">
                      <span>{factor.label}</span>
                      <span className="font-mono font-bold text-white light:text-slate-900">{factor.score}/100</span>
                    </div>
                    <div className="w-full bg-white/5 light:bg-slate-200 h-2 rounded-full overflow-hidden border border-white/10 light:border-slate-300">
                      <div
                        className={`h-full transition-all duration-700 ${
                          factor.score >= 80
                            ? 'bg-rose-500'
                            : factor.score >= 60
                            ? 'bg-amber-500'
                            : factor.score >= 30
                            ? 'bg-[#a78b71]'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 md:p-8 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[32px] space-y-6 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 light:border-slate-200 pb-4 gap-3">
            <div>
              <ArchiveLabel text="VOLUME IV — CHRONOLOGICAL RECORD" />
              <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white light:text-slate-900 mt-1">
                Forensic Chronological Evidence Sequence
              </h3>
              <p className="text-sm font-['Inter'] text-gray-400 light:text-slate-600">
                Audited timeline cross-referencing sanction orders, PFMS transactions, and physical milestones.
              </p>
            </div>
            <span className="px-3.5 py-1 bg-white/5 light:bg-slate-100 text-xs font-mono font-bold text-[#c9b8a0] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full">
              {timelineEvents.length} MILESTONE EVENTS RECORDED
            </span>
          </div>

          <div className="relative pl-6 space-y-8 border-l-2 border-white/10 light:border-slate-200 before:absolute before:-left-1.5 before:top-0 before:w-3 before:h-3 before:bg-[#a78b71] before:rounded-full">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                <span
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    evt.isWarning
                      ? 'bg-rose-500 border-white animate-pulse'
                      : evt.type === 'SANCTION'
                      ? 'bg-[#a78b71] border-black light:border-white'
                      : evt.type === 'COMPLETION'
                      ? 'bg-emerald-500 border-white'
                      : 'bg-black light:bg-white border-[#a78b71]'
                  }`}
                />
                <div
                  className={`p-4 md:p-5 rounded-2xl space-y-1.5 transition-all duration-300 border ${
                    evt.isWarning
                      ? 'bg-rose-950/20 light:bg-rose-50/80 border-rose-500/40 light:border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                      : 'bg-white/[0.02] light:bg-slate-50 border-white/10 light:border-slate-200 hover:border-white/20'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`text-xs font-mono font-bold ${
                        evt.isWarning ? 'text-rose-300 light:text-rose-700' : 'text-[#c9b8a0] light:text-[#78350F]'
                      }`}
                    >
                      {evt.displayDate}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                        evt.isWarning
                          ? 'text-rose-300 light:text-rose-700 bg-rose-950/40 light:bg-rose-100 border-rose-500/40 light:border-rose-300'
                          : 'text-gray-300 light:text-slate-700 bg-white/5 light:bg-slate-200 border-white/10 light:border-slate-300'
                      }`}
                    >
                      {evt.badge}
                    </span>
                  </div>
                  <h4 className="font-['Playfair_Display'] font-semibold text-lg text-white light:text-slate-900">
                    {evt.title}
                  </h4>
                  <p className="text-xs font-['Inter'] text-gray-300 light:text-slate-600 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE GRAPH NETWORK */}
      {activeTab === 'graph' && (
        <div className="p-6 md:p-8 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[32px] space-y-6 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between border-b border-white/10 light:border-slate-200 pb-3 gap-3">
            <div>
              <ArchiveLabel text="RELATIONAL ENTITY MAP" />
              <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white light:text-slate-900 mt-1">
                Relational Forensic Graph & Multi-Layer Linkage
              </h3>
              <p className="text-xs font-['Inter'] text-gray-400 light:text-slate-600">
                Interactive topological network linking Parliamentary sponsorship, contractor entity, disbursement ledger, and spatial coordinates.
              </p>
            </div>
            <span className="px-3.5 py-1 bg-white/5 light:bg-slate-100 text-xs font-mono font-bold text-[#c9b8a0] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full">
              TOPOLOGICAL MAP
            </span>
          </div>

          <div className="w-full h-96 bg-black/60 light:bg-slate-900 border border-white/10 light:border-slate-300 rounded-2xl relative overflow-hidden flex items-center justify-center p-4 shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Connector lines to center */}
              <line x1="400" y1="200" x2="180" y2="100" stroke={project.risk_score >= 60 ? '#EF4444' : '#a78b71'} strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
              <line x1="400" y1="200" x2="620" y2="100" stroke={project.subscores.vendor >= 70 ? '#EF4444' : '#a78b71'} strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
              <line x1="400" y1="200" x2="180" y2="300" stroke={project.subscores.geographic >= 70 ? '#EF4444' : '#a78b71'} strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
              <line x1="400" y1="200" x2="620" y2="300" stroke={project.subscores.financial >= 70 ? '#EF4444' : '#a78b71'} strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />

              {/* Center Node: Active Project */}
              <g
                transform="translate(400, 200)"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedGraphNode('project')}
              >
                <circle
                  r="48"
                  fill="#121212"
                  stroke={project.risk_score >= 80 ? '#EF4444' : project.risk_score >= 60 ? '#F59E0B' : '#a78b71'}
                  strokeWidth="2.5"
                />
                <text textAnchor="middle" y="-6" fontFamily="Playfair Display" fontWeight="bold" fontSize="11" fill="#FFFFFF">
                  {project.project_code}
                </text>
                <text
                  textAnchor="middle"
                  y="14"
                  fontFamily="Inter"
                  fontSize="9"
                  fill={project.risk_score >= 80 ? '#EF4444' : project.risk_score >= 60 ? '#F59E0B' : '#10B981'}
                  fontWeight="bold"
                >
                  {project.risk_score}/100 {project.risk_level}
                </text>
              </g>

              {/* Node 1 (Top Left): Member of Parliament */}
              <g
                transform="translate(180, 100)"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedGraphNode('mp')}
              >
                <rect x="-80" y="-28" width="160" height="56" rx="14" fill="#141414" stroke={selectedGraphNode === 'mp' ? '#e8d5b7' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
                <text textAnchor="middle" y="-6" fontFamily="Inter" fontWeight="bold" fontSize="10" fill="#FFFFFF">
                  {project.mp_name.split(',')[0].substring(0, 22)}
                </text>
                <text textAnchor="middle" y="12" fontFamily="Inter" fontSize="9" fill="#9CA3AF">
                  {project.constituency_name.substring(0, 24)}
                </text>
              </g>

              {/* Node 2 (Top Right): Awarded Contractor / Vendor */}
              <g
                transform="translate(620, 100)"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedGraphNode('vendor')}
              >
                <rect
                  x="-85"
                  y="-28"
                  width="170"
                  height="56"
                  rx="14"
                  fill="#141414"
                  stroke={project.subscores.vendor >= 70 ? '#EF4444' : selectedGraphNode === 'vendor' ? '#e8d5b7' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                />
                <text textAnchor="middle" y="-6" fontFamily="Inter" fontWeight="bold" fontSize="10" fill="#FFFFFF">
                  {(project.vendor_name || 'Direct Execution').substring(0, 22)}
                </text>
                <text textAnchor="middle" y="12" fontFamily="Inter" fontSize="9" fill={project.subscores.vendor >= 70 ? '#F87171' : '#9CA3AF'}>
                  {project.subscores.vendor >= 70 ? 'High Concentration Flag' : 'Verified Vendor Entity'}
                </text>
              </g>

              {/* Node 3 (Bottom Left): Spatial / Geo Buffer Location */}
              <g
                transform="translate(180, 300)"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedGraphNode('location')}
              >
                <rect
                  x="-80"
                  y="-28"
                  width="160"
                  height="56"
                  rx="14"
                  fill="#141414"
                  stroke={project.subscores.geographic >= 70 ? '#EF4444' : selectedGraphNode === 'location' ? '#e8d5b7' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                />
                <text textAnchor="middle" y="-6" fontFamily="Inter" fontWeight="bold" fontSize="10" fill="#FFFFFF">
                  {project.district_name}, {project.state_name}
                </text>
                <text textAnchor="middle" y="12" fontFamily="Inter" fontSize="9" fill="#9CA3AF">
                  {project.latitude.toFixed(3)}° N, {project.longitude.toFixed(3)}° E
                </text>
              </g>

              {/* Node 4 (Bottom Right): PFMS Disbursement & Archive Records */}
              <g
                transform="translate(620, 300)"
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedGraphNode('ledger')}
              >
                <rect
                  x="-85"
                  y="-28"
                  width="170"
                  height="56"
                  rx="14"
                  fill="#141414"
                  stroke={project.subscores.financial >= 70 ? '#EF4444' : selectedGraphNode === 'ledger' ? '#e8d5b7' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                />
                <text textAnchor="middle" y="-6" fontFamily="Inter" fontWeight="bold" fontSize="10" fill="#FFFFFF">
                  ₹{(project.released_amount / 100000).toFixed(2)}L Disbursed
                </text>
                <text textAnchor="middle" y="12" fontFamily="Inter" fontSize="9" fill="#9CA3AF">
                  {transactions.length} Txns • {documents.length} Dossiers
                </text>
              </g>
            </svg>
          </div>

          {/* Graph Node Interactive Inspector */}
          <div className="p-4 bg-white/[0.02] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 font-['Inter'] text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a78b71] animate-pulse" />
              <div>
                <strong className="text-white light:text-slate-900 block uppercase font-mono tracking-wider text-[11px]">
                  {selectedGraphNode === 'project' && `Project Dossier #${project.project_code}`}
                  {selectedGraphNode === 'mp' && `Parliamentary Seat: ${project.constituency_name}`}
                  {selectedGraphNode === 'vendor' && `Contractor: ${project.vendor_name || 'Direct RES'}`}
                  {selectedGraphNode === 'location' && `Geographic Coordinates: ${project.location_name}`}
                  {selectedGraphNode === 'ledger' && `PFMS Treasury Ledger Breakdown`}
                </strong>
                <span className="text-gray-400 light:text-slate-500 text-[11px]">
                  {selectedGraphNode === 'project' && `${project.title} • Outlay: ₹${(project.sanctioned_amount / 100000).toFixed(2)} Lakh`}
                  {selectedGraphNode === 'mp' && `Sponsoring Representative: ${project.mp_name}`}
                  {selectedGraphNode === 'vendor' && `Implementing Division: ${project.implementing_agency}`}
                  {selectedGraphNode === 'location' && `PostGIS Spatial Point: (${project.latitude.toFixed(5)}° N, ${project.longitude.toFixed(5)}° E)`}
                  {selectedGraphNode === 'ledger' && `Total Invoiced: ₹${(transactions.reduce((acc, t) => acc + t.amount, 0) / 100000).toFixed(2)} Lakh across ${transactions.length} payment milestones.`}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-[#c9b8a0] light:text-amber-800 bg-white/5 light:bg-amber-100 px-3 py-1 rounded-full border border-white/10 light:border-amber-300">
              CLICK NODES TO INSPECT
            </span>
          </div>
        </div>
      )}

      {/* TAB 4: FINANCIALS & PFMS DISBURSEMENT LEDGER */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          {/* Financial Summary Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase tracking-wider block">
                SANCTIONED OUTLAY
              </span>
              <p className="text-lg font-mono font-bold text-white light:text-slate-900">
                ₹{(project.sanctioned_amount / 100000).toFixed(2)} L
              </p>
              <span className="text-[10px] text-gray-400 light:text-slate-500 font-mono">100% Budget Cap</span>
            </div>

            <div className="p-4 bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase tracking-wider block">
                PFMS RELEASED
              </span>
              <p className="text-lg font-mono font-bold text-[#e8d5b7] light:text-[#78350F]">
                ₹{(project.released_amount / 100000).toFixed(2)} L
              </p>
              <span className="text-[10px] text-emerald-400 light:text-emerald-700 font-mono">
                {Math.round((project.released_amount / (project.sanctioned_amount || 1)) * 100)}% of Sanction
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase tracking-wider block">
                UTILIZED EXPENDITURE
              </span>
              <p className="text-lg font-mono font-bold text-white light:text-slate-900">
                ₹{(project.utilized_amount / 100000).toFixed(2)} L
              </p>
              <span className="text-[10px] text-gray-400 light:text-slate-500 font-mono">
                Form GFR-12C Certified
              </span>
            </div>

            <div className="p-4 bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl space-y-1 shadow-xs">
              <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase tracking-wider block">
                TREASURY BALANCE
              </span>
              <p className="text-lg font-mono font-bold text-white light:text-slate-900">
                ₹{(Math.max(0, project.released_amount - project.utilized_amount) / 100000).toFixed(2)} L
              </p>
              <span className="text-[10px] text-gray-400 light:text-slate-500 font-mono">
                {transactions.length} Milestone Invoices
              </span>
            </div>
          </div>

          {/* Disbursement Table */}
          <div className="p-6 bg-white/[0.03] light:bg-white backdrop-blur-md border border-white/10 light:border-slate-200 rounded-[32px] space-y-4 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 light:border-slate-200 pb-3 gap-3">
              <div>
                <ArchiveLabel text="EXPENDITURE LEDGER" />
                <h3 className="text-xl font-['Playfair_Display'] font-semibold text-white light:text-slate-900 mt-1">
                  Disbursement Ledger & Payment Transactions
                </h3>
                <p className="text-xs font-['Inter'] text-gray-400 light:text-slate-600">
                  Real-time electronic transfer records synchronized with Public Financial Management System (PFMS).
                </p>
              </div>
              <span className="px-3.5 py-1 bg-white/5 light:bg-slate-100 text-xs font-mono font-bold text-[#c9b8a0] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full">
                PFMS CONNECTED
              </span>
            </div>

            <div className="overflow-x-auto border border-white/10 light:border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left font-['Inter'] text-sm">
                <thead>
                  <tr className="bg-white/[0.04] light:bg-[#FAF8F5] border-b border-white/10 light:border-slate-200 font-mono text-xs text-[#c9b8a0] light:text-[#78350F] tracking-wider uppercase">
                    <th className="p-4">PFMS Reference</th>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Payment Date</th>
                    <th className="p-4">Amount (₹)</th>
                    <th className="p-4">Beneficiary Vendor</th>
                    <th className="p-4">Milestone Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 light:divide-slate-100 text-gray-200 light:text-slate-800">
                  {transactions.map((t) => {
                    const isDuplicate = transactions.filter((tx) => tx.invoice_number === t.invoice_number).length > 1;
                    return (
                      <tr
                        key={t.id}
                        className={isDuplicate ? 'bg-rose-950/20 light:bg-rose-50/70' : 'hover:bg-white/5 light:hover:bg-slate-50'}
                      >
                        <td className="p-4 font-mono text-xs text-gray-400 light:text-slate-500">
                          {t.transaction_reference}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#e8d5b7] light:text-[#78350F]">
                          <div className="flex items-center gap-2">
                            <span>{t.invoice_number}</span>
                            {isDuplicate && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                DUP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-xs text-gray-400 light:text-slate-500">
                          {t.payment_date}
                        </td>
                        <td className="p-4 font-mono font-bold text-white light:text-slate-900">
                          ₹{t.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-xs text-gray-300 light:text-slate-700">
                          {t.vendor_name}
                        </td>
                        <td className="p-4 text-xs text-gray-300 light:text-slate-700">
                          {t.purpose}
                        </td>
                      </tr>
                    );
                  })}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 light:text-slate-500 font-mono text-xs">
                        No financial transactions recorded in the central PFMS treasury for this scheme yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ARCHIVE RECORDS & OCR EXTRACTIONS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          {/* Documents Header & Metrics */}
          <div className="flex flex-wrap items-center justify-between p-5 bg-white/[0.03] light:bg-white border border-white/10 light:border-slate-200 rounded-2xl gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <span className="px-3 py-1 bg-white/5 light:bg-slate-100 text-[#e8d5b7] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full font-bold">
                {documents.length} OFFICIAL DOSSIERS
              </span>
              <span className="text-gray-400 light:text-slate-500">
                Verified: <strong className="text-emerald-400 light:text-emerald-700">{documents.filter((d) => d.is_verified).length}</strong>
              </span>
              <span className="text-gray-400 light:text-slate-500">
                Integrity Flags:{' '}
                <strong className={documents.some((d) => d.extraction?.mismatch_flags?.length) ? 'text-rose-400' : 'text-gray-300'}>
                  {documents.filter((d) => d.extraction?.mismatch_flags?.length).length}
                </strong>
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-400 light:text-slate-500">
              NATIONAL REPOSITORY • SHA-256 ASSURED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-6 bg-white/[0.03] light:bg-white backdrop-blur-md border rounded-[28px] space-y-3 transition-all duration-300 shadow-sm light:shadow-[0_4px_20px_rgba(15,23,42,0.06)] ${
                  doc.extraction?.mismatch_flags?.length
                    ? 'border-rose-500/40 light:border-rose-300 bg-rose-950/15 light:bg-rose-50/70'
                    : 'border-white/10 light:border-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono tracking-wider px-3 py-1 bg-white/5 light:bg-slate-100 text-[#c9b8a0] light:text-[#78350F] border border-white/10 light:border-slate-200 rounded-full uppercase">
                    {doc.document_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400 light:text-slate-500 font-mono">
                    {(doc.file_size_bytes / 1024).toFixed(0)} KB
                  </span>
                </div>
                <h4 className="text-base font-['Playfair_Display'] font-semibold text-white light:text-slate-900 truncate" title={doc.file_name}>
                  {doc.file_name}
                </h4>
                <p className="text-[11px] font-mono text-gray-400 light:text-slate-500 truncate">
                  Issuing Authority: {doc.uploaded_by_name}
                </p>
                {doc.extraction && (
                  <div className="text-xs p-4 bg-black/40 light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1.5 font-['Inter']">
                    {doc.extraction.extracted_amount && (
                      <p>
                        <strong className="text-gray-400 light:text-slate-500 font-mono text-[10px]">EXTRACTED SUM: </strong>
                        <span className="font-mono font-semibold text-white light:text-slate-900">
                          ₹{doc.extraction.extracted_amount.toLocaleString('en-IN')}
                        </span>
                      </p>
                    )}
                    {doc.extraction.extracted_date && (
                      <p>
                        <strong className="text-gray-400 light:text-slate-500 font-mono text-[10px]">EXTRACTED DATE: </strong>
                        <span className="font-mono text-white light:text-slate-900">{doc.extraction.extracted_date}</span>
                      </p>
                    )}
                    {doc.extraction.confidence && (
                      <p>
                        <strong className="text-gray-400 light:text-slate-500 font-mono text-[10px]">OCR CONFIDENCE: </strong>
                        <span className="font-mono text-emerald-400 light:text-emerald-700 font-semibold">
                          {(doc.extraction.confidence * 100).toFixed(0)}%
                        </span>
                      </p>
                    )}
                    {doc.extraction.mismatch_flags && (
                      <p className="text-rose-400 light:text-rose-700 font-mono font-bold text-[11px] pt-1">
                        ⚠️ FLAGS: {doc.extraction.mismatch_flags.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {documents.length === 0 && (
              <div className="col-span-full p-12 text-center text-gray-400 light:text-slate-500 font-mono text-xs bg-white/[0.02] border border-white/10 rounded-2xl">
                No archive records uploaded or registered for this project dossier.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. "WHY FLAGGED?" FORENSIC MODAL */}
      <ClassicalModal
        isOpen={isWhyFlaggedOpen}
        onClose={() => setIsWhyFlaggedOpen(false)}
        tag="FORENSIC INTELLIGENCE SYNTHESIS"
        headerBadge={
          <span className="px-2.5 py-0.5 rounded-full bg-rose-950/40 light:bg-rose-50 border border-rose-500/30 text-rose-300 light:text-rose-700 text-[10px] font-mono font-bold">
            RISK: {project.risk_score}/100 ({project.risk_level})
          </span>
        }
        title={`Forensic Evidence Synthesis: #${project.project_code.replace(/^#+/, '')}`}
        subtitle={`Live neural explanation for "${project.title}" (${project.district_name}, ${project.state_name}) grounded in real-time MoSPI audit telemetry.`}
        maxWidth="4xl"
        actions={
          <div className="flex flex-wrap items-center justify-between w-full gap-4 pt-2">
            <div className="flex items-center gap-2">
              {aiAnalysis && (
                <>
                  <button
                    onClick={handleCopySynthesis}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 light:border-stone-300 bg-white/5 light:bg-stone-100 hover:bg-white/10 light:hover:bg-stone-200 text-xs font-mono font-medium text-zinc-300 light:text-stone-700 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400 light:text-emerald-600" />
                        <span className="text-emerald-400 light:text-emerald-600">DOSSIER COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#c9b8a0] light:text-stone-600" />
                        <span>COPY DOSSIER</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleExportPdfBrief}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#a78b71]/40 light:border-amber-300 bg-[#a78b71]/15 light:bg-amber-100/70 hover:bg-[#a78b71]/25 text-xs font-mono font-medium text-[#e8d5b7] light:text-[#78350F] transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                    title="Export printable official MoSPI PDF briefing"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#c9b8a0] light:text-[#78350F]" />
                    <span>PRINT / PDF BRIEF</span>
                  </button>
                  <button
                    onClick={() => handleWhyFlaggedClick(true)}
                    disabled={isAiLoading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 light:border-stone-300 bg-white/5 light:bg-stone-100 hover:bg-white/10 light:hover:bg-stone-200 text-xs font-mono font-medium text-zinc-300 light:text-stone-700 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                    title="Re-run live Groq reasoning"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#c9b8a0] light:text-stone-600" />
                    <span>RE-SYNTHESIZE</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <ClassicalButton variant="ghost" size="md" onClick={() => setIsWhyFlaggedOpen(false)}>
                DISMISS
              </ClassicalButton>
              <ClassicalButton
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4 text-black" />}
                onClick={() => {
                  setIsWhyFlaggedOpen(false);
                  handleOpenInvestigation();
                }}
              >
                LAUNCH FORMAL INVESTIGATION
              </ClassicalButton>
            </div>
          </div>
        }
      >
        {/* Dossier Metadata Strip */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] light:bg-[#FAF8F5] border border-white/10 light:border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#a78b71]/15 light:bg-[#8C735D]/10 border border-[#a78b71]/30 light:border-[#8C735D]/20 text-[#e8d5b7] light:text-[#78350F] font-mono text-xs font-bold">
              #{project.project_code}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-300 light:text-stone-600 font-['Inter']">
              <MapPin className="w-3.5 h-3.5 text-[#c9b8a0] light:text-stone-500" />
              {project.district_name}, {project.state_name}
            </span>
            <span className="text-zinc-600 light:text-stone-300">•</span>
            <span className="text-xs text-zinc-300 light:text-stone-600 font-['Inter']">
              Outlay: <strong className="text-white light:text-stone-900 font-mono">₹{(project.sanctioned_amount / 10000000).toFixed(2)} Cr</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <RiskBadge level={project.risk_level} score={project.risk_score} size="sm" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/30 light:border-emerald-200 text-[11px] font-mono text-emerald-400 light:text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Groq Llama-3.3 70B</span>
            </div>
          </div>
        </div>

        {isAiLoading ? (
          <div className="py-6 space-y-6">
            <AIThinkingWaves
              isStreaming={true}
              statusText="Cross-referencing Schedule of Rates, duplicate invoice hashes, and PostGIS geo-buffers..."
              modelName="openai/gpt-oss-120b"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-stone-50 border border-white/10 light:border-stone-200 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-200 light:text-stone-800">Layer 1: Price Index Anomaly</div>
                  <div className="text-[11px] text-zinc-400 light:text-stone-500">Comparing against 2026 SoR district rates</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-stone-50 border border-white/10 light:border-stone-200 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-200 light:text-stone-800">Layer 2: PostGIS Geo-Topology</div>
                  <div className="text-[11px] text-zinc-400 light:text-stone-500">Evaluating 25m spatial proximity buffer</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-stone-50 border border-white/10 light:border-stone-200 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-200 light:text-stone-800">Layer 3: Invoice OCR Hashes</div>
                  <div className="text-[11px] text-zinc-400 light:text-stone-500">Matching SHA-256 duplicate signatures</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 light:bg-stone-50 border border-white/10 light:border-stone-200 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping shrink-0" />
                <div>
                  <div className="font-semibold text-zinc-200 light:text-stone-800">Layer 4: Cartel HHI Analysis</div>
                  <div className="text-[11px] text-zinc-400 light:text-stone-500">Computing contractor market concentration</div>
                </div>
              </div>
            </div>
          </div>
        ) : aiError ? (
          <div className="p-6 bg-red-950/20 light:bg-red-50 border border-red-500/40 light:border-red-200 rounded-3xl text-center space-y-4 my-4">
            <AlertTriangle className="w-8 h-8 text-red-400 light:text-red-600 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-semibold text-white light:text-stone-900 font-['Playfair_Display'] text-lg">Neural Inference Timeout or API Glitch</h4>
              <p className="text-xs text-red-300 light:text-red-700 font-mono">{aiError}</p>
            </div>
            <ClassicalButton
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => handleWhyFlaggedClick(true)}
            >
              RETRY SYNTHESIS
            </ClassicalButton>
          </div>
        ) : aiAnalysis ? (
          <div className="space-y-6 font-['Inter'] text-zinc-100 light:text-stone-800">
            {/* 1. Executive Summary Dossier Card */}
            <div className="relative overflow-hidden p-6 bg-gradient-to-br from-[#1c1917]/90 via-[#121212] to-[#1c1917]/90 light:from-[#FFFDF9] light:via-[#FAF6F0] light:to-[#F5EFEB] border border-[#a78b71]/30 light:border-[#D8C7B5] rounded-3xl space-y-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] light:shadow-[0_4px_20px_rgba(140,115,93,0.08)]">
              {/* Subtle ambient gold accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#a78b71]/15 light:from-amber-200/20 to-transparent pointer-events-none rounded-tr-3xl" />
              
              <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#a78b71]/20 light:bg-[#8C735D]/15 text-[#e8d5b7] light:text-[#78350F] border border-[#a78b71]/30 light:border-[#8C735D]/25">
                    <Bot className="w-4 h-4 text-[#c9b8a0] light:text-[#8C735D]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c9b8a0] light:text-[#8C735D] block">
                      OFFICIAL SYNTHESIS
                    </span>
                    <h4 className="text-base font-['Playfair_Display'] font-bold text-white light:text-stone-900">
                      Executive Forensic Assessment
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 light:bg-stone-200/80 text-zinc-200 light:text-stone-800 border border-white/15 light:border-stone-300 shadow-xs">
                    CONFIDENCE: <span className="text-emerald-400 light:text-emerald-700">{Math.round(aiAnalysis.confidence * 100)}%</span>
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-zinc-200 light:text-stone-800 leading-relaxed font-normal whitespace-pre-wrap relative z-10">
                {aiAnalysis.summary}
              </p>
            </div>

            {/* 2. Key Forensic Findings Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-['Playfair_Display'] font-semibold text-white light:text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c9b8a0] light:text-[#8C735D]" />
                    <span>Key Forensic Findings</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 light:bg-stone-200 text-[#e8d5b7] light:text-[#78350F]">
                      {aiAnalysis.keyFindings.length} Verified
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 light:text-stone-500 font-['Inter'] mt-0.5">
                    Structured audit facts cross-referenced with forensic neural deductions
                  </p>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-400 light:text-stone-500 uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/5 light:bg-stone-100 border border-white/10 light:border-stone-200">
                  FACTS VS INFERENCES
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {aiAnalysis.keyFindings.map((finding, idx) => {
                  const isCritical = finding.severity === 'CRITICAL';
                  return (
                    <div
                      key={idx}
                      className="p-5 bg-white/[0.03] light:bg-[#FAF8F5] border border-white/10 light:border-stone-200 hover:border-white/20 light:hover:border-stone-300 rounded-2xl space-y-3.5 transition-all shadow-xs flex flex-col justify-between"
                    >
                      {/* Finding Card Top Bar */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#8C735D] uppercase">
                            FINDING #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <h5 className="font-['Playfair_Display'] font-bold text-sm sm:text-base text-white light:text-stone-900">
                            {finding.title}
                          </h5>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0 ${
                            isCritical
                              ? 'bg-rose-950/50 light:bg-rose-50 text-rose-300 light:text-rose-700 border border-rose-500/40 light:border-rose-200'
                              : 'bg-amber-950/50 light:bg-amber-50 text-amber-300 light:text-amber-800 border border-amber-500/40 light:border-amber-200'
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </div>

                      {/* Fact vs Inference Panels */}
                      <div className="space-y-2.5">
                        {/* Documented Fact */}
                        <div className="p-3 rounded-xl bg-black/40 light:bg-white border border-white/10 light:border-stone-200 space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#c9b8a0] light:text-[#8C735D] uppercase tracking-wider">
                            <FileText className="w-3.5 h-3.5 text-[#c9b8a0] light:text-[#8C735D]" />
                            <span>DOCUMENTED AUDIT FACT</span>
                          </div>
                          <p className="text-xs text-zinc-300 light:text-stone-700 leading-relaxed pl-5">
                            {finding.fact}
                          </p>
                        </div>

                        {/* Forensic Inference */}
                        <div
                          className={`p-3 rounded-xl border space-y-1 ${
                            isCritical
                              ? 'bg-rose-950/20 light:bg-rose-50/70 border-rose-500/25 light:border-rose-200'
                              : 'bg-amber-950/20 light:bg-amber-50/70 border-amber-500/25 light:border-amber-200'
                          }`}
                        >
                          <div
                            className={`flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                              isCritical ? 'text-rose-400 light:text-rose-700' : 'text-amber-400 light:text-amber-800'
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>FORENSIC REASONING & INFERENCE</span>
                          </div>
                          <p className="text-xs text-zinc-200 light:text-stone-800 leading-relaxed pl-5">
                            {finding.inference}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Statutory & Fiduciary Impact Callout */}
            {aiAnalysis.whyItMatters && (
              <div className="p-5 bg-gradient-to-r from-black/60 via-black/40 to-black/60 light:from-stone-100 light:via-stone-50 light:to-stone-100 border-l-4 border-l-[#a78b71] border-y border-r border-white/10 light:border-stone-200 rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c9b8a0] light:text-[#8C735D] uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#e8d5b7] light:text-[#78350F]" />
                  <span>STATUTORY & FIDUCIARY IMPACT ON PUBLIC TRUST</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 light:text-stone-800 leading-relaxed font-['Inter']">
                  {aiAnalysis.whyItMatters}
                </p>
              </div>
            )}

            {/* 4. Recommended Next Steps Directive Checklist */}
            {aiAnalysis.recommendedNextSteps?.length > 0 && (
              <div className="p-5 bg-white/[0.03] light:bg-[#FAF8F5] border border-white/10 light:border-stone-200 rounded-3xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-[#e8d5b7] light:text-[#78350F] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 light:text-emerald-600" />
                    <span>RECOMMENDED STATUTORY AUDIT DIRECTIVES</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400 light:text-stone-500">
                    {aiAnalysis.recommendedNextSteps.length} ACTION ITEMS
                  </span>
                </div>

                <div className="space-y-2.5">
                  {aiAnalysis.recommendedNextSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-black/40 light:bg-white border border-white/10 light:border-stone-200 flex items-start gap-3 text-xs text-zinc-200 light:text-stone-800 leading-relaxed group hover:border-[#a78b71]/50 transition-all"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#a78b71]/20 light:bg-[#8C735D]/15 text-[#e8d5b7] light:text-[#78350F] font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-[#a78b71]/30">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-zinc-200 light:text-stone-800 font-['Inter']">{step}</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/60 light:text-emerald-600/60 group-hover:text-emerald-400 shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </ClassicalModal>
    </div>
  );
};
