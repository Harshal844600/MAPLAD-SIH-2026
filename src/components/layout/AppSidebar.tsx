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
  UserCheck,
} from 'lucide-react';
import { CornerFlourish } from '../ui';
import { useCurrentUser } from '../../services/store/useCurrentUser';
import { AppPermission } from '../../services/store/rbac';

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
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, volume: 'VOL I', permission: 'VIEW_DASHBOARD' },
    { to: '/projects', label: 'Project Archive', icon: FolderGit2, count: '1,050', permission: 'VIEW_PROJECTS' },
    { to: '/risk', label: 'Risk Intelligence', icon: ShieldAlert, volume: 'VOL II', permission: 'VIEW_RISK_INTELLIGENCE' },
    { to: '/map', label: 'Geographic Map', icon: MapPin, permission: 'VIEW_MAP' },
    { to: '/investigations', label: 'Investigations', icon: FileSearch, count: '1', permission: 'VIEW_INVESTIGATIONS' },
    { to: '/sentinel-ai', label: 'Sentinel AI Copilot', icon: Bot, highlight: true, permission: 'VIEW_AI_COPILOT' },
    { to: '/documents', label: 'Document Archive', icon: FileText, permission: 'VIEW_DOCUMENTS_OCR' },
    { to: '/analytics', label: 'Macro Analytics', icon: BarChart3, permission: 'VIEW_ANALYTICS' },
    { to: '/reports', label: 'Reports & Dossiers', icon: FileCheck, volume: 'VOL V', permission: 'EXPORT_REPORTS' },
    { to: '/admin', label: 'Archive Governance', icon: Settings, permission: 'MANAGE_ADMIN_SETTINGS' },
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
          className="fixed inset-0 bg-[#1C1714]/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-[69px] left-0 z-40 h-[calc(100vh-69px)] w-72 bg-[#1C1714] border-r border-[#4A3F35] p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Active Role & Clearance Badge */}
          <div className="p-3 bg-[#251E19] border border-[#C9A962]/40 rounded-[3px] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-['Cinzel'] font-bold text-[#C9A962]">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> ACTIVE PROFILE
              </span>
              <span className="px-1.5 py-0.2 bg-[#1C1714] text-[9px] border border-[#4A3F35] rounded">
                {roleMetadata.clearanceLevel}
              </span>
            </div>
            <div className="font-['Cormorant_Garamond'] font-bold text-sm text-[#E8DFD4] truncate">
              {roleMetadata.title}
            </div>
            <div className="text-[10px] font-['Crimson_Pro'] text-[#9C8B7A] truncate">
              {roleMetadata.department}
            </div>
          </div>

          {/* Section Overline */}
          <div className="px-3 py-1.5 border-b border-[#4A3F35] flex items-center justify-between">
            <span className="text-[10px] font-['Cinzel'] font-bold tracking-[0.25em] text-[#C9A962] uppercase">
              ARCHIVE REGISTER
            </span>
            <span className="text-[#C9A962] text-xs select-none">✶</span>
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

                  {item.volume ? (
                    <span className="text-[9px] font-['Cinzel'] tracking-widest text-[#9C8B7A]">
                      {item.volume}
                    </span>
                  ) : item.count ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#251E19] text-[#9C8B7A] border border-[#4A3F35] rounded-[2px]">
                      {item.count}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Flagship Case Callout */}
        <div className="pt-4 border-t border-[#4A3F35]">
          <a
            href="#/projects/proj-10291"
            className="block p-3 bg-[#251E19] border border-[#8B2635]/60 hover:border-[#8B2635] rounded-[4px] transition-colors relative group"
          >
            <div className="flex items-center justify-between text-[10px] font-['Cinzel'] font-bold tracking-widest text-[#fca5a5] uppercase mb-1">
              <span>PRIORITY CASE FILE</span>
              <span className="text-[#fca5a5]">91/100</span>
            </div>
            <h4 className="font-['Cormorant_Garamond'] text-sm font-bold text-[#E8DFD4] group-hover:text-[#C9A962] transition-colors line-clamp-1">
              #MPLAD-10291 (Phulpur)
            </h4>
            <p className="text-[11px] font-['Crimson_Pro'] text-[#9C8B7A] line-clamp-1 italic">
              Duplicate invoice & 8m overlap
            </p>
          </a>
        </div>
      </aside>
    </>
  );
};
