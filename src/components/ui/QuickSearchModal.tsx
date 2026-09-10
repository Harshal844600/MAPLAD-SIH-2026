import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Shield, MapPin, Bot, FileText, ArrowRight, Compass } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'PROJECT' | 'NAVIGATION' | 'INVESTIGATION' | 'INTELLIGENCE';
  href: string;
  icon: React.ReactNode;
  riskScore?: number;
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    id: 'nav-dashboard',
    title: 'Command Center & Real-Time Overview',
    subtitle: 'High-level risk distribution, KPIs & priority forensic queue',
    category: 'NAVIGATION',
    href: '#/dashboard',
    icon: <Compass className="w-4 h-4 text-[#a78b71]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-projects',
    title: 'Project Ledger Archive',
    subtitle: 'Search & filter across 1,050 registered MPLADS works',
    category: 'NAVIGATION',
    href: '#/projects',
    icon: <FileText className="w-4 h-4 text-[#a78b71]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-map',
    title: 'Geospatial Cartography',
    subtitle: 'Interactive PostGIS constituency mapping & asset proximity verification',
    category: 'NAVIGATION',
    href: '#/map',
    icon: <MapPin className="w-4 h-4 text-[#a78b71]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-investigations',
    title: 'Forensic Case Management',
    subtitle: 'CAG audit dossiers, evidentiary timelines & inquiry logs',
    category: 'INVESTIGATION',
    href: '#/investigations',
    icon: <Shield className="w-4 h-4 text-rose-500" strokeWidth={1.5} />,
  },
  {
    id: 'nav-ai',
    title: 'Sentinel AI Intelligence Copilot',
    subtitle: 'Groq Llama 3.3 70B forensic audit reasoning assistant',
    category: 'INTELLIGENCE',
    href: '#/sentinel-ai',
    icon: <Bot className="w-4 h-4 text-[#a78b71]" strokeWidth={1.5} />,
  },
  {
    id: 'nav-documents',
    title: 'Document OCR Archive',
    subtitle: 'Extract & verify utilization certificates and contractor invoices',
    category: 'NAVIGATION',
    href: '#/documents',
    icon: <FileText className="w-4 h-4 text-[#a78b71]" strokeWidth={1.5} />,
  },
  {
    id: 'proj-10291',
    title: 'Construction of RCC Drain Saidabad Ward 4',
    subtitle: 'MPLAD-10291 • Prayagraj, Uttar Pradesh • 120% SoR Inflation & Duplicate Payout',
    category: 'PROJECT',
    href: '#/projects/MPLAD-10291',
    icon: <FileText className="w-4 h-4 text-rose-400" strokeWidth={1.5} />,
    riskScore: 91,
  },
  {
    id: 'proj-10471',
    title: 'Panchayat Bhavan Extension & Citizen Service Kendra',
    subtitle: 'MPLAD-10471 • Indore, Madhya Pradesh • Ghost Asset GPS Overlap',
    category: 'PROJECT',
    href: '#/projects/MPLAD-10471',
    icon: <FileText className="w-4 h-4 text-rose-400" strokeWidth={1.5} />,
    riskScore: 97,
  },
  {
    id: 'proj-10790',
    title: 'Construction of Public Health Clinic Sub-center',
    subtitle: 'MPLAD-10790 • Gorakhpur, Uttar Pradesh • Blacklisted Contractor Engagement',
    category: 'PROJECT',
    href: '#/projects/MPLAD-10790',
    icon: <FileText className="w-4 h-4 text-rose-400" strokeWidth={1.5} />,
    riskScore: 97,
  },
  {
    id: 'inv-101',
    title: 'Active Case: Phulpur Drain Duplicate Payout & Invoice Recycling',
    subtitle: 'INSP-2026-0891 • Assigned to Super Administrator',
    category: 'INVESTIGATION',
    href: '#/investigations/inv-case-101',
    icon: <Shield className="w-4 h-4 text-amber-400" strokeWidth={1.5} />,
    riskScore: 91,
  },
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        handleSelect(filtered[selectedIndex].href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  const filtered = SEARCH_DATABASE.filter((item) => {
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

  if (!isOpen || !mounted) return null;

  const modalMarkup = (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4 bg-black/70 light:bg-slate-900/30 backdrop-blur-md light:backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#121212] light:bg-white border border-white/15 light:border-slate-200 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] light:shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 light:border-slate-200 bg-white/[0.02] light:bg-slate-50">
          <Search className="w-5 h-5 text-[#c9b8a0] light:text-[#8C735D]" strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search dossiers, projects (e.g. 10291), anomaly codes..."
            className="w-full bg-transparent border-none text-white light:text-slate-900 placeholder:text-gray-500 font-['Inter'] text-base focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 rounded-full transition-colors cursor-pointer"
            title="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-400 light:text-slate-500 font-['Inter']">
              <Compass className="w-8 h-8 mx-auto mb-2 text-[#a78b71]/40 animate-spin" strokeWidth={1.5} />
              <p className="text-sm">No corresponding archival entries found in index.</p>
              <p className="text-xs text-gray-500 mt-1">Try searching "Phulpur", "MPLAD-10291", "Risk", or "CAG".</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#a78b71]/15 light:bg-[#8C735D]/10 border border-[#a78b71]/30 light:border-[#8C735D]/20'
                      : 'hover:bg-white/5 light:hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] light:bg-white border border-white/10 light:border-slate-200">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-black/40 light:bg-slate-100 text-[#c9b8a0] light:text-[#8C735D] border border-white/10 light:border-slate-200">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-semibold font-['Playfair_Display'] text-white light:text-slate-900">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 light:text-slate-600 font-['Inter'] mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.riskScore !== undefined && (
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        item.riskScore >= 75
                          ? 'border-rose-500/40 bg-rose-950/30 text-rose-300'
                          : 'border-[#a78b71]/40 bg-[#a78b71]/20 text-[#e8d5b7]'
                      }`}>
                        {item.riskScore}/100
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-400 light:text-slate-500" strokeWidth={1.5} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 bg-black/40 light:bg-slate-50 border-t border-white/10 light:border-slate-200 flex items-center justify-between text-[11px] font-mono text-gray-400 light:text-slate-500">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="px-1.5 py-0.5 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded text-[10px]">↓</kbd></span>
            <span>Select: <kbd className="px-1.5 py-0.5 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded text-[10px]">↵</kbd></span>
          </div>
          <span>Close: <kbd className="px-1.5 py-0.5 bg-white/5 light:bg-white border border-white/10 light:border-slate-200 rounded text-[10px]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
};
