import React, { useState, useEffect } from 'react';
import { Search, Compass, AlertTriangle, Shield, FileText, Bot, MapPin, X, ArrowRight } from 'lucide-react';
import { CornerFlourish } from './CornerFlourish';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'NAVIGATION' | 'PROJECT' | 'INVESTIGATION' | 'INTELLIGENCE';
  href: string;
  riskScore?: number;
  icon: React.ReactNode;
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    id: 'nav-dashboard',
    title: 'Command Center Overview',
    subtitle: 'Institutional executive metrics and fund dispatch overview',
    category: 'NAVIGATION',
    href: '#/dashboard',
    icon: <Shield className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-projects',
    title: 'Master Project Registry',
    subtitle: 'Full repository of MPLAD sanctioned works & status dossiers',
    category: 'NAVIGATION',
    href: '#/projects',
    icon: <FileText className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-risk',
    title: 'Explainable Risk Matrix',
    subtitle: '7-Layer forensic anomaly detection & scoring engine',
    category: 'INTELLIGENCE',
    href: '#/risk-intelligence',
    icon: <AlertTriangle className="w-4 h-4 text-[#8B2635]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-map',
    title: 'Geospatial Cartography',
    subtitle: 'Interactive PostGIS constituency mapping & asset verification',
    category: 'NAVIGATION',
    href: '#/map',
    icon: <MapPin className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-investigations',
    title: 'Forensic Case Management',
    subtitle: 'CAG audit dossiers, evidentiary timelines & inquiry logs',
    category: 'INVESTIGATION',
    href: '#/investigations',
    icon: <Shield className="w-4 h-4 text-[#8B2635]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-ai',
    title: 'Sentinel AI Intelligence Copilot',
    subtitle: 'Groq Llama 3 70B forensic audit reasoning assistant',
    category: 'INTELLIGENCE',
    href: '#/ai-copilot',
    icon: <Bot className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-ocr',
    title: 'Document OCR & Forensic Extractor',
    subtitle: 'Automated invoice, sanction order & utilization certificate OCR',
    category: 'INTELLIGENCE',
    href: '#/ocr',
    icon: <FileText className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-analytics',
    title: 'Cross-Constituency Analytics',
    subtitle: 'Longitudinal expenditure velocity & anomaly distribution',
    category: 'NAVIGATION',
    href: '#/analytics',
    icon: <Compass className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-reports',
    title: 'Audit Report Generator',
    subtitle: 'Institutional PDF synthesis & parliamentary submission briefs',
    category: 'NAVIGATION',
    href: '#/reports',
    icon: <FileText className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'proj-10291',
    title: 'MPLAD-10291 — Community Center Phulpur',
    subtitle: 'CRITICAL RISK (91/100) — Vendor Collusion & Duplicate Invoicing',
    category: 'PROJECT',
    riskScore: 91,
    href: '#/projects/proj-001',
    icon: <AlertTriangle className="w-4 h-4 text-[#8B2635]" strokeWidth={1.5} />,
  },
  {
    id: 'proj-10482',
    title: 'MPLAD-10482 — Solar Installation High School',
    subtitle: 'HIGH RISK (78/100) — Cost Inflation & Rapid Tranche Drawdowns',
    category: 'PROJECT',
    riskScore: 78,
    href: '#/projects/proj-002',
    icon: <AlertTriangle className="w-4 h-4 text-[#C9A962]" strokeWidth={1.5} />,
  },
  {
    id: 'proj-10901',
    title: 'MPLAD-10901 — Rural Drinking Water Tank',
    subtitle: 'MEDIUM RISK (42/100) — Minor Milestone Discrepancy',
    category: 'PROJECT',
    riskScore: 42,
    href: '#/projects/proj-003',
    icon: <FileText className="w-4 h-4 text-[#9C8B7A]" strokeWidth={1.5} />,
  },
  {
    id: 'case-inv-001',
    title: 'INV-2026-088 — Phulpur Community Center Audit',
    subtitle: 'CAG Formal Inquiry Dossier with 14 verified evidence artifacts',
    category: 'INVESTIGATION',
    href: '#/investigations/INV-2026-088',
    icon: <Shield className="w-4 h-4 text-[#8B2635]" strokeWidth={1.5} />,
  }
];

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled outside or via trigger
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = SEARCH_DATABASE.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (href: string) => {
    window.location.hash = href.replace('#', '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#140F0D]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#251E19] border border-[#C9A962]/50 rounded-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CornerFlourish size="md" color="#C9A962" />

        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#4A3F35] bg-[#1C1714]">
          <Search className="w-5 h-5 text-[#C9A962]" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search archival registry, projects (e.g. 10291), intelligence volumes or cases..."
            className="w-full bg-transparent border-none text-[#E8DFD4] placeholder-[#9C8B7A] font-['Crimson_Pro'] text-base focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-[#9C8B7A] hover:text-[#C9A962] rounded transition-colors"
            title="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#4A3F35]/30">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#9C8B7A] font-['Crimson_Pro']">
              <Compass className="w-8 h-8 mx-auto mb-2 text-[#C9A962]/40 animate-spin" strokeWidth={1.5} />
              <p className="text-sm">No corresponding archival entries found in index.</p>
              <p className="text-xs text-[#9C8B7A]/70 mt-1">Try searching "Phulpur", "MPLAD-10291", "Risk", or "CAG".</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-[2px] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#3D332B] border-l-2 border-[#C9A962]' : 'hover:bg-[#2A231D]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#1C1714] border border-[#4A3F35]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-['Cinzel'] tracking-widest px-1.5 py-0.5 rounded bg-[#1C1714] text-[#C9A962] border border-[#4A3F35]">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-['Cinzel'] font-bold text-[#E8DFD4]">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.riskScore !== undefined && (
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        item.riskScore >= 75
                          ? 'border-[#8B2635] bg-[#8B2635]/20 text-[#fca5a5]'
                          : 'border-[#C9A962] bg-[#C9A962]/20 text-[#C9A962]'
                      }`}>
                        {item.riskScore}/100
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-[#9C8B7A]" strokeWidth={1.5} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#1C1714] border-t border-[#4A3F35] flex items-center justify-between text-[11px] font-['Cinzel'] text-[#9C8B7A]">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1 py-0.5 bg-[#251E19] border border-[#4A3F35] rounded text-[10px] text-[#E8DFD4]">↑</kbd> <kbd className="px-1 py-0.5 bg-[#251E19] border border-[#4A3F35] rounded text-[10px] text-[#E8DFD4]">↓</kbd></span>
            <span>Select: <kbd className="px-1 py-0.5 bg-[#251E19] border border-[#4A3F35] rounded text-[10px] text-[#E8DFD4]">↵</kbd></span>
          </div>
          <span>Close: <kbd className="px-1 py-0.5 bg-[#251E19] border border-[#4A3F35] rounded text-[10px] text-[#E8DFD4]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
