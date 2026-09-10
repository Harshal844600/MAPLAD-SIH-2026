import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  ShieldAlert,
  MapPin,
  FileSearch,
  Bot,
  FileText,
  BarChart3,
  FileCheck,
  Settings,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { AppPermission } from '../../types';
import { KeyRound } from 'lucide-react';
import { useCurrentUser } from '../../services/store/useCurrentUser';

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen = false, onClose }) => {
  const { roleMetadata, can } = useCurrentUser();

  const allNavItems: {
    to: string;
    label: string;
    icon: any;
    volume?: string;
    count?: string;
    highlight?: boolean;
    permission?: AppPermission;
  }[] = [
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, volume: 'VOL I', permission: 'dashboard.view' },
    { to: '/projects', label: 'Project Ledgers', icon: FolderGit2, count: '1,050', permission: 'projects.view' },
    { to: '/risk', label: 'Risk Intelligence', icon: ShieldAlert, volume: 'VOL II', permission: 'risk.view' },
    { to: '/map', label: 'Geographic Map', icon: MapPin, permission: 'geo.view' },
    { to: '/investigations', label: 'Investigations', icon: FileSearch, count: '1', permission: 'anomaly.view' },
    { to: '/sentinel-ai', label: 'Sentinel AI Copilot', icon: Bot, highlight: true, permission: 'ai.view' },
    { to: '/documents', label: 'Document Archive', icon: FileText, permission: 'documents.ocr' },
    { to: '/analytics', label: 'Macro Analytics', icon: BarChart3, permission: 'analytics.view' },
    { to: '/reports', label: 'Reports & Dossiers', icon: FileCheck, volume: 'VOL V', permission: 'reports.view' },
    { to: '/permissions', label: 'Clearance Matrix', icon: KeyRound, permission: 'dashboard.view' },
    { to: '/admin', label: 'Archive Governance', icon: Settings, permission: 'settings.manage' },
  ];

  // Only show navigation items permitted for the active role
  const visibleNavItems = allNavItems.filter(
    (item) => !item.permission || can(item.permission)
  );


  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-[73px] left-0 z-40 h-[calc(100vh-73px)] w-72 bg-[#0a0a0a]/95 light:bg-white/95 backdrop-blur-xl border-r border-white/10 light:border-slate-200 p-4 flex flex-col justify-between overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Active Role & Clearance Badge */}
          <div className="p-3.5 bg-white/[0.03] light:bg-slate-50 border border-white/10 light:border-slate-200 rounded-2xl space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#c9b8a0] light:text-[#8C735D]">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#a78b71] light:text-[#8C735D]" /> ACTIVE PROFILE
              </span>
              <span className="px-2 py-0.5 bg-black/60 light:bg-slate-200 text-zinc-300 light:text-slate-800 text-[9px] border border-white/10 light:border-slate-300 rounded-full">
                {roleMetadata.clearanceLevel}
              </span>
            </div>
            <div className="font-['Playfair_Display'] font-semibold text-sm text-white light:text-slate-900 truncate">
              {roleMetadata.title}
            </div>
            <div className="text-[11px] font-['Inter'] text-gray-400 light:text-slate-500 truncate">
              {roleMetadata.department}
            </div>
          </div>

          {/* Section Overline */}
          <div className="px-3 py-1 border-b border-white/10 light:border-slate-200 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#c9b8a0] light:text-[#8C735D] uppercase">
              NAVIGATION CONSOLE
            </span>
            <span className="text-[#a78b71] light:text-[#8C735D] text-xs select-none">✦</span>
          </div>

          {/* Navigation Links - Filtered by Active Role */}
          <nav className="space-y-1" aria-label="Main Navigation">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 font-['Inter'] text-xs font-semibold tracking-wider rounded-xl transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-gradient-to-r from-[#c9b8a0]/20 to-[#a78b71]/10 light:from-amber-100 light:to-amber-50 text-white light:text-[#78350F] font-bold border-l-2 border-[#c9b8a0] light:border-[#8C735D] shadow-[0_0_20px_rgba(167,139,113,0.15)] light:shadow-[0_2px_8px_rgba(140,115,93,0.1)]'
                        : item.highlight
                        ? 'text-[#e8d5b7] light:text-[#78350F] hover:bg-white/5 light:hover:bg-amber-50/60 hover:text-white light:hover:text-[#78350F]'
                        : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-950 hover:bg-white/5 light:hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-[#c9b8a0] light:text-[#8C735D]" strokeWidth={1.75} />
                    <span>{item.label}</span>
                  </div>

                  {item.volume ? (
                    <span className="text-[9px] font-mono tracking-wider text-gray-400 light:text-slate-400">
                      {item.volume}
                    </span>
                  ) : item.count ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 light:bg-slate-100 text-gray-300 light:text-slate-700 border border-white/10 light:border-slate-200 rounded-full">
                      {item.count}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Flagship Case Callout */}
        <div className="pt-4 border-t border-white/10 light:border-slate-200">
          <a
            href="#/projects/proj-10291"
            className="block p-3.5 bg-rose-950/20 light:bg-rose-50 border border-rose-500/30 light:border-rose-200 hover:border-rose-500/60 rounded-2xl transition-all relative group shadow-[0_0_20px_rgba(239,68,68,0.15)] light:shadow-[0_2px_10px_rgba(225,29,72,0.08)]"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-widest text-rose-300 light:text-rose-700 uppercase mb-1">
              <span>PRIORITY CASE FILE</span>
              <span className="font-mono">91/100</span>
            </div>
            <h4 className="font-['Playfair_Display'] text-sm font-semibold text-white light:text-slate-900 group-hover:text-[#e8d5b7] light:group-hover:text-[#78350F] transition-colors line-clamp-1">
              #MPLAD-10291 (Phulpur)
            </h4>
            <p className="text-[11px] font-['Inter'] text-gray-400 light:text-slate-600 line-clamp-1 mt-0.5">
              Duplicate invoice & 8m overlap
            </p>
          </a>
        </div>
      </aside>
    </>
  );
};
