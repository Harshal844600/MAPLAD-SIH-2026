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
  BookOpen,
} from 'lucide-react';
import { CornerFlourish } from '../ui';

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen = false, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, volume: 'VOL I' },
    { to: '/projects', label: 'Project Archive', icon: FolderGit2, count: '1,050' },
    { to: '/risk', label: 'Risk Intelligence', icon: ShieldAlert, volume: 'VOL II' },
    { to: '/map', label: 'Geographic Map', icon: MapPin },
    { to: '/investigations', label: 'Investigations', icon: FileSearch, count: '1' },
    { to: '/sentinel-ai', label: 'Sentinel AI Copilot', icon: Bot, highlight: true },
    { to: '/documents', label: 'Document Archive', icon: FileText },
    { to: '/analytics', label: 'Macro Analytics', icon: BarChart3 },
    { to: '/reports', label: 'Reports & Dossiers', icon: FileCheck, volume: 'VOL V' },
    { to: '/admin', label: 'Archive Governance', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#1C1714]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-[69px] left-0 z-40 h-[calc(100vh-69px)] w-72 bg-[#1C1714] border-r border-[#4A3F35] p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Section Overline */}
          <div className="px-3 py-2 border-b border-[#4A3F35] flex items-center justify-between">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.25em] text-[#C9A962] uppercase">
              ARCHIVE REGISTER
            </span>
            <span className="text-[#C9A962] text-xs select-none">✶</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 font-['Cinzel'] text-xs uppercase tracking-[0.15em] rounded-[2px] transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-[#251E19] text-[#C9A962] font-bold border-l-2 border-[#C9A962] shadow-sm'
                        : item.highlight
                        ? 'text-[#C9A962] hover:bg-[#251E19] hover:text-[#D4B872]'
                        : 'text-[#9C8B7A] hover:text-[#E8DFD4] hover:bg-[#251E19]'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-[#C9A962]" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </div>

                  {item.volume && (
                    <span className="text-[9px] font-['Cinzel'] tracking-widest text-[#9C8B7A]">
                      {item.volume}
                    </span>
                  )}
                  {item.count && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#251E19] text-[#9C8B7A] border border-[#4A3F35] rounded-[2px]">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Flagship Case Callout */}
        <div className="pt-4 border-t border-[#4A3F35]">
          <a
            href="#/projects/MPLAD-10291"
            className="block p-3 bg-[#251E19] border border-[#8B2635]/60 hover:border-[#8B2635] rounded-[4px] transition-colors relative group"
          >
            <div className="flex items-center justify-between text-[10px] font-['Cinzel'] font-bold tracking-widest text-[#fca5a5] uppercase mb-1">
              <span>PRIORITY CASE FILE</span>
              <span className="text-[#fca5a5]">91/100</span>
            </div>
            <p className="text-sm font-['Cormorant_Garamond'] font-bold text-[#E8DFD4] leading-tight group-hover:text-[#fca5a5] transition-colors">
              #MPLAD-10291 (Phulpur)
            </p>
            <p className="text-xs text-[#9C8B7A] font-['Crimson_Pro'] italic mt-0.5">
              5 Anomalies • Multi-layer Conflict
            </p>
          </a>
        </div>
      </aside>
    </>
  );
};
