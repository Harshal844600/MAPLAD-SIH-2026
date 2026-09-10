import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Shield,
  MapPin,
  Bot,
  FileText,
  ArrowRight,
  Compass,
  AlertTriangle,
  BarChart3,
  Layers,
  Sparkles,
  ExternalLink,
  Building,
  Calendar,
  Lock,
} from 'lucide-react';
import { appStore } from '../../services/store/appStore';
import { RiskBadge } from './RiskBadge';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'PROJECT' | 'NAVIGATION' | 'ANOMALY' | 'INVESTIGATION';
  path: string;
  icon: React.ReactNode;
  riskScore?: number;
  riskLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  badge?: string;
}

const STATIC_NAV_ITEMS: SearchItem[] = [
  {
    id: 'nav-dashboard',
    title: 'Command Center & Real-Time Overview',
    subtitle: 'Live algorithmic risk surveillance, state KPI metrics & priority forensic ledger',
    category: 'NAVIGATION',
    path: '/dashboard',
    icon: <Compass className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
  {
    id: 'nav-projects',
    title: 'Project Ledger Archive',
    subtitle: 'Search, filter, and inspect across 1,050 registered MPLADS scheme works',
    category: 'NAVIGATION',
    path: '/projects',
    icon: <Layers className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
  {
    id: 'nav-map',
    title: 'Geospatial Cartography & GIS Proximity',
    subtitle: 'Interactive constituency mapping, PostGIS coordinate buffers & spatial overlap analysis',
    category: 'NAVIGATION',
    path: '/map',
    icon: <MapPin className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />,
  },
  {
    id: 'nav-investigations',
    title: 'Forensic Case Management & Dossiers',
    subtitle: 'CAG audit inquiry dossiers, evidentiary timelines & digital case notes',
    category: 'NAVIGATION',
    path: '/investigations',
    icon: <Shield className="w-4 h-4 text-rose-400" strokeWidth={1.75} />,
  },
  {
    id: 'nav-ai',
    title: 'Sentinel AI Intelligence Copilot',
    subtitle: 'Neural multi-layer forensic reasoning, statutory grounding & Groq copilot',
    category: 'NAVIGATION',
    path: '/sentinel-ai',
    icon: <Bot className="w-4 h-4 text-amber-300" strokeWidth={1.75} />,
  },
  {
    id: 'nav-risk',
    title: 'Risk Intelligence Matrix & Methodology',
    subtitle: '6-factor algorithmic risk scoring weights, heuristic weights & calibration',
    category: 'NAVIGATION',
    path: '/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={1.75} />,
  },
  {
    id: 'nav-analytics',
    title: 'National Implementation Analytics',
    subtitle: 'Multi-year expenditure trends, contractor market concentration (HHI) & state comparisons',
    category: 'NAVIGATION',
    path: '/analytics',
    icon: <BarChart3 className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
  {
    id: 'nav-documents',
    title: 'Document OCR & Invoice Extraction',
    subtitle: 'Optical character recognition, sanction order cross-referencing & bill mismatch audits',
    category: 'NAVIGATION',
    path: '/documents',
    icon: <FileText className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
  {
    id: 'nav-reports',
    title: 'Statutory Reports & Dossier Export',
    subtitle: 'Parliamentary and ministerial audit publication packages with printable layouts',
    category: 'NAVIGATION',
    path: '/reports',
    icon: <FileText className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
  {
    id: 'nav-permissions',
    title: 'Institutional Clearances & RBAC Matrix',
    subtitle: 'Multi-level government clearance management, nodal officer permissions & audit scopes',
    category: 'NAVIGATION',
    path: '/permissions',
    icon: <Lock className="w-4 h-4 text-[#c9b8a0]" strokeWidth={1.75} />,
  },
];

const ANOMALY_RULES: SearchItem[] = [
  {
    id: 'rule-fin-cost',
    title: 'FIN-COST-001: Excessive Unit Cost Deviation',
    subtitle: 'Sanctioned or billed cost exceeds standard Schedule of Rates (SoR) benchmark by >40%',
    category: 'ANOMALY',
    path: '/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={1.75} />,
    badge: 'FINANCIAL',
  },
  {
    id: 'rule-fin-dup',
    title: 'FIN-DUP-002: Duplicate Payment Invoices / References',
    subtitle: 'Multiple disbursements sharing identical invoice numbers or hash signatures across bills',
    category: 'ANOMALY',
    path: '/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-rose-500" strokeWidth={1.75} />,
    badge: 'FINANCIAL',
  },
  {
    id: 'rule-fin-util',
    title: 'FIN-UTIL-003: Abnormal 100% Fund Drawdown on Stalled Works',
    subtitle: 'Full treasury fund liquidation while physical milestone verification reports remain incomplete',
    category: 'ANOMALY',
    path: '/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" strokeWidth={1.75} />,
    badge: 'FINANCIAL',
  },
  {
    id: 'rule-time-seq',
    title: 'TIME-SEQ-001: Inverted Chronological Sequence Conflict',
    subtitle: 'Physical work completion or contractor billing signed prior to administrative sanction date',
    category: 'ANOMALY',
    path: '/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={1.75} />,
    badge: 'TIMELINE',
  },
  {
    id: 'rule-geo-dup',
    title: 'GEO-DUP-001: PostGIS Proximity Buffer Overlap (<25m)',
    subtitle: 'GPS coordinates conflict with prior funded assets, indicating ghost infrastructure risk',
    category: 'ANOMALY',
    path: '/risk-intelligence',
    icon: <MapPin className="w-4 h-4 text-rose-500" strokeWidth={1.75} />,
    badge: 'GEOSPATIAL',
  },
  {
    id: 'rule-doc-ocr',
    title: 'DOC-OCR-001: Sanction Order Text Extraction Mismatch',
    subtitle: 'AI OCR identifies discrepancy between gazetted sanction values and contractor invoice claims',
    category: 'ANOMALY',
    path: '/documents',
    icon: <FileText className="w-4 h-4 text-amber-400" strokeWidth={1.75} />,
    badge: 'DOCUMENT',
  },
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PROJECTS' | 'ANOMALIES' | 'NAVIGATION'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Dynamic project search results from appStore
  const dynamicProjectResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const allProjects = appStore.getAllProjects();

    if (!q) {
      // Default: Show top high-risk / critical projects
      return allProjects
        .filter((p) => p.risk_level === 'CRITICAL' || p.risk_score >= 80)
        .slice(0, 8)
        .map(
          (p): SearchItem => ({
            id: p.id,
            title: `#${p.project_code} — ${p.title}`,
            subtitle: `${p.district_name}, ${p.state_name} • ₹${(p.sanctioned_amount / 100000).toFixed(1)} Lakh Sanctioned • Vendor: ${p.vendor_name || 'Designated Contractor'}`,
            category: 'PROJECT',
            path: `/projects/${p.project_code}`,
            icon: <FileText className="w-4 h-4 text-rose-400" strokeWidth={1.75} />,
            riskScore: p.risk_score,
            riskLevel: p.risk_level,
          })
        );
    }

    // Filter projects matching search term
    return allProjects
      .filter(
        (p) =>
          p.project_code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.district_name.toLowerCase().includes(q) ||
          p.state_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          p.vendor_name?.toLowerCase().includes(q)
      )
      .slice(0, 15)
      .map(
        (p): SearchItem => ({
          id: p.id,
          title: `#${p.project_code} — ${p.title}`,
          subtitle: `${p.district_name}, ${p.state_name} • ${p.category_name} • ₹${(p.sanctioned_amount / 100000).toFixed(1)}L`,
          category: 'PROJECT',
          path: `/projects/${p.project_code}`,
          icon: <FileText className={`w-4 h-4 ${p.risk_level === 'CRITICAL' ? 'text-rose-400' : 'text-[#c9b8a0]'}`} strokeWidth={1.75} />,
          riskScore: p.risk_score,
          riskLevel: p.risk_level,
        })
      );
  }, [query]);

  // Combined Search List
  const allResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filteredNav = STATIC_NAV_ITEMS.filter(
      (n) => !q || n.title.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q)
    );

    const filteredAnomalies = ANOMALY_RULES.filter(
      (a) =>
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.badge?.toLowerCase().includes(q)
    );

    if (activeTab === 'PROJECTS') return dynamicProjectResults;
    if (activeTab === 'ANOMALIES') return filteredAnomalies;
    if (activeTab === 'NAVIGATION') return filteredNav;

    // 'ALL' tab
    return [...filteredNav.slice(0, 4), ...dynamicProjectResults.slice(0, 8), ...filteredAnomalies.slice(0, 4)];
  }, [query, activeTab, dynamicProjectResults]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length > 0 ? (prev + 1) % allResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length > 0 ? (prev - 1 + allResults.length) % allResults.length : 0));
      } else if (e.key === 'Enter' && allResults[selectedIndex]) {
        e.preventDefault();
        handleNavigate(allResults[selectedIndex].path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allResults]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 pt-[8vh] sm:pt-[12vh] bg-black/80 light:bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-[#111111] light:bg-white border border-white/15 light:border-slate-300 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(167,139,113,0.25)] light:shadow-[0_25px_60px_rgba(15,23,42,0.15)] overflow-hidden z-10 flex flex-col max-h-[80vh] font-['Inter'] animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/10 light:border-slate-200 bg-white/[0.02] light:bg-slate-50">
          <Search className="w-5 h-5 text-[#c9b8a0] light:text-[#8C735D] shrink-0" strokeWidth={1.75} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search 1,050 works, anomaly codes (FIN-COST), districts..."
            className="w-full bg-transparent border-none outline-none text-white light:text-slate-900 text-sm sm:text-base placeholder:text-gray-500 light:placeholder:text-slate-400 font-['Inter']"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-black/60 light:bg-slate-200 border border-white/10 light:border-slate-300 rounded-md text-[#c9b8a0] light:text-slate-700">
            ESC
          </kbd>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-black/30 light:bg-slate-100 border-b border-white/5 light:border-slate-200 text-xs font-mono font-bold overflow-x-auto">
          {(['ALL', 'PROJECTS', 'ANOMALIES', 'NAVIGATION'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#c9b8a0]/20 light:bg-white text-[#e8d5b7] light:text-slate-900 border border-[#c9b8a0]/40 light:border-slate-300 shadow-xs'
                  : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="text-[10px] text-gray-500 light:text-slate-400 ml-auto font-mono">
            {allResults.length} RESULTS
          </span>
        </div>

        {/* Results List */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar max-h-[52vh]"
        >
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400 light:text-slate-500">
              <Search className="w-8 h-8 text-gray-600 light:text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No matching records found for "{query}"</p>
              <p className="text-xs mt-1 text-gray-500">Try searching for a project code like "MPLAD-10291" or rule "FIN-COST"</p>
            </div>
          ) : (
            allResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.08] light:bg-amber-50/80 border border-[#a78b71]/50 light:border-amber-300 shadow-sm'
                      : 'hover:bg-white/[0.03] light:hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.category === 'PROJECT' && item.riskScore && item.riskScore >= 80
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                          : item.category === 'ANOMALY'
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                          : 'bg-white/5 light:bg-slate-100 border-white/10 light:border-slate-200 text-gray-300 light:text-slate-700'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-white light:text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 light:bg-slate-200 text-zinc-300 light:text-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 light:text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.riskScore !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          item.riskScore >= 80
                            ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                            : item.riskScore >= 60
                            ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {item.riskScore}/100
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-[#e8d5b7]' : 'text-gray-600 light:text-slate-400'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-2.5 bg-black/40 light:bg-slate-100 border-t border-white/10 light:border-slate-200 flex items-center justify-between text-[11px] text-gray-400 light:text-slate-600 font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/10 light:bg-white rounded border border-white/10 light:border-slate-300">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white/10 light:bg-white rounded border border-white/10 light:border-slate-300">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/10 light:bg-white rounded border border-white/10 light:border-slate-300">↵</kbd> to select
            </span>
          </div>
          <span className="hidden sm:inline text-[#c9b8a0] font-bold">MPLAD Sentinel Command Palette</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
